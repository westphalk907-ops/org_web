/**
 * 业务错误类
 * 在 service / controller 抛出，由 errorMiddleware 统一处理
 */
import { ErrorCodes } from './response.js'

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }

  static unauthorized(message = '未登录或登录已过期') {
    return new ApiError(ErrorCodes.UNAUTHORIZED, message, 401)
  }
  static forbidden(message = '权限不足') {
    return new ApiError(ErrorCodes.FORBIDDEN, message, 403)
  }
  static notFound(message = '资源不存在') {
    return new ApiError(ErrorCodes.NOT_FOUND, message, 404)
  }
  static conflict(message = '资源冲突', details?: unknown) {
    return new ApiError(ErrorCodes.CONFLICT, message, 409, details)
  }
  static validation(message: string, details?: unknown) {
    return new ApiError(ErrorCodes.VALIDATION_ERROR, message, 422, details)
  }
  static internal(message = '服务器内部错误', details?: unknown) {
    return new ApiError(ErrorCodes.INTERNAL_ERROR, message, 500, details)
  }
}
