import { Router } from 'express'
import { z } from 'zod'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { homeConfigService } from '../services/homeConfig.service.js'
import { ok } from '../utils/response.js'

const router = Router()

/**
 * GET /api/home-config —— 前台一次拉所有配置
 * Query: ?keys=hero,painPoints,methodology
 */
router.get('/', async (req, res, next) => {
  try {
    const keysParam = req.query.keys as string | undefined
    const keys = keysParam ? keysParam.split(',').filter(Boolean) : undefined

    if (keys && keys.length > 0) {
      const result: Record<string, unknown> = {}
      for (const k of keys) {
        try {
          result[k] = await homeConfigService.get(k)
        } catch {
          // 单个 key 不存在时忽略
        }
      }
      res.json(ok(result))
    } else {
      const list = await homeConfigService.list()
      res.json(ok(list))
    }
  } catch (e) {
    next(e)
  }
})

/**
 * GET /api/home-config/:key —— 单个配置
 */
router.get('/:key', async (req, res, next) => {
  try {
    const payload = await homeConfigService.get(req.params.key)
    res.json(ok(payload))
  } catch (e) {
    next(e)
  }
})

// ---- 后台 ----

const UpsertSchema = z.object({
  payload: z.unknown(),
})

router.put(
  '/:key',
  authMiddleware,
  requireRole('super_admin', 'admin', 'editor'),
  async (req, res, next) => {
    try {
      const { payload } = UpsertSchema.parse(req.body)
      const r = await homeConfigService.upsert(String(req.params.key), payload, req.auth?.adminId)
      res.json(ok(r))
    } catch (e) {
      next(e)
    }
  }
)

export default router