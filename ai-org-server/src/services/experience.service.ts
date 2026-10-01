/**
 * Experience 服务（地图节点 + 测评题库）
 */
import type { Prisma } from '@prisma/client'
import { prisma } from '../db/client.js'

export const experienceService = {
  // -------- 地图节点 --------

  /** 公开：根据 kind 拉地图（带所有阶段） */
  async getMapByKind(kind: 'INDIVIDUAL' | 'ORGANIZATION' | 'WORKFLOW') {
    return prisma.experienceMap.findFirst({
      where: { kind, isActive: true, deletedAt: null },
      include: {
        stages: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })
  },

  /** 公开：所有地图 */
  async listActiveMaps() {
    return prisma.experienceMap.findMany({
      where: { isActive: true, deletedAt: null },
      include: {
        stages: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    })
  },

  // -------- 后台管理：地图 --------

  async adminListMaps(params: { keyword?: string } = {}) {
    const where: Prisma.ExperienceMapWhereInput = { deletedAt: null }
    if (params.keyword) {
      where.OR = [
        { title: { contains: params.keyword, mode: 'insensitive' } },
        { subtitle: { contains: params.keyword, mode: 'insensitive' } },
      ]
    }
    return prisma.experienceMap.findMany({
      where,
      include: {
        stages: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { sortOrder: 'asc' },
    })
  },

  async adminGetMap(id: string) {
    return prisma.experienceMap.findUnique({
      where: { id },
      include: { stages: { orderBy: { sortOrder: 'asc' } } },
    })
  },

  async adminUpsertMap(input: {
    id?: string
    kind: 'INDIVIDUAL' | 'ORGANIZATION' | 'WORKFLOW'
    slug: string
    title: string
    subtitle?: string
    heroDesc?: string
    isActive?: boolean
    sortOrder?: number
  }) {
    const data = {
      kind: input.kind,
      slug: input.slug,
      title: input.title,
      subtitle: input.subtitle ?? null,
      heroDesc: input.heroDesc ?? null,
      isActive: input.isActive ?? true,
      sortOrder: input.sortOrder ?? 0,
    }
    if (input.id) {
      return prisma.experienceMap.update({ where: { id: input.id }, data })
    }
    return prisma.experienceMap.create({ data })
  },

  async adminDeleteMap(id: string) {
    return prisma.experienceMap.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  },

  // -------- 后台管理：阶段 --------

  async adminUpsertStage(input: {
    id?: string
    mapId: string
    stage: string
    title: string
    description: string
    characteristics: string[]
    painPoints: string[]
    actions: string[]
resourceSlugs?: string[]
  serviceLinks?: Array<{ label: string; href: string }>
  details?: Record<string, unknown>
  sortOrder?: number
  isActive?: boolean
}) {
    const data = {
      mapId: input.mapId,
      stage: input.stage,
      title: input.title,
      description: input.description,
      characteristics: input.characteristics,
      painPoints: input.painPoints,
      actions: input.actions,
      resourceSlugs: input.resourceSlugs ?? [],
      serviceLinks: (input.serviceLinks ?? []) as any,
      details: (input.details ?? null) as any,
      sortOrder: input.sortOrder ?? 0,
      isActive: input.isActive ?? true,
    }
    if (input.id) {
      return prisma.experienceStage.update({ where: { id: input.id }, data })
    }
    return prisma.experienceStage.create({ data })
  },

  async adminDeleteStage(id: string) {
    return prisma.experienceStage.delete({ where: { id } })
  },

  // -------- 测评题库 --------

  /** 公开：所有激活的题目 */
  async listQuestions() {
    return prisma.assessmentQuestion.findMany({
      where: { isActive: true },
      orderBy: [{ dimension: 'asc' }, { sortOrder: 'asc' }],
    })
  },

  async adminListQuestions(params: { dimension?: string; keyword?: string } = {}) {
    const where: Prisma.AssessmentQuestionWhereInput = { isActive: true }
    if (params.dimension) where.dimension = params.dimension as any
    if (params.keyword) {
      where.OR = [
        { text: { contains: params.keyword, mode: 'insensitive' } },
        { slug: { contains: params.keyword, mode: 'insensitive' } },
      ]
    }
    return prisma.assessmentQuestion.findMany({
      where,
      orderBy: [{ dimension: 'asc' }, { sortOrder: 'asc' }],
    })
  },

  async adminUpsertQuestion(input: {
    id?: string
    slug: string
    dimension: string
    text: string
    description?: string
    options: Array<{ score: number; label: string }>
    weight?: number
    stage?: string
    sortOrder?: number
    isActive?: boolean
  }) {
    const data = {
      slug: input.slug,
      dimension: input.dimension as any,
      text: input.text,
      description: input.description ?? null,
      options: input.options as any,
      weight: input.weight ?? 1,
      stage: input.stage ?? null,
      sortOrder: input.sortOrder ?? 0,
      isActive: input.isActive ?? true,
    }
    if (input.id) {
      return prisma.assessmentQuestion.update({ where: { id: input.id }, data })
    }
    return prisma.assessmentQuestion.create({ data })
  },

  async adminDeleteQuestion(id: string) {
    return prisma.assessmentQuestion.delete({ where: { id } })
  },
}