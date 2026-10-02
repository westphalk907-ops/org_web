import multer from 'multer'
import { config } from '../config/index.js'

// ⚠️ Vercel Serverless 兼容性：
// - 不能用 diskStorage（Vercel 函数实例无持久磁盘，重启即丢失）
// - 改用 memoryStorage，文件以 Buffer 形式存在于 req.file.buffer
// - 然后由路由层把 buffer 上传到 Vercel Blob / S3 / R2 等外部服务

const storage = multer.memoryStorage()

// 文件类型白名单
const ALLOWED_MIME = new Set([
  'application/pdf',
  'text/markdown',
  'text/plain',
  'text/html',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
  'application/zip',
  'application/x-zip-compressed',
])

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (ALLOWED_MIME.has(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`不支持的文件类型: ${file.mimetype}`))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxSizeMB * 1024 * 1024,
  },
})

// ====================================================================
// 纯图片上传（用于文章封面、正文配图）
// ====================================================================

const IMAGE_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
])

export const IMAGE_MAX_BYTES = 8 * 1024 * 1024

const imageFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (IMAGE_MIME.has(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`不支持的图片类型: ${file.mimetype}（仅允许 png/jpg/webp/gif）`))
  }
}

export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: IMAGE_MAX_BYTES,
  },
})

/**
 * 把 multer 上传的文件转成 Resource 需要的 fileSize 字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}