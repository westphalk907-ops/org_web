import type { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/apiError.js'
import { fail, ErrorCodes } from '../utils/response.js'

/**
 * 全局错误处理
 *
 * - ApiError → 已知业务错误，按 statusCode 返回
 * - ZodError → 422 校验错误
 * - 其他 → 500 兜底
 */
export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Zod 校验错误
  if (err.name === 'ZodError') {
    res.status(422).json(
      fail(ErrorCodes.VALIDATION_ERROR, '参数校验失败', (err as any).issues)
    )
    return
  }

  // 业务 ApiError
  if (err instanceof ApiError) {
    res.status(err.statusCode).json(fail(err.code, err.message, err.details))
    return
  }

  // 未知错误
  console.error('[Unhandled Error]', err)
  res.status(500).json(
    fail(ErrorCodes.INTERNAL_ERROR, err.message || '服务器内部错误')
  )
}

/**
 * 404 处理
 */
export function notFoundMiddleware(req: Request, res: Response) {
  res.status(404).json(fail('NOT_FOUND', `路由不存在: ${req.method} ${req.path}`))
}
