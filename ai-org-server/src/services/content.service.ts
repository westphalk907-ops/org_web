import type { Prisma } from '@prisma/client'
import { prisma } from '../db/client.js'
import { ApiError } from '../utils/apiError.js'
import { renderMarkdown, estimateReadingTime } from '../utils/markdown.js'

export interface ListContentsParams {
  category?: string
  navSection?: string
  isPublished?: boolean
  keyword?: string
  page?: number
  pageSize?: number
  /** 是否包含已软删的内容（默认 false） */
  includeDeleted?: boolean
}

export const contentService = {
  async listForAdmin(params: ListContentsParams) {
    const page = Math.max(1, params.page || 1)
    const pageSize = Math.min(100, Math.max(1, params.pageSize || 20))
    const skip = (page - 1) * pageSize

    const where: Prisma.ContentWhereInput = {}
    if (params.category) where.category = params.category as any
    if (params.navSection) where.navSection = params.navSection as any
    if (params.isPublished !== undefined) where.isPublished = params.isPublished
    if (!params.includeDeleted) where.deletedAt = null
    if (params.keyword) {
      where.OR = [
        { title: { contains: params.keyword, mode: 'insensitive' } },
        { excerpt: { contains: params.keyword, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.content.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.content.count({ where }),
    ])

    return { items, total, page, pageSize }
  },

  async listPublic(params: {
    category?: string
    navSection?: string
    nodeSlug?: string
    seriesSlug?: string
    subTopicSlug?: string
    limit?: number
  }) {
    const where: Prisma.ContentWhereInput = {
      isPublished: true,
      deletedAt: null,
    }
    if (params.category) where.category = params.category as any
    if (params.navSection) where.navSection = params.navSection as any
    if (params.nodeSlug) where.nodeSlug = params.nodeSlug
    if (params.seriesSlug) where.series = { slug: params.seriesSlug, isPublished: true, deletedAt: null }
    if (params.subTopicSlug) {
      // subTopicSlug 必须配合 seriesSlug 才唯一
      where.subTopic = { slug: params.subTopicSlug }
    }

    return prisma.content.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: params.limit,
      include: {
        series: { select: { id: true, slug: true, title: true } },
        subTopic: { select: { id: true, slug: true, name: true } },
      },
    })
  },

  async getBySlug(slug: string, incrementView = false) {
    const c = await prisma.content.findFirst({
      where: { slug, isPublished: true, deletedAt: null },
      include: {
        series: { select: { id: true, slug: true, title: true } },
        subTopic: { select: { id: true, slug: true, name: true } },
      },
    })
    if (!c) throw ApiError.notFound(`文章不存在: ${slug}`)
    if (incrementView) {
      await prisma.content.update({
        where: { id: c.id },
        data: { viewCount: { increment: 1 } },
      })
    }
    return c
  },

  async getById(id: string) {
    const c = await prisma.content.findUnique({ where: { id } })
    if (!c) throw ApiError.notFound(`文章不存在: ${id}`)
    return c
  },

  async create(input: Prisma.ContentCreateInput) {
    const exists = await prisma.content.findUnique({ where: { slug: input.slug } })
    if (exists) throw ApiError.conflict(`Slug 已存在: ${input.slug}`)

    const html = renderMarkdown(input.content)
    const readingTime = input.readingTime ?? estimateReadingTime(input.content)

    return prisma.content.create({
      data: {
        ...input,
        contentHtml: html,
        readingTime,
      },
    })
  },

  async update(id: string, input: Prisma.ContentUpdateInput) {
    const c = await prisma.content.findUnique({ where: { id } })
    if (!c) throw ApiError.notFound(`文章不存在: ${id}`)

    if (input.slug && input.slug !== c.slug) {
      const dup = await prisma.content.findUnique({ where: { slug: input.slug as string } })
      if (dup) throw ApiError.conflict(`Slug 已存在: ${input.slug}`)
    }

    const data: Prisma.ContentUpdateInput = { ...input }

    // Markdown 改了 → 重渲染
    if (typeof input.content === 'string') {
      data.contentHtml = renderMarkdown(input.content)
      data.readingTime = estimateReadingTime(input.content)
    }

    return prisma.content.update({ where: { id }, data })
  },

  async remove(id: string) {
    const c = await prisma.content.findUnique({ where: { id } })
    if (!c) throw ApiError.notFound(`文章不存在: ${id}`)
    return prisma.content.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  },
}
