import type { Prisma } from '@prisma/client'
import { prisma } from '../db/client.js'
import { ApiError } from '../utils/apiError.js'

export const caseService = {
  async listForAdmin(params: { keyword?: string; page?: number; pageSize?: number }) {
    const page = Math.max(1, params.page || 1)
    const pageSize = Math.min(100, Math.max(1, params.pageSize || 20))
    const skip = (page - 1) * pageSize

    const where: Prisma.CaseWhereInput = {}
    if (params.keyword) {
      where.OR = [
        { title: { contains: params.keyword, mode: 'insensitive' } },
        { company: { contains: params.keyword, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.case.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }],
        skip,
        take: pageSize,
      }),
      prisma.case.count({ where }),
    ])

    return { items, total, page, pageSize }
  },

  async listPublic(params: { limit?: number } = {}) {
    return prisma.case.findMany({
      where: { isPublished: true, deletedAt: null },
      orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }],
      take: params.limit,
    })
  },

  async getBySlug(slug: string) {
    const c = await prisma.case.findFirst({
      where: { slug, isPublished: true, deletedAt: null },
    })
    if (!c) throw ApiError.notFound(`案例不存在: ${slug}`)
    return c
  },

  async getById(id: string) {
    const c = await prisma.case.findUnique({ where: { id } })
    if (!c) throw ApiError.notFound(`案例不存在: ${id}`)
    return c
  },

  async create(input: Prisma.CaseCreateInput) {
    const exists = await prisma.case.findUnique({ where: { slug: input.slug } })
    if (exists) throw ApiError.conflict(`Slug 已存在: ${input.slug}`)
    return prisma.case.create({ data: input })
  },

  async update(id: string, input: Prisma.CaseUpdateInput) {
    const c = await prisma.case.findUnique({ where: { id } })
    if (!c) throw ApiError.notFound(`案例不存在: ${id}`)
    if (input.slug && input.slug !== c.slug) {
      const dup = await prisma.case.findUnique({ where: { slug: input.slug as string } })
      if (dup) throw ApiError.conflict(`Slug 已存在: ${input.slug}`)
    }
    return prisma.case.update({ where: { id }, data: input })
  },

  async remove(id: string) {
    const c = await prisma.case.findUnique({ where: { id } })
    if (!c) throw ApiError.notFound(`案例不存在: ${id}`)
    return prisma.case.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  },
}