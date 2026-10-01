/**
 * 统一 API 响应格式
 *
 * 成功：{ ok: true, data: T }
 * 失败：{ ok: false, error: { code, message, details? } }
 */
export interface ApiSuccess<T> {
  ok: true
  data: T
}

export interface ApiError {
  ok: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export const ok = <T>(data: T): ApiSuccess<T> => ({ ok: true, data })

export const fail = (code: string, message: string, details?: unknown): ApiError => ({
  ok: false,
  error: { code, message, details },
})

// 常见业务错误码
export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const
