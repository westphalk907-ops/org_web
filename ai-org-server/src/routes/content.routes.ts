import { Router } from 'express'
import { z } from 'zod'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { contentService } from '../services/content.service.js'
import { uploadImage, toPublicUrl, formatFileSize } from '../middleware/upload.js'
import { ok } from '../utils/response.js'
import { ApiError } from '../utils/apiError.js'

const router = Router()

// ====================================================================
// 公开接口
// ====================================================================

/**
 * GET /api/contents —— 公开列表
 * 支持查询参数：category / navSection / nodeSlug / limit
 */
router.get('/', async (req, res, next) => {
  try {
    const items = await contentService.listPublic({
      category: req.query.category as string | undefined,
      navSection: req.query.navSection as string | undefined,
      nodeSlug: req.query.nodeSlug as string | undefined,
      seriesSlug: req.query.seriesSlug as string | undefined,
      subTopicSlug: req.query.subTopicSlug as string | undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    })
    res.json(ok(items))
  } catch (e) {
    next(e)
  }
})

/**
 * GET /api/contents/:slug —— 公开详情
 */
router.get('/:slug', async (req, res, next) => {
  try {
    const c = await contentService.getBySlug(req.params.slug, true)
    res.json(ok(c))
  } catch (e) {
    next(e)
  }
})

// ====================================================================
// 后台接口
// ====================================================================

const CreateSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'slug 只能含小写字母、数字、-'),
  category: z.preprocess(
    (v) => (typeof v === 'string' ? v.toLowerCase() : v),
    z.enum([
      'insight', 'trend', 'point_of_view', 'field_note',
      'research', 'whitepaper', 'playbook', 'framework',
    ])
  ),
  navSection: z.preprocess(
    (v) => (typeof v === 'string' ? v.toLowerCase() : v),
    z.enum(['learn', 'understand', 'experience']).optional().default('learn')
  ),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  excerpt: z.string().min(1),
  cover: z.string().optional(),
  content: z.string().min(1),
  author: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
  tags: z.array(z.string()).optional().default([]),
  relatedIds: z.array(z.string()).optional().default([]),
  index: z.string().optional(),
  nodeSlug: z.string().optional(),
  sourceUrl: z.string().optional(),
  sourcePlatform: z.string().optional(),
  isPublished: z.boolean().optional().default(false),
  // 系列归属（前端可选传空字符串表示"无"）
  seriesId: z
    .union([z.string().min(1), z.null()])
    .optional()
    .transform((v) => (v === '' ? null : v)),
  subTopicId: z
    .union([z.string().min(1), z.null()])
    .optional()
    .transform((v) => (v === '' ? null : v)),
})

router.get('/admin/list', authMiddleware, async (req, res, next) => {
  try {
    const result = await contentService.listForAdmin({
      category: req.query.category as string | undefined,
      navSection: req.query.navSection as string | undefined,
      isPublished: req.query.isPublished === 'true' ? true : req.query.isPublished === 'false' ? false : undefined,
      keyword: req.query.keyword as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 20,
      includeDeleted: req.query.includeDeleted === 'true',
    })
    res.json(ok(result))
  } catch (e) {
    next(e)
  }
})

router.get('/admin/:id', authMiddleware, async (req, res, next) => {
  try {
    const c = await contentService.getById(String(req.params.id))
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
      const body: any = { ...req.body }
      if (typeof body.tags === 'string') {
        try { body.tags = JSON.parse(body.tags) } catch { body.tags = body.tags.split(',').map((s: string) => s.trim()).filter(Boolean) }
      }
      if (typeof body.relatedIds === 'string') {
        try { body.relatedIds = JSON.parse(body.relatedIds) } catch {}
      }
      if (typeof body.isPublished === 'string') body.isPublished = body.isPublished === 'true'

      // zod 的 optional() 不接受 null；把字符串可选字段里的 null 归一为 undefined
      for (const k of ['subtitle', 'cover', 'author', 'sourceUrl', 'sourcePlatform', 'nodeSlug', 'index']) {
        if (body[k] === null) body[k] = undefined
      }

      const data = CreateSchema.parse(body)
      // seriesId / subTopicId: string → prisma 关系对象
      const { seriesId, subTopicId, ...rest } = data as any
      const createInput: any = {
        ...rest,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
      }
      if (seriesId) createInput.series = { connect: { id: seriesId } }
      if (subTopicId) createInput.subTopic = { connect: { id: subTopicId } }

      const c = await contentService.create(createInput)
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
      const body: any = { ...req.body }
      if (typeof body.tags === 'string') {
        try { body.tags = JSON.parse(body.tags) } catch { body.tags = body.tags.split(',').map((s: string) => s.trim()).filter(Boolean) }
      }
      if (typeof body.relatedIds === 'string') {
        try { body.relatedIds = JSON.parse(body.relatedIds) } catch {}
      }
      if (typeof body.isPublished === 'string') body.isPublished = body.isPublished === 'true'
      if (body.publishedAt) body.publishedAt = new Date(body.publishedAt)

      // zod 的 optional() 不接受 null；把字符串可选字段里的 null 归一为 undefined
      for (const k of ['subtitle', 'cover', 'author', 'sourceUrl', 'sourcePlatform', 'nodeSlug', 'index']) {
        if (body[k] === null) body[k] = undefined
      }

      const data = CreateSchema.partial().parse(body)
      // seriesId / subTopicId: string → prisma 关系对象
      const { seriesId, subTopicId, ...rest } = data as any
      const updateInput: any = { ...rest }
      if (seriesId !== undefined) {
        updateInput.series = seriesId ? { connect: { id: seriesId } } : { disconnect: true }
      }
      if (subTopicId !== undefined) {
        updateInput.subTopic = subTopicId ? { connect: { id: subTopicId } } : { disconnect: true }
      }

      const c = await contentService.update(String(req.params.id), updateInput)
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
      const c = await contentService.remove(String(req.params.id))
      res.json(ok({ id: c.id, deletedAt: c.deletedAt }))
    } catch (e) {
      next(e)
    }
  }
)

// ====================================================================
// 图片上传（用于文章封面、正文配图）
// ====================================================================

/**
 * POST /api/contents/upload-image
 * multipart/form-data: file=<image>
 * 返回：{ url, filename, size, width?, height? }
 *
 * 注意：
 * - 鉴权：editor / admin / super_admin
 * - 文件类型：仅图片（png/jpg/webp/gif）
 * - 文件大小：≤ 8MB
 * - 返回的 url 是 `/uploads/YYYY/MM/xxx.png` 形式，可直接拼到 Markdown `![alt](url)`
 */
router.post(
  '/upload-image',
  authMiddleware,
  requireRole('super_admin', 'admin', 'editor'),
  uploadImage.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw ApiError.validation('请上传图片文件（字段名：file）')
      }
      const url = toPublicUrl(req.file.path)
      res.json(
        ok({
          url,
          filename: req.file.filename,
          originalName: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          sizeText: formatFileSize(req.file.size),
        })
      )
    } catch (e) {
      next(e)
    }
  }
)

export default router
