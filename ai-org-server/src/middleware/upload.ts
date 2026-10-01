import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import { randomUUID } from 'node:crypto'
import { config } from '../config/index.js'

// 确保上传目录存在
const uploadRoot = path.resolve(process.cwd(), config.upload.dir)
if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true })
}

// 磁盘存储 + 随机文件名（避免覆盖 + 安全）
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // 按年/月分子目录
    const now = new Date()
    const sub = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`
    const dest = path.join(uploadRoot, sub)
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
    cb(null, dest)
  },
  filename: (_req, file, cb) => {
    // 保留原始扩展名
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${randomUUID()}${ext}`)
  },
})

// 文件类型白名单
const ALLOWED_MIME = new Set([
  'application/pdf',
  'text/markdown',
  'text/plain',
  'text/html',
  // Word 文档
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  // 图片
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
  // 压缩包
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

/** 仅允许的图片 MIME */
const IMAGE_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
])

/** 图片最大 8MB（已通过 multer 校验后再做一次判断）
 *
 * ⚠️ 此常量必须与前端 src/constants/upload.ts 的 MAX_IMAGE_SIZE_MB
 *    以及 .env VITE_MAX_IMAGE_SIZE_MB 保持一致
 *    修改时三个地方都要改
 */
export const IMAGE_MAX_BYTES = 8 * 1024 * 1024

/** 图片专用 fileFilter */
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
 * 把磁盘上的文件路径转成对外可访问的 URL
 */
export function toPublicUrl(absolutePath: string): string {
  const rel = path.relative(process.cwd(), absolutePath).replace(/\\/g, '/')
  return `/${rel}`
}

/**
 * 把 multer 上传的文件转成 Resource 需要的 fileSize 字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
