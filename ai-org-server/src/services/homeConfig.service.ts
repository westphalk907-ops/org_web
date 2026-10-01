import { prisma } from '../db/client.js'
import { ApiError } from '../utils/apiError.js'

/**
 * 首页配置：把所有"运营文案"集中管理
 *
 * 比如：
 *   key='hero' → { title, subtitle, ctaText, ctaHref }
 *   key='painPoints' → [ ... ]
 *   key='methodology' → [ ... ]
 *   key='featuredResources' → [ ... ]
 *   key='featuredCases' → [ ... ]
 */
export const homeConfigService = {
  async get(key: string) {
    const c = await prisma.homeConfig.findUnique({ where: { key } })
    if (!c) throw ApiError.notFound(`配置不存在: ${key}`)
    return c.payload
  },

  async list() {
    return prisma.homeConfig.findMany({
      select: { key: true, updatedAt: true, updatedBy: true },
      orderBy: { key: 'asc' },
    })
  },

  async upsert(key: string, payload: unknown, updatedBy?: string) {
    return prisma.homeConfig.upsert({
      where: { key },
      update: { payload: payload as any, updatedBy },
      create: { key, payload: payload as any, updatedBy },
    })
  },

  async remove(key: string) {
    const c = await prisma.homeConfig.findUnique({ where: { key } })
    if (!c) throw ApiError.notFound(`配置不存在: ${key}`)
    return prisma.homeConfig.delete({ where: { key } })
  },
}