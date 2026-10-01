import type { Prisma } from '@prisma/client'
import { prisma } from '../db/client.js'
import { ApiError } from '../utils/apiError.js'

export interface ListResourcesParams {
  type?: string
  featured?: boolean
  keyword?: string
  page?: number
  pageSize?: number
}

export const resourceService = {
  /**
   * 后台列表（包含未发布/已删除），分页
   */
  async listForAdmin(params: ListResourcesParams) {
    const page = Math.max(1, params.page || 1)
    const pageSize = Math.min(100, Math.max(1, params.pageSize || 20))
    const skip = (page - 1) * pageSize

    const where: Prisma.ResourceWhereInput = {}
    if (params.type) where.type = params.type as any
    if (params.featured !== undefined) where.isFeatured = params.featured
    if (params.keyword) {
      where.OR = [
        { title: { contains: params.keyword, mode: 'insensitive' } },
        { summary: { contains: params.keyword, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }],
        skip,
        take: pageSize,
      }),
      prisma.resource.count({ where }),
    ])

    return { items, total, page, pageSize }
  },

  /**
   * 前台公开列表（已发布、未删除）
   */
  async listPublic(params: { type?: string; featured?: boolean; limit?: number }) {
    const where: Prisma.ResourceWhereInput = {
      deletedAt: null,
    }
    if (params.type) where.type = params.type as any
    if (params.featured !== undefined) where.isFeatured = params.featured

    return prisma.resource.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { publishedAt: 'desc' }],
      take: params.limit,
    })
  },

  /**
   * 通过 slug 查详情
   */
  async getBySlug(slug: string, incrementView = false) {
    const r = await prisma.resource.findFirst({
      where: { slug, deletedAt: null },
    })
    if (!r) throw ApiError.notFound(`资源不存在: ${slug}`)
    if (incrementView) {
      await prisma.resource.update({
        where: { id: r.id },
        data: { viewCount: { increment: 1 } },
      })
    }
    return r
  },

  /**
   * 通过 ID 查详情（后台用）
   */
  async getById(id: string) {
    const r = await prisma.resource.findUnique({ where: { id } })
    if (!r) throw ApiError.notFound(`资源不存在: ${id}`)
    return r
  },

  /**
   * 创建
   */
  async create(input: Prisma.ResourceCreateInput) {
    // slug 唯一性检查
    const exists = await prisma.resource.findUnique({ where: { slug: input.slug } })
    if (exists) throw ApiError.conflict(`Slug 已存在: ${input.slug}`)
    return prisma.resource.create({ data: input })
  },

  /**
   * 更新
   */
  async update(id: string, input: Prisma.ResourceUpdateInput) {
    const r = await prisma.resource.findUnique({ where: { id } })
    if (!r) throw ApiError.notFound(`资源不存在: ${id}`)

    // 如果改 slug，校验唯一
    if (input.slug && input.slug !== r.slug) {
      const dup = await prisma.resource.findUnique({ where: { slug: input.slug as string } })
      if (dup) throw ApiError.conflict(`Slug 已存在: ${input.slug}`)
    }

    return prisma.resource.update({ where: { id }, data: input })
  },

  /**
   * 软删除
   */
  async remove(id: string) {
    const r = await prisma.resource.findUnique({ where: { id } })
    if (!r) throw ApiError.notFound(`资源不存在: ${id}`)
    return prisma.resource.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  },

  /**
   * 增加下载次数
   */
  async incrementDownload(id: string) {
    await prisma.resource.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    })
  },
}
