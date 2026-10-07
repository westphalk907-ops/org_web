import type { Request } from 'express'

/**
 * 获取真实客户端 IP（兼容 Vercel / 反向代理）
 * 优先级：X-Forwarded-For > X-Real-IP > req.ip > req.socket.remoteAddress
 */
export function getClientIp(req: Request): string {
  const xff = req.headers['x-forwarded-for']
  if (typeof xff === 'string' && xff.length > 0) {
    return xff.split(',')[0].trim().slice(0, 64)
  }
  const xri = req.headers['x-real-ip']
  if (typeof xri === 'string' && xri.length > 0) {
    return xri.slice(0, 64)
  }
  const ip = req.socket?.remoteAddress ||
             (req as any).ip ||
             'unknown'
  // 去除 IPv6 前缀
  return String(ip).replace(/^::ffff:/, '').slice(0, 64)
}