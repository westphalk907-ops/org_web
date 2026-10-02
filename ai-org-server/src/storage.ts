/**
 * 文件存储适配器
 *
 * Vercel Serverless 兼容性：
 * - 不能写本地磁盘
 * - 在 Vercel 环境：使用 Vercel Blob（需要环境变量 BLOB_READ_WRITE_TOKEN）
 * - 在本地环境：使用本地文件系统（兼容现有开发流程）
 *
 * 使用：
 *   import { saveBuffer, getPublicUrl } from './storage.js'
 *   const filename = await saveBuffer(file.buffer, file.originalname, file.mimetype)
 *   const url = getPublicUrl(filename)
 */
import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

const isVercel = process.env.VERCEL === '1' || !!process.env.BLOB_READ_WRITE_TOKEN

const LOCAL_UPLOAD_ROOT = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads')

/**
 * 保存上传的 buffer，返回公开 URL
 * 在 Vercel：上传到 Vercel Blob，返回永久 https URL
 * 在本地：写入本地 uploads/ 目录，返回 /uploads/... 路径
 */
export async function saveBuffer(
  buffer: Buffer,
  originalName: string,
  mimetype: string
): Promise<{ url: string; filename: string }> {
  const ext = path.extname(originalName).toLowerCase()
  const filename = `${randomUUID()}${ext}`

  if (isVercel) {
    // Vercel Blob 存储
    const { put } = await import('@vercel/blob')
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: mimetype,
    })
    return { url: blob.url, filename }
  }

  // 本地文件系统
  const now = new Date()
  const sub = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`
  const dest = path.join(LOCAL_UPLOAD_ROOT, sub)
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
  const filepath = path.join(dest, filename)
  fs.writeFileSync(filepath, buffer)

  const rel = path.relative(process.cwd(), filepath).replace(/\\/g, '/')
  return { url: `/${rel}`, filename }
}

/**
 * 获取已保存文件的公开 URL（用于已有的相对路径）
 */
export function getPublicUrl(filepath: string): string {
  if (filepath.startsWith('http://') || filepath.startsWith('https://')) {
    return filepath
  }
  return `/${path.relative(process.cwd(), filepath).replace(/\\/g, '/')}`
}