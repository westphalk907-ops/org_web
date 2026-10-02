// 服务端 Markdown 渲染 + XSS sanitize
// 完全自己实现 sanitize，避免任何第三方 ESM-only 依赖
// marked 降级到 v9.x（CJS），彻底消除 ERR_REQUIRE_ESM
import { marked } from 'marked'

/**
 * 极简 HTML sanitizer
 * - 去除 <script>、<style>、<iframe>、<object>、<embed>、<form> 等危险标签
 * - 去除所有 on* 事件属性
 * - 去除 javascript: 协议
 * 仅用于 markdown 渲染结果（已生成的 HTML），不做白名单过滤
 */
export function sanitizeHtml(input: string): string {
  let html = input

  // 1. 移除危险标签及其内容
  const dangerousTags = [
    'script', 'style', 'iframe', 'object', 'embed',
    'form', 'input', 'button', 'textarea', 'select',
    'link', 'meta', 'base', 'frame', 'frameset', 'noframes',
  ]
  for (const tag of dangerousTags) {
    const re = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}>`, 'gi')
    html = html.replace(re, '')
    const re2 = new RegExp(`<${tag}\\b[^>]*/?>`, 'gi')
    html = html.replace(re2, '')
  }

  // 2. 移除 on* 事件属性
  html = html.replace(/\\s+on\\w+\\s*=\\s*("[^"]*"|'[^']*'|[^\\s>]+)/gi, '')

  // 3. 移除 javascript: 协议
  html = html.replace(/javascript\\s*:/gi, '')

  // 4. 移除危险的 data: 协议（只允许图片 data URI）
  html = html.replace(/\\s(href|src|action|formaction)\\s*=\\s*("data:(?!image\\/[a-z]+;base64,)|'data:(?!image\\/[a-z]+;base64,))/gi, ' $1=""')

  return html
}

/**
 * Markdown → HTML，自动 sanitize 防 XSS
 */
export function renderMarkdown(md: string): string {
  const raw = marked.parse(md, { async: false }) as string
  return sanitizeHtml(raw)
}

/**
 * 估算阅读时间（按中文 300 字/分钟、英文 200 词/分钟 估算）
 */
export function estimateReadingTime(text: string): number {
  const cnChars = (text.match(/[\\u4e00-\\u9fa5]/g) || []).length
  const enWords = (text.match(/[a-zA-Z]+/g) || []).length
  const minutes = cnChars / 300 + enWords / 200
  return Math.max(1, Math.ceil(minutes))
}
