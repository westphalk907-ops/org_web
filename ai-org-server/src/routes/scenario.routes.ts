/**
 * Scenario 路由（体验区场景库）
 *
 * 公开：
 *   GET /api/scenarios                   列表（可 ?category=&keyword=）
 *   GET /api/scenarios/:slug             详情
 *   GET /api/scenarios/owner-contact     owner 微信配置（前台弹窗用）
 *
 * 后台（需鉴权）：
 *   GET    /api/scenarios/admin/list     列表（含未激活）
 *   GET    /api/scenarios/admin/:id      详情
 *   POST   /api/scenarios/admin          新建/覆盖（带 id 则更新）
 *   PUT    /api/scenarios/admin/:id      更新
 *   DELETE /api/scenarios/admin/:id      软删
 *   GET    /api/scenarios/admin/owner-contact       读 owner 微信配置
 *   PUT    /api/scenarios/admin/owner-contact       写 owner 微信配置
 */
import { Router } from 'express'
import { z } from 'zod'
import { scenarioService } from '../services/scenario.service.js'
import { homeConfigService } from '../services/homeConfig.service.js'
import { ok } from '../utils/response.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { ApiError } from '../utils/apiError.js'

const router = Router()

const CATEGORY_ENUM = z.enum([
  'INDIVIDUAL', 'TEAM', 'SALES', 'MARKETING', 'HR', 'SERVICE', 'MANAGEMENT',
])

const scenarioSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  category: CATEGORY_ENUM,
  title: z.string().min(1),
  subtitle: z.string().optional(),
  heroDesc: z.string().optional(),
  icon: z.string().optional(),
  problem: z.string().min(1),
  beforeSteps: z.array(z.string()).optional(),
  afterSteps: z.array(z.string()).optional(),
  prompts: z.array(z.string()).optional(),
  resourceSlugs: z.array(z.string()).optional(),
  ownerContactEnabled: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

// ---------- 公开 ----------
router.get('/scenarios', async (req, res, next) => {
  try {
    const data = await scenarioService.listActive({
      category: req.query.category as any,
      keyword: req.query.keyword as string | undefined,
    })
    res.json(ok(data))
  } catch (e) { next(e) }
})

router.get('/scenarios/owner-contact', async (_req, res, next) => {
  try {
    const payload = await homeConfigService.get('ownerContact').catch(() => null)
    res.json(ok(payload ?? { wechatId: '', qrcodeUrl: '', intro: '' }))
  } catch (e) { next(e) }
})

router.get('/scenarios/:slug', async (req, res, next) => {
  try {
    const data = await scenarioService.getBySlug(String(req.params.slug))
    if (!data) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: '场景不存在' } })
    res.json(ok(data))
  } catch (e) { next(e) }
})

// ---------- 后台 ----------
router.get('/admin/scenarios/list', authMiddleware, async (req, res, next) => {
  try {
    const data = await scenarioService.adminList({
      keyword: req.query.keyword as string | undefined,
      category: req.query.category as string | undefined,
    })
    res.json(ok(data))
  } catch (e) { next(e) }
})

router.get('/admin/scenarios/owner-contact', authMiddleware, async (_req, res, next) => {
  try {
    const payload = await homeConfigService.get('ownerContact').catch(() => null)
    res.json(ok(payload ?? { wechatId: '', qrcodeUrl: '', intro: '' }))
  } catch (e) { next(e) }
})

router.put('/admin/scenarios/owner-contact', requireRole('super_admin', 'admin'), async (req, res, next) => {
  try {
    const body = z.object({
      wechatId: z.string().min(1),
      qrcodeUrl: z.string().optional().default(''),
      intro: z.string().optional().default(''),
    }).parse(req.body)
    await homeConfigService.upsert('ownerContact', body)
    res.json(ok(body))
  } catch (e) { next(e) }
})

router.get('/admin/scenarios/:id', authMiddleware, async (req, res, next) => {
  try {
    const data = await scenarioService.adminGet(String(req.params.id))
    if (!data) throw ApiError.notFound('场景不存在')
    res.json(ok(data))
  } catch (e) { next(e) }
})

router.post('/admin/scenarios', requireRole('super_admin', 'admin', 'editor'), async (req, res, next) => {
  try {
    const input = scenarioSchema.parse(req.body)
    const data = await scenarioService.adminUpsert(input as any)
    res.json(ok(data))
  } catch (e) { next(e) }
})

router.put('/admin/scenarios/:id', requireRole('super_admin', 'admin', 'editor'), async (req, res, next) => {
  try {
    const input = scenarioSchema.parse(req.body)
    const data = await scenarioService.adminUpsert({ ...input, id: String(req.params.id) } as any)
    res.json(ok(data))
  } catch (e) { next(e) }
})

router.delete('/admin/scenarios/:id', requireRole('super_admin', 'admin'), async (req, res, next) => {
  try {
    const data = await scenarioService.adminDelete(String(req.params.id))
    res.json(ok(data))
  } catch (e) { next(e) }
})

export default router
