/**
 * Experience / Assessment 路由
 */
import { Router } from 'express'
import { z } from 'zod'
import { experienceService } from '../services/experience.service.js'
import { ok } from '../utils/response.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'

const router = Router()

// ---------- 公开路由 ----------

/** GET /api/experience/maps —— 所有 active 地图 */
router.get('/maps', async (_req, res, next) => {
  try {
    const data = await experienceService.listActiveMaps()
    res.json(ok(data))
  } catch (e) { next(e) }
})

/** GET /api/experience/maps/:kind —— 单张地图 */
router.get('/maps/:kind', async (req, res, next) => {
  try {
    const kind = req.params.kind.toUpperCase() as any
    const data = await experienceService.getMapByKind(kind)
    if (!data) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: '地图不存在' } })
    res.json(ok(data))
  } catch (e) { next(e) }
})

/** GET /api/experience/questions —— 测评题库 */
router.get('/questions', async (_req, res, next) => {
  try {
    const data = await experienceService.listQuestions()
    res.json(ok(data))
  } catch (e) { next(e) }
})

// ---------- 后台路由（需鉴权） ----------

const mapSchema = z.object({
  id: z.string().optional(),
  kind: z.enum(['INDIVIDUAL', 'ORGANIZATION', 'WORKFLOW']),
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  heroDesc: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

const stageSchema = z.object({
  id: z.string().optional(),
  mapId: z.string().min(1),
  stage: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  characteristics: z.array(z.string()),
  painPoints: z.array(z.string()),
  actions: z.array(z.string()),
  resourceSlugs: z.array(z.string()).optional(),
  serviceLinks: z.array(z.object({ label: z.string(), href: z.string() })).optional(),
  details: z.record(z.any()).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

const questionSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  dimension: z.enum(['STRATEGY', 'PEOPLE', 'WORKFLOW', 'TECHNOLOGY', 'DATA', 'GOVERNANCE', 'ORGANIZATION']),
  text: z.string().min(1),
  description: z.string().optional(),
  options: z.array(z.object({ score: z.number(), label: z.string() })).min(2),
  weight: z.number().optional(),
  stage: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

// 地图管理
router.get('/admin/maps', authMiddleware, async (req, res, next) => {
  try {
    const data = await experienceService.adminListMaps({
      keyword: req.query.keyword as string | undefined,
    })
    res.json(ok(data))
  } catch (e) { next(e) }
})

router.get('/admin/maps/:id', authMiddleware, async (req, res, next) => {
  try {
    const data = await experienceService.adminGetMap(String(req.params.id))
    if (!data) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: '地图不存在' } })
    res.json(ok(data))
  } catch (e) { next(e) }
})

router.post('/admin/maps', requireRole('super_admin', 'admin', 'editor'), async (req, res, next) => {
  try {
    const input = mapSchema.parse(req.body)
    const data = await experienceService.adminUpsertMap(input as any)
    res.json(ok(data))
  } catch (e) { next(e) }
})

router.put('/admin/maps/:id', requireRole('super_admin', 'admin', 'editor'), async (req, res, next) => {
  try {
    const input = mapSchema.parse(req.body)
    const data = await experienceService.adminUpsertMap({ ...input, id: String(req.params.id) } as any)
    res.json(ok(data))
  } catch (e) { next(e) }
})

router.delete('/admin/maps/:id', requireRole('super_admin', 'admin'), async (req, res, next) => {
  try {
    const data = await experienceService.adminDeleteMap(String(req.params.id))
    res.json(ok(data))
  } catch (e) { next(e) }
})

// 阶段管理
router.post('/admin/stages', requireRole('super_admin', 'admin', 'editor'), async (req, res, next) => {
  try {
    const input = stageSchema.parse(req.body)
    const data = await experienceService.adminUpsertStage(input as any)
    res.json(ok(data))
  } catch (e) { next(e) }
})

router.put('/admin/stages/:id', requireRole('super_admin', 'admin', 'editor'), async (req, res, next) => {
  try {
    const input = stageSchema.parse(req.body)
    const data = await experienceService.adminUpsertStage({ ...input, id: String(req.params.id) } as any)
    res.json(ok(data))
  } catch (e) { next(e) }
})

router.delete('/admin/stages/:id', requireRole('super_admin', 'admin'), async (req, res, next) => {
  try {
    const data = await experienceService.adminDeleteStage(String(req.params.id))
    res.json(ok(data))
  } catch (e) { next(e) }
})

// 测评题库管理
router.get('/admin/questions', authMiddleware, async (req, res, next) => {
  try {
    const data = await experienceService.adminListQuestions({
      dimension: req.query.dimension as string | undefined,
      keyword: req.query.keyword as string | undefined,
    })
    res.json(ok(data))
  } catch (e) { next(e) }
})

router.post('/admin/questions', requireRole('super_admin', 'admin', 'editor'), async (req, res, next) => {
  try {
    const input = questionSchema.parse(req.body)
    const data = await experienceService.adminUpsertQuestion(input as any)
    res.json(ok(data))
  } catch (e) { next(e) }
})

router.put('/admin/questions/:id', requireRole('super_admin', 'admin', 'editor'), async (req, res, next) => {
  try {
    const input = questionSchema.parse(req.body)
    const data = await experienceService.adminUpsertQuestion({ ...input, id: String(req.params.id) } as any)
    res.json(ok(data))
  } catch (e) { next(e) }
})

router.delete('/admin/questions/:id', requireRole('super_admin', 'admin'), async (req, res, next) => {
  try {
    const data = await experienceService.adminDeleteQuestion(String(req.params.id))
    res.json(ok(data))
  } catch (e) { next(e) }
})

export default router