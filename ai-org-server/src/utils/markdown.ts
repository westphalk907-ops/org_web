// 服务端：jsdom 模拟 DOM
import { marked } from 'marked'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const window = new JSDOM('').window
const purify = createDOMPurify(window as any)

/**
 * Markdown → HTML，自动 sanitize 防 XSS
 */
export function renderMarkdown(md: string): string {
  const raw = marked.parse(md, { async: false }) as string
  return purify.sanitize(raw)
}

/**
 * 估算阅读时间（按中文 300 字/分钟、英文 200 词/分钟 估算）
 */
export function estimateReadingTime(text: string): number {
  const cnChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const enWords = (text.match(/[a-zA-Z]+/g) || []).length
  const minutes = cnChars / 300 + enWords / 200
  return Math.max(1, Math.ceil(minutes))
}