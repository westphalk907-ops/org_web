import { Router } from 'express'
import { prisma } from '../db/client.js'
import { ok, fail } from '../utils/response.js'

const router = Router()

/**
 * GET /api/series —— 公开：列出所有 Series
 * 支持查询参数：navSection
 *
 * 返回前端期望的形状：
 * {
 *   id, slug, label, en, desc, cover, navSection,
 *   articles: number,    // 该系列下已发布文章数
 *   frameworks: number,  // 该系列下 category=framework 的文章数
 *   topics: [
 *     { id, slug, name, count }
 *   ]
 * }
 */
router.get('/', async (req, res, next) => {
  try {
    const { navSection } = req.query
    const where: any = { isPublished: true, deletedAt: null }
    if (navSection) where.navSection = String(navSection)

    const series = await prisma.series.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        subTopics: {
          orderBy: { sortOrder: 'asc' },
          include: {
            _count: {
              select: {
                contents: { where: { isPublished: true, deletedAt: null } },
              },
            },
          },
        },
        contents: {
          where: { isPublished: true, deletedAt: null },
          select: { category: true },
        },
      },
    })

    const result = series.map((s) => {
      const frameworks = s.contents.filter((c) => c.category === 'framework').length
      return {
        id: s.id,
        slug: s.slug,
        label: s.title,
        en: s.en || '',
        desc: s.desc || '',
        cover: s.cover,
        navSection: s.navSection,
        articles: s.contents.length,
        frameworks,
        topics: s.subTopics.map((st) => ({
          id: st.id,
          slug: st.slug,
          name: st.name,
          count: st._count.contents,
        })),
      }
    })

    res.json(ok(result))
  } catch (e) {
    next(e)
  }
})

/**
 * GET /api/series/:slug —— 公开：单个系列详情（含子主题）
 */
router.get('/:slug', async (req, res, next) => {
  try {
    const slug = String(req.params.slug)
    const s = await prisma.series.findFirst({
      where: { slug, isPublished: true, deletedAt: null },
      include: {
        subTopics: { orderBy: { sortOrder: 'asc' } },
      },
    })
    if (!s) {
      return res.status(404).json(fail('NOT_FOUND', '系列不存在'))
    }
    res.json(
      ok({
        id: s.id,
        slug: s.slug,
        label: s.title,
        en: s.en || '',
        desc: s.desc || '',
        cover: s.cover,
        navSection: s.navSection,
        topics: s.subTopics.map((st) => ({
          id: st.id,
          slug: st.slug,
          name: st.name,
        })),
      }),
    )
  } catch (e) {
    next(e)
  }
})

export default router
