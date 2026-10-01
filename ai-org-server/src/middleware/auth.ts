import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import { config } from '../config/index.js'
import { ApiError } from '../utils/apiError.js'

export interface AuthPayload {
  adminId: string
  username: string
  role: 'super_admin' | 'admin' | 'editor'
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload
    }
  }
}

/**
 * 鉴权中间件：校验 JWT，把 payload 挂到 req.auth
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return next(ApiError.unauthorized())
  }

  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, config.jwt.secret) as AuthPayload
    req.auth = payload
    next()
  } catch {
    next(ApiError.unauthorized('Token 无效或已过期'))
  }
}

/**
 * 角色守卫
 */
export function requireRole(...roles: AuthPayload['role'][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) return next(ApiError.unauthorized())
    if (!roles.includes(req.auth.role)) return next(ApiError.forbidden())
    next()
  }
}

/**
 * 签发 token
 */
export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as any,
  })
}
