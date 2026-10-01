import { Router } from 'express'
import { z } from 'zod'
import { authService } from '../services/auth.service.js'
import { authMiddleware } from '../middleware/auth.js'
import { ok } from '../utils/response.js'
import { ApiError } from '../utils/apiError.js'
import { prisma } from '../db/client.js'

const router = Router()

const LoginSchema = z.object({
  username: z.string().min(1, '账号不能为空'),
  password: z.string().min(1, '密码不能为空'),
})

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res, next) => {
  try {
    const data = LoginSchema.parse(req.body)
    const result = await authService.login(data.username, data.password)
    res.json(ok(result))
  } catch (e) {
    next(e)
  }
})

/**
 * GET /api/auth/me —— 当前登录用户
 */
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    if (!req.auth) throw ApiError.unauthorized()
    const admin = await prisma.admin.findUnique({
      where: { id: req.auth.adminId },
      select: { id: true, username: true, email: true, role: true, lastLoginAt: true },
    })
    if (!admin) throw ApiError.unauthorized('用户不存在')
    res.json(ok(admin))
  } catch (e) {
    next(e)
  }
})

export default router
