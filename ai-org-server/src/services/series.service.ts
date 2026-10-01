/**
 * Series 服务
 * --------------------------------------------------------------------------
 * 后台管理使用：CRUD + 子主题维护
 *
 * 设计要点：
 *  - slug 全局唯一
 *  - navSection 必须是 learn / understand / experience 之一
 *  - 软删除（deletedAt）—— 已绑定文章不会被级联删除
 *  - 删除前做"引用计数校验"：如果该系列下有发布文章，提示运营先去后台清理
 *  - 子主题（SubTopic）一起写入 / 更新 / 删除（嵌套写入）
 */
import type { Prisma } from '@prisma/client'
import { prisma } from '../db/client.js'
import { ApiError } from '../utils/apiError.js'

export interface SubTopicInput {
  /** 不传 = 新建；传 = 更新已存在的 */
  id?: string
  slug: string
  name: string
  sortOrder?: number
}

export interface UpsertSeriesInput {
  slug: string
  navSection: 'learn' | 'understand' | 'experience'
  /** Series 表里的字段是 title，但前端习惯叫 label —— 这里两个都接受，title 优先 */
  title?: string
  label?: string
  en?: string
  desc?: string
  cover?: string
  sortOrder?: number
  isPublished?: boolean
  /** 子主题列表。整体替换语义：传空数组 = 清空所有子主题 */
  topics?: SubTopicInput[]
}

export const seriesService = {
  /** 后台：列出所有 Series（含未发布 / 已软删的，便于运营管理） */
  async listForAdmin(params: { navSection?: string; keyword?: string } = {}) {
    const where: Prisma.SeriesWhereInput = {}
    if (params.navSection) where.navSection = params.navSection as any
    if (params.keyword) {
      where.OR = [
        { title: { contains: params.keyword, mode: 'insensitive' } },
        { slug:  { contains: params.keyword, mode: 'insensitive' } },
        { en:   { contains: params.keyword, mode: 'insensitive' } },
      ]
    }
    const items = await prisma.series.findMany({
      where,
      orderBy: [{ navSection: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
      include: {
        subTopics: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { contents: { where: { deletedAt: null } } } },
      },
    })
    return items.map((s) => ({
      id: s.id,
      slug: s.slug,
      label: s.title,
      en: s.en,
      desc: s.desc,
      cover: s.cover,
      navSection: s.navSection,
      sortOrder: s.sortOrder,
      isPublished: s.isPublished,
      deletedAt: s.deletedAt,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      topics: s.subTopics.map((st) => ({
        id: st.id,
        slug: st.slug,
        name: st.name,
        sortOrder: st.sortOrder,
      })),
      contentsCount: s._count.contents,
    }))
  },

  /** 后台：单个 Series 详情（含子主题） */
  async getById(id: string) {
    const s = await prisma.series.findUnique({
      where: { id },
      include: { subTopics: { orderBy: { sortOrder: 'asc' } } },
    })
    if (!s) throw ApiError.notFound(`系列不存在: ${id}`)
    return {
      id: s.id,
      slug: s.slug,
      label: s.title,
      en: s.en,
      desc: s.desc,
      cover: s.cover,
      navSection: s.navSection,
      sortOrder: s.sortOrder,
      isPublished: s.isPublished,
      deletedAt: s.deletedAt,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      topics: s.subTopics.map((st) => ({
        id: st.id,
        slug: st.slug,
        name: st.name,
        sortOrder: st.sortOrder,
      })),
    }
  },

  /** 创建 */
  async create(input: UpsertSeriesInput) {
    const slug = input.slug?.trim()
    if (!slug) throw ApiError.validation('Slug 不能为空')
    const title = (input.title ?? input.label ?? '').trim()
    if (!title) throw ApiError.validation('标题不能为空')
    if (!['learn', 'understand', 'experience'].includes(input.navSection)) {
      throw ApiError.validation('navSection 必须是 learn / understand / experience 之一')
    }

    // slug 唯一性
    const dup = await prisma.series.findFirst({ where: { slug, deletedAt: null } })
    if (dup) throw ApiError.conflict(`Slug 已存在: ${slug}`)

    // 子主题 slug 唯一性（同系列下）
    if (input.topics?.length) {
      const slugs = input.topics.map((t) => t.slug)
      if (new Set(slugs).size !== slugs.length) {
        throw ApiError.validation('子主题 slug 不能重复')
      }
    }

    return prisma.$transaction(async (tx) => {
      const series = await tx.series.create({
        data: {
          slug,
          navSection: input.navSection,
          title,
          en: input.en ?? '',
          desc: input.desc ?? '',
          cover: input.cover ?? null,
          sortOrder: input.sortOrder ?? 0,
          isPublished: input.isPublished ?? true,
          subTopics: input.topics?.length
            ? {
                create: input.topics.map((t, i) => ({
                  slug: t.slug.trim(),
                  name: t.name.trim(),
                  sortOrder: t.sortOrder ?? i,
                })),
              }
            : undefined,
        },
        include: { subTopics: { orderBy: { sortOrder: 'asc' } } },
      })
      return {
        id: series.id,
        slug: series.slug,
        label: series.title,
        en: series.en,
        desc: series.desc,
        cover: series.cover,
        navSection: series.navSection,
        sortOrder: series.sortOrder,
        isPublished: series.isPublished,
        topics: series.subTopics.map((st) => ({
          id: st.id,
          slug: st.slug,
          name: st.name,
          sortOrder: st.sortOrder,
        })),
      }
    })
  },

  /** 更新（支持整体替换子主题） */
  async update(id: string, input: UpsertSeriesInput) {
    const cur = await prisma.series.findUnique({ where: { id } })
    if (!cur) throw ApiError.notFound(`系列不存在: ${id}`)

    const title = (input.title ?? input.label ?? cur.title).trim()
    if (!title) throw ApiError.validation('标题不能为空')

    // slug 唯一性（如果改了 slug）
    if (input.slug && input.slug !== cur.slug) {
      const dup = await prisma.series.findFirst({
        where: { slug: input.slug, deletedAt: null, id: { not: id } },
      })
      if (dup) throw ApiError.conflict(`Slug 已存在: ${input.slug}`)
    }

    // 子主题 slug 唯一性（同系列下）
    if (input.topics?.length) {
      const slugs = input.topics.map((t) => t.slug)
      if (new Set(slugs).size !== slugs.length) {
        throw ApiError.validation('子主题 slug 不能重复')
      }
    }

    return prisma.$transaction(async (tx) => {
      // 1. 更新系列本身
      const series = await tx.series.update({
        where: { id },
        data: {
          slug: input.slug ?? cur.slug,
          title,
          en: input.en ?? cur.en,
          desc: input.desc ?? cur.desc,
          cover: input.cover ?? cur.cover,
          navSection: input.navSection ?? cur.navSection,
          sortOrder: input.sortOrder ?? cur.sortOrder,
          isPublished: input.isPublished ?? cur.isPublished,
        },
      })

      // 2. 子主题：整体替换
      // 找出哪些子主题被删了（存在于 DB 但不在本次传）
      if (input.topics !== undefined) {
        const incomingIds = input.topics.filter((t) => t.id).map((t) => t.id!)
        await tx.subTopic.deleteMany({
          where: { seriesId: id, id: { notIn: incomingIds.length ? incomingIds : ['__none__'] } },
        })

        for (let i = 0; i < input.topics.length; i++) {
          const t = input.topics[i]
          const data = {
            slug: t.slug.trim(),
            name: t.name.trim(),
            sortOrder: t.sortOrder ?? i,
          }
          if (t.id) {
            // 更新
            await tx.subTopic.update({ where: { id: t.id }, data })
          } else {
            // 新建
            await tx.subTopic.create({
              data: { ...data, seriesId: id },
            })
          }
        }
      }

      const result = await tx.series.findUnique({
        where: { id: series.id },
        include: { subTopics: { orderBy: { sortOrder: 'asc' } } },
      })
      return {
        id: result!.id,
        slug: result!.slug,
        label: result!.title,
        en: result!.en,
        desc: result!.desc,
        cover: result!.cover,
        navSection: result!.navSection,
        sortOrder: result!.sortOrder,
        isPublished: result!.isPublished,
        topics: result!.subTopics.map((st) => ({
          id: st.id,
          slug: st.slug,
          name: st.name,
          sortOrder: st.sortOrder,
        })),
      }
    })
  },

  /** 软删除 */
  async remove(id: string) {
    const cur = await prisma.series.findUnique({ where: { id } })
    if (!cur) throw ApiError.notFound(`系列不存在: ${id}`)

    // 引用计数校验：还有未删文章 → 拒绝删除
    const refCount = await prisma.content.count({
      where: { seriesId: id, deletedAt: null },
    })
    if (refCount > 0) {
      throw ApiError.conflict(
        `该系列下还有 ${refCount} 篇文章未删除，无法删除。请先去「文章管理」清理或解除绑定。`,
        { contentsCount: refCount },
      )
    }

    return prisma.series.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  },
}