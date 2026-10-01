import { Router } from 'express'
import { z } from 'zod'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { caseService } from '../services/case.service.js'
import { ok } from '../utils/response.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const items = await caseService.listPublic()
    res.json(ok(items))
  } catch (e) {
    next(e)
  }
})

router.get('/:slug', async (req, res, next) => {
  try {
    const c = await caseService.getBySlug(req.params.slug)
    res.json(ok(c))
  } catch (e) {
    next(e)
  }
})

// ---- 后台 ----

const MetricSchema = z.object({ label: z.string(), value: z.string() })
const TestimonialSchema = z.object({
  quote: z.string(),
  author: z.string(),
  position: z.string(),
})

const CreateSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'slug 只能含小写字母、数字、-'),
  company: z.string().min(1),
  industry: z.string().min(1),
  scale: z.string().optional(),
  title: z.string().min(1),
  before: z.string().min(1),
  intervention: z.string().min(1),
  after: z.string().min(1),
  next: z.string().optional(),
  metrics: z.array(MetricSchema).optional(),
  testimonial: TestimonialSchema.optional(),
  coverImage: z.string().optional(),
  isPublished: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
})

router.get('/admin/list', authMiddleware, async (req, res, next) => {
  try {
    const result = await caseService.listForAdmin({
      keyword: req.query.keyword as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 20,
    })
    res.json(ok(result))
  } catch (e) {
    next(e)
  }
})

router.get('/admin/:id', authMiddleware, async (req, res, next) => {
  try {
    const c = await caseService.getById(String(req.params.id))
    res.json(ok(c))
  } catch (e) {
    next(e)
  }
})

router.post(
  '/admin',
  authMiddleware,
  requireRole('super_admin', 'admin', 'editor'),
  async (req, res, next) => {
    try {
      const data = CreateSchema.parse(req.body)
      const c = await caseService.create(data)
      res.json(ok(c))
    } catch (e) {
      next(e)
    }
  }
)

router.put(
  '/admin/:id',
  authMiddleware,
  requireRole('super_admin', 'admin', 'editor'),
  async (req, res, next) => {
    try {
      const data = CreateSchema.partial().parse(req.body)
      const c = await caseService.update(String(req.params.id), data)
      res.json(ok(c))
    } catch (e) {
      next(e)
    }
  }
)

router.delete(
  '/admin/:id',
  authMiddleware,
  requireRole('super_admin', 'admin'),
  async (req, res, next) => {
    try {
      const c = await caseService.remove(String(req.params.id))
      res.json(ok({ id: c.id, deletedAt: c.deletedAt }))
    } catch (e) {
      next(e)
    }
  }
)

export default router