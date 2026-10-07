import { Router } from 'express'
import { z } from 'zod'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { aiToolService, CATEGORIES } from '../services/aiTool.service.js'
import { prisma } from '../db/client.js'
import { ok } from '../utils/response.js'

const router = Router()

// ---------- 类型安全的 query/params 工具 ----------
function toInt(value: unknown, fallback: number): number {
  if (typeof value !== 'string') return fallback
  const n = parseInt(value, 10)
  return Number.isNaN(n) ? fallback : n
}

function toIntOrNaN(value: unknown): number {
  if (typeof value !== 'string') return NaN
  return parseInt(value, 10)
}

function toStr(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.length === 0) return undefined
  return value
}

function toBool(value: unknown): boolean | undefined {
  if (value === 'true') return true
  if (value === 'false') return false
  return undefined
}

// ===== 公开接口 =====

// 工具列表
router.get('/', async (req, res, next) => {
  try {
    const items = await aiToolService.listPublic({
      category: toStr(req.query.category),
      accessType: toStr(req.query.accessType),
      priceType: toStr(req.query.priceType),
      keyword: toStr(req.query.keyword),
      isFeatured: toBool(req.query.isFeatured),
      limit: toInt(req.query.limit, 0) || undefined,
    })
    res.json(ok(items))
  } catch (e) {
    next(e)
  }
})

// 编辑精选
router.get('/featured', async (req, res, next) => {
  try {
    const limit = toInt(req.query.limit, 10)
    const items = await aiToolService.getFeatured(limit)
    res.json(ok(items))
  } catch (e) {
    next(e)
  }
})

// 最新收录
router.get('/latest', async (req, res, next) => {
  try {
    const limit = toInt(req.query.limit, 10)
    const items = await aiToolService.getLatest(limit)
    res.json(ok(items))
  } catch (e) {
    next(e)
  }
})

// 分类及数量
router.get('/categories', async (_req, res, next) => {
  try {
    const items = await aiToolService.getCategories()
    res.json(ok(items))
  } catch (e) {
    next(e)
  }
})

// 静态分类定义（不查库）
router.get('/category-list', (_req, res) => {
  res.json(ok(CATEGORIES))
})

// 详情
router.get('/:slug', async (req, res, next) => {
  try {
    const slug = toStr(req.params.slug)
    if (!slug) {
      return res.status(400).json({ ok: false, error: { code: 'BAD_REQUEST', message: 'slug 必填' } })
    }
    const item = await aiToolService.getBySlug(slug)
    res.json(ok(item))
  } catch (e) {
    next(e)
  }
})

// 点击统计
router.post('/:id/click', async (req, res, next) => {
  try {
    const id = toIntOrNaN(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ ok: false, error: { code: 'BAD_REQUEST', message: 'id 无效' } })
    }
    await aiToolService.incrementClick(id)
    res.json(ok({ success: true }))
  } catch (e) {
    next(e)
  }
})

// ===== 用户提交工具 =====
import { getClientIp } from '../utils/clientIp.js'

const SubmitSchema = z.object({
  name: z.string().min(1).max(50),
  url: z.string().url(),
  category: z.string().min(1),
  description: z.string().min(1).max(200),
  reason: z.string().max(500).optional(),
  email: z.string().email().optional().or(z.literal('')),
})

// 限流：同 IP 1 小时内最多 5 次
const submitRateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 5

function checkRateLimit(ip: string): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now()
  const entry = submitRateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    submitRateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { ok: true }
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { ok: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) }
  }
  entry.count++
  return { ok: true }
}

// 敏感词过滤（《广告法》《医疗广告管理办法》等关键词）
const SENSITIVE_WORDS = [
  // 绝对化用语（《广告法》第九条）
  '最佳', '最好', '最优', '最强', '第一', '唯一', '首选', '顶级', '极致',
  '绝对', '永久', '万能', '100%', '全网最低', '全网第一', '销量冠军',
  // 医疗/保健违规
  '治愈', '根治', '疗效', '防癌', '抗癌', '延寿', '增高', '治疗近视',
  // 金融违规
  '稳赚', '无风险', '保本', '高息回报', '躺着赚钱',
  // 涉政/暴恐（简版）
  '法轮', '反动', '暴力',
]

function containsSensitive(text: string): string | null {
  const lower = text.toLowerCase()
  for (const word of SENSITIVE_WORDS) {
    if (lower.includes(word.toLowerCase())) return word
  }
  return null
}

router.post('/submit', async (req, res, next) => {
  try {
    // 1) 限流
    const ip = getClientIp(req)
    const limit = checkRateLimit(ip)
    if (!limit.ok) {
      res.setHeader('Retry-After', String(limit.retryAfterSec || 3600))
      return res.status(429).json({
        ok: false,
        error: {
          code: 'TOO_MANY_REQUESTS',
          message: '提交过于频繁，请稍后再试',
        },
      })
    }

    const data = SubmitSchema.parse(req.body)

    // 2) 敏感词过滤
    const allText = `${data.name} ${data.description} ${data.reason || ''}`
    const hit = containsSensitive(allText)
    if (hit) {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'CONTENT_REJECTED',
          message: `提交内容包含违规词：「${hit}」，请修改后重试`,
        },
      })
    }

    const submission = await prisma.aiToolSubmission.create({
      data: {
        name: data.name,
        url: data.url,
        category: data.category,
        description: data.description,
        reason: data.reason || null,
        email: data.email || null,
        ipAddress: ip,
        userAgent: (req.headers['user-agent'] || '').slice(0, 500),
        status: 'PENDING',
      },
    })

    res.json(
      ok({
        id: submission.id,
        message: '提交成功！我们会在 1-3 个工作日内审核。',
      })
    )
  } catch (e) {
    next(e)
  }
})

// ===== 后台接口 =====

router.get('/admin/list', authMiddleware, async (req, res, next) => {
  try {
    const result = await aiToolService.listForAdmin({
      keyword: toStr(req.query.keyword),
      category: toStr(req.query.category),
      accessType: toStr(req.query.accessType),
      status: toStr(req.query.status),
      page: toInt(req.query.page, 1),
      pageSize: toInt(req.query.pageSize, 20),
    })
    res.json(ok(result))
  } catch (e) {
    next(e)
  }
})

router.get('/admin/:id', authMiddleware, async (req, res, next) => {
  try {
    const id = toIntOrNaN(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ ok: false, error: { code: 'BAD_REQUEST', message: 'id 无效' } })
    }
    const item = await aiToolService.getById(id)
    res.json(ok(item))
  } catch (e) {
    next(e)
  }
})

const CreateSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'slug 只能含小写字母、数字、-'),
  url: z.string().url(),
  icon: z.string().max(10).optional().default('🤖'),
  category: z.enum([
    'chat',
    'image',
    'video',
    'office',
    'code',
    'search',
    'writing',
    'audio',
    'learning',
    'agent',
  ]),
  accessType: z.enum(['DOMESTIC', 'GLOBAL']).default('GLOBAL'),
  priceType: z.enum(['FREE', 'FREEMIUM', 'PAID']).default('FREEMIUM'),
  description: z.string().min(1).max(500),
  tags: z.array(z.string()).optional().default([]),
  isFeatured: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
  status: z.enum(['ACTIVE', 'HIDDEN']).optional().default('ACTIVE'),
})

router.post(
  '/admin',
  authMiddleware,
  requireRole('super_admin', 'admin', 'editor'),
  async (req, res, next) => {
    try {
      const data = CreateSchema.parse(req.body)
      const item = await aiToolService.create({
        ...data,
        tags: JSON.stringify(data.tags),
      })
      res.json(ok(item))
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
      const id = toIntOrNaN(req.params.id)
      if (Number.isNaN(id)) {
        return res.status(400).json({ ok: false, error: { code: 'BAD_REQUEST', message: 'id 无效' } })
      }
      const data = CreateSchema.partial().parse(req.body)
      const updateData: any = { ...data }
      if (data.tags) updateData.tags = JSON.stringify(data.tags)
      const item = await aiToolService.update(id, updateData)
      res.json(ok(item))
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
      const id = toIntOrNaN(req.params.id)
      if (Number.isNaN(id)) {
        return res.status(400).json({ ok: false, error: { code: 'BAD_REQUEST', message: 'id 无效' } })
      }
      const item = await aiToolService.remove(id)
      res.json(ok(item))
    } catch (e) {
      next(e)
    }
  }
)

// 后台：提交记录列表
router.get('/admin/submissions/list', authMiddleware, async (req, res, next) => {
  try {
    const page = Math.max(1, toInt(req.query.page, 1))
    const pageSize = Math.min(100, Math.max(1, toInt(req.query.pageSize, 20)))
    const skip = (page - 1) * pageSize

    const where: any = {}
    const status = toStr(req.query.status)
    if (status) where.status = status

    const [items, total] = await Promise.all([
      prisma.aiToolSubmission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.aiToolSubmission.count({ where }),
    ])

    res.json(ok({ items, total, page, pageSize }))
  } catch (e) {
    next(e)
  }
})

// 后台：审核提交（通过 → 自动加入 AiTool）
const ReviewSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  reviewNote: z.string().optional(),
})

// 复用路由里的敏感词表（精简版，管理员侧再挡一次）
const ADMIN_SENSITIVE_WORDS = [
  '最佳', '最好', '最优', '最强', '第一', '唯一', '首选', '顶级',
  '根治', '疗效', '稳赚', '保本', '高息',
]

function adminContainsSensitive(text: string): string | null {
  const lower = text.toLowerCase()
  for (const word of ADMIN_SENSITIVE_WORDS) {
    if (lower.includes(word.toLowerCase())) return word
  }
  return null
}

router.put(
  '/admin/submissions/:id/review',
  authMiddleware,
  requireRole('super_admin', 'admin'),
  async (req, res, next) => {
    try {
      const data = ReviewSchema.parse(req.body)
      const id = toStr(req.params.id)
      if (!id) {
        return res.status(400).json({ ok: false, error: { code: 'BAD_REQUEST', message: 'id 必填' } })
      }
      const adminId = (req as any).admin?.id

      const submission = await prisma.aiToolSubmission.findUnique({ where: { id } })
      if (!submission) {
        return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: '提交记录不存在' } })
      }

      // 管理员再次拦截敏感词（防御性）
      if (data.status === 'APPROVED') {
        const hit = adminContainsSensitive(
          `${submission.name} ${submission.description}`
        )
        if (hit) {
          return res.status(400).json({
            ok: false,
            error: {
              code: 'CONTENT_REJECTED',
              message: `审核内容包含违规词：「${hit}」，请修改后再审核`,
            },
          })
        }
      }

      // 通过：自动加入 AiTool
      if (data.status === 'APPROVED') {
        // 生成 slug
        const baseSlug = submission.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 50)
        let slug = baseSlug || `tool-${Date.now()}`
        let suffix = 1
        // 确保 slug 唯一
        while (await prisma.aiTool.findUnique({ where: { slug } })) {
          slug = `${baseSlug}-${suffix++}`
        }

        // emoji 默认值
        const iconByCategory: Record<string, string> = {
          chat: '💬',
          image: '🎨',
          video: '🎬',
          office: '💼',
          code: '💻',
          search: '🔎',
          writing: '✍️',
          audio: '🎵',
          learning: '📚',
          agent: '🤖',
        }

        await prisma.aiTool.create({
          data: {
            name: submission.name,
            slug,
            url: submission.url,
            icon: iconByCategory[submission.category] || '🤖',
            category: submission.category,
            accessType: 'GLOBAL',
            priceType: 'FREEMIUM',
            description: submission.description,
            tags: '[]',
          },
        })
      }

      // 更新提交状态
      const updated = await prisma.aiToolSubmission.update({
        where: { id },
        data: {
          status: data.status,
          reviewNote: data.reviewNote || null,
          reviewedAt: new Date(),
          reviewerId: adminId || null,
        },
      })

      res.json(ok(updated))
    } catch (e) {
      next(e)
    }
  }
)

export default router
