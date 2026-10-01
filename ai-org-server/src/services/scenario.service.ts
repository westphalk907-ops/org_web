/**
 * Scenario 服务（体验区场景库）
 *
 * 体验区改造后的核心数据：
 *   - 每个场景是一个具体业务场景的可感知体验
 *   - 含痛点 / 传统 vs AI / 工作流 / Prompt / 关联资源 / 加微信开关
 *   - 按 category 归类（个人 / 团队 / 销售 / 市场 / HR / 客服 / 管理）
 */
import type { Prisma } from '@prisma/client'
import { prisma } from '../db/client.js'

export type ScenarioCategoryValue =
  | 'INDIVIDUAL' | 'TEAM' | 'SALES' | 'MARKETING' | 'HR' | 'SERVICE' | 'MANAGEMENT'

export const scenarioService = {
  /** 公开：列出所有激活的场景（可按 category 过滤） */
  async listActive(params: { category?: ScenarioCategoryValue; keyword?: string } = {}) {
    const where: Prisma.ScenarioWhereInput = { isActive: true, deletedAt: null }
    if (params.category) where.category = params.category
    if (params.keyword) {
      where.OR = [
        { title: { contains: params.keyword, mode: 'insensitive' } },
        { subtitle: { contains: params.keyword, mode: 'insensitive' } },
        { problem: { contains: params.keyword, mode: 'insensitive' } },
        { tags: { has: params.keyword } },
      ]
    }
    return prisma.scenario.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }],
    })
  },

  /** 公开：按 slug 取一个场景 */
  async getBySlug(slug: string) {
    return prisma.scenario.findFirst({
      where: { slug, isActive: true, deletedAt: null },
    })
  },

  // -------- 后台管理 --------

  async adminList(params: { keyword?: string; category?: string } = {}) {
    const where: Prisma.ScenarioWhereInput = { deletedAt: null }
    if (params.category) where.category = params.category as any
    if (params.keyword) {
      where.OR = [
        { title: { contains: params.keyword, mode: 'insensitive' } },
        { slug: { contains: params.keyword, mode: 'insensitive' } },
      ]
    }
    return prisma.scenario.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
  },

  async adminGet(id: string) {
    return prisma.scenario.findUnique({ where: { id } })
  },

  async adminUpsert(input: {
    id?: string
    slug: string
    category: ScenarioCategoryValue
    title: string
    subtitle?: string
    heroDesc?: string
    icon?: string
    problem: string
    beforeSteps?: string[]
    afterSteps?: string[]
    prompts?: string[]
    resourceSlugs?: string[]
    ownerContactEnabled?: boolean
    tags?: string[]
    isActive?: boolean
    sortOrder?: number
  }) {
    const data = {
      slug: input.slug,
      category: input.category,
      title: input.title,
      subtitle: input.subtitle ?? null,
      heroDesc: input.heroDesc ?? null,
      icon: input.icon ?? null,
      problem: input.problem,
      beforeSteps: input.beforeSteps ?? [],
      afterSteps: input.afterSteps ?? [],
      prompts: input.prompts ?? [],
      resourceSlugs: input.resourceSlugs ?? [],
      ownerContactEnabled: input.ownerContactEnabled ?? true,
      tags: input.tags ?? [],
      isActive: input.isActive ?? true,
      sortOrder: input.sortOrder ?? 0,
    }
    if (input.id) {
      return prisma.scenario.update({ where: { id: input.id }, data })
    }
    return prisma.scenario.create({ data })
  },

  async adminDelete(id: string) {
    return prisma.scenario.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  },
}
