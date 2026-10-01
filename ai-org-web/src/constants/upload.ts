/**
 * 上传相关常量
 *
 * 这些值必须与后端 .env 保持一致：
 *   - MAX_FILE_SIZE_MB（后端 src/config/index.ts）
 *   - IMAGE_MAX_BYTES（后端 src/middleware/upload.ts）
 *
 * 来源：Vite 环境变量 VITE_MAX_FILE_SIZE_MB / VITE_MAX_IMAGE_SIZE_MB
 * 设置在 .env.development / .env.production
 *
 * 设计原则：
 *   - 单点定义：所有上传限制都在这里改，前端不再硬编码
 *   - 安全兜底：环境变量缺失时用默认值，与后端默认值一致
 *   - 运行时校验：parseFloat 失败时回退到默认值（不会因为 env 配错导致白屏）
 */

const parseMb = (raw: string | undefined, fallback: number): number => {
  if (!raw) return fallback
  const n = parseFloat(raw)
  if (!Number.isFinite(n) || n <= 0) return fallback
  return n
}

/** 普通资料文件（白皮书 / Word / ZIP 等）单文件最大 MB */
export const MAX_FILE_SIZE_MB = parseMb(import.meta.env.VITE_MAX_FILE_SIZE_MB, 20)

/** 普通资料文件单文件最大字节数（前端 input accept & 客户端校验用） */
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

/** 图片文件（封面 / 正文配图）单文件最大 MB */
export const MAX_IMAGE_SIZE_MB = parseMb(import.meta.env.VITE_MAX_IMAGE_SIZE_MB, 8)

/** 图片文件单文件最大字节数 */
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

/**
 * 把字节数格式化成 "X.X MB" 形式的展示文案
 * 用于给用户看的提示
 */
export function formatSizeLimit(mb: number): string {
  // 整数 MB 直接显示，避免出现 "20.0 MB" 这种丑陋小数
  return Number.isInteger(mb) ? `${mb}MB` : `${mb.toFixed(1)}MB`
}