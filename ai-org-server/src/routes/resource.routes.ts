import { Router } from 'express'
import { z } from 'zod'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { upload, formatFileSize } from '../middleware/upload.js'
import { saveBuffer } from '../storage.js'
import { resourceService } from '../services/resource.service.js'
import { ok } from '../utils/response.js'
import { ApiError } from '../utils/apiError.js'

const router = Router()

// ====================================================================
// 公开接口（无需登录，前台用）
// ====================================================================

/**
 * GET /api/resources —— 前台列表
 * Query: ?type=whitepaper&featured=true&limit=10
 */
router.get('/', async (req, res, next) => {
  try {
    const items = await resourceService.listPublic({
      type: req.query.type as string | undefined,
      featured: req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    })
    res.json(ok(items))
  } catch (e) {
    next(e)
  }
})

/**
 * GET /api/resources/:slug —— 前台详情
 */
router.get('/:slug', async (req, res, next) => {
  try {
    const r = await resourceService.getBySlug(req.params.slug, true)
    res.json(ok(r))
  } catch (e) {
    next(e)
  }
})

// ====================================================================
// 后台接口（需要登录）
// ====================================================================

const CreateSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'slug 只能含小写字母、数字、-'),
  type: z.enum([
    'insight', 'research', 'framework', 'playbook', 'case',
    'checklist', 'tool', 'prompt', 'skill', 'workflow', 'whitepaper',
  ]),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  summary: z.string().min(1),
  thumbnail: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  topic: z.enum(['individual', 'workflow', 'team', 'organization', 'governance']).optional(),
  audience: z.array(z.enum(['ceo', 'hr', 'business', 'it', 'manager'])).optional().default([]),
  industry: z.array(z.string()).optional().default([]),
  fileUrl: z.string().optional(),
  fileType: z.enum(['pdf', 'md', 'doc', 'docx', 'link', 'notion', 'zip']).default('md'),
  fileName: z.string().optional(),
  fileSize: z.string().optional(),
  pages: z.number().int().optional(),
  cover: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
})

/**
 * GET /api/resources/admin —— 后台列表（含未发布）
 */
router.get('/admin/list', authMiddleware, async (req, res, next) => {
  try {
    const result = await resourceService.listForAdmin({
      type: req.query.type as string | undefined,
      featured: req.query.featured === 'true' ? true : undefined,
      keyword: req.query.keyword as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 20,
    })
    res.json(ok(result))
  } catch (e) {
    next(e)
  }
})

/**
 * POST /api/resources/admin —— 创建（支持文件上传）
 */
router.post(
  '/admin',
  authMiddleware,
  requireRole('super_admin', 'admin', 'editor'),
  upload.single('file'),
  async (req, res, next) => {
    try {
      // multipart/form-data：字段在 req.body，文件在 req.file
      // application/json：全部在 req.body
      const body: any = { ...req.body }

      // 数组字段（form-data 来时是 string，需要 parse）
      if (typeof body.tags === 'string') {
        try { body.tags = JSON.parse(body.tags) } catch { body.tags = body.tags.split(',').map((s: string) => s.trim()).filter(Boolean) }
      }
      if (typeof body.audience === 'string') {
        try { body.audience = JSON.parse(body.audience) } catch {}
      }
      if (typeof body.industry === 'string') {
        try { body.industry = JSON.parse(body.industry) } catch { body.industry = body.industry.split(',').map((s: string) => s.trim()).filter(Boolean) }
      }
      if (typeof body.isFeatured === 'string') body.isFeatured = body.isFeatured === 'true'
      if (typeof body.sortOrder === 'string') body.sortOrder = parseInt(body.sortOrder, 10) || 0
      if (typeof body.pages === 'string') body.pages = parseInt(body.pages, 10) || undefined

      // 处理上传的文件
      if (req.file) {
        const { url } = await saveBuffer(req.file.buffer, req.file.originalname, req.file.mimetype)
        body.fileUrl = url
        body.fileName = body.fileName || req.file.originalname
        if (!body.fileSize) body.fileSize = formatFileSize(req.file.size)
        // 自动按扩展名推断 fileType
        const ext = req.file.originalname.toLowerCase()
        if (ext.endsWith('.pdf')) body.fileType = 'pdf'
        else if (ext.endsWith('.md')) body.fileType = 'md'
        else if (ext.endsWith('.docx')) body.fileType = 'docx'
        else if (ext.endsWith('.doc')) body.fileType = 'doc'
        else if (ext.endsWith('.zip')) body.fileType = 'zip'
      }

      const data = CreateSchema.parse(body)
      const r = await resourceService.create(data)
      res.json(ok(r))
    } catch (e) {
      next(e)
    }
  }
)

/**
 * PUT /api/resources/admin/:id —— 更新
 */
router.put(
  '/admin/:id',
  authMiddleware,
  requireRole('super_admin', 'admin', 'editor'),
  upload.single('file'),
  async (req, res, next) => {
    try {
      const body: any = { ...req.body }

      if (typeof body.tags === 'string') {
        try { body.tags = JSON.parse(body.tags) } catch { body.tags = body.tags.split(',').map((s: string) => s.trim()).filter(Boolean) }
      }
      if (typeof body.audience === 'string') {
        try { body.audience = JSON.parse(body.audience) } catch {}
      }
      if (typeof body.industry === 'string') {
        try { body.industry = JSON.parse(body.industry) } catch { body.industry = body.industry.split(',').map((s: string) => s.trim()).filter(Boolean) }
      }
      if (typeof body.isFeatured === 'string') body.isFeatured = body.isFeatured === 'true'
      if (typeof body.sortOrder === 'string') body.sortOrder = parseInt(body.sortOrder, 10) || 0
      if (typeof body.pages === 'string') body.pages = parseInt(body.pages, 10) || undefined

      if (req.file) {
        const { url } = await saveBuffer(req.file.buffer, req.file.originalname, req.file.mimetype)
        body.fileUrl = url
        body.fileName = body.fileName || req.file.originalname
        if (!body.fileSize) body.fileSize = formatFileSize(req.file.size)
      }

      // 部分更新：剔除 schema 之外的字段
      const data = CreateSchema.partial().parse(body)
      const r = await resourceService.update(String(req.params.id), data)
      res.json(ok(r))
    } catch (e) {
      next(e)
    }
  }
)

/**
 * DELETE /api/resources/admin/:id —— 软删除
 */
router.delete(
  '/admin/:id',
  authMiddleware,
  requireRole('super_admin', 'admin'),
  async (req, res, next) => {
    try {
      const r = await resourceService.remove(String(req.params.id))
      res.json(ok({ id: r.id, deletedAt: r.deletedAt }))
    } catch (e) {
      next(e)
    }
  }
)

export default router
