/**
 * 后台 Series 管理路由
 * --------------------------------------------------------------------------
 * 路由统一挂在 /api/series/admin/* 下，复用 /api/series 路由文件
 *
 * GET    /api/series/admin/list          列表（运营用，含未发布 / 软删）
 * GET    /api/series/admin/:id           单个详情（含子主题）
 * POST   /api/series/admin               新建
 * PUT    /api/series/admin/:id           更新（支持整体替换子主题）
 * DELETE /api/series/admin/:id           软删除
 *
 * 鉴权：editor / admin / super_admin
 */
import { Router } from 'express'
import { seriesService } from '../services/series.service.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { ok } from '../utils/response.js'

const adminRouter = Router()

/** GET /api/series/admin/list —— 列表 */
adminRouter.get(
  '/admin/list',
  authMiddleware,
  async (req, res, next) => {
    try {
      const items = await seriesService.listForAdmin({
        navSection: req.query.navSection as string | undefined,
        keyword: req.query.keyword as string | undefined,
      })
      res.json(ok(items))
    } catch (e) {
      next(e)
    }
  },
)

/** GET /api/series/admin/:id —— 详情 */
adminRouter.get(
  '/admin/:id',
  authMiddleware,
  async (req, res, next) => {
    try {
      const item = await seriesService.getById(String(req.params.id))
      res.json(ok(item))
    } catch (e) {
      next(e)
    }
  },
)

/** POST /api/series/admin —— 创建 */
adminRouter.post(
  '/admin',
  authMiddleware,
  requireRole('super_admin', 'admin', 'editor'),
  async (req, res, next) => {
    try {
      const item = await seriesService.create(req.body)
      res.json(ok(item))
    } catch (e) {
      next(e)
    }
  },
)

/** PUT /api/series/admin/:id —— 更新 */
adminRouter.put(
  '/admin/:id',
  authMiddleware,
  requireRole('super_admin', 'admin', 'editor'),
  async (req, res, next) => {
    try {
      const item = await seriesService.update(String(req.params.id), req.body)
      res.json(ok(item))
    } catch (e) {
      next(e)
    }
  },
)

/** DELETE /api/series/admin/:id —— 软删除 */
adminRouter.delete(
  '/admin/:id',
  authMiddleware,
  requireRole('super_admin', 'admin'),
  async (req, res, next) => {
    try {
      const r = await seriesService.remove(String(req.params.id))
      res.json(ok({ id: r.id, deletedAt: r.deletedAt }))
    } catch (e) {
      next(e)
    }
  },
)

export default adminRouter