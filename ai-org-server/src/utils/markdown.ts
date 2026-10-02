// 服务端 Markdown 渲染 + XSS sanitize
// 用 sanitize-html 替代 jsdom + dompurify（避免 Vercel ESM/CJS 冲突）
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

/**
 * Markdown → HTML，自动 sanitize 防 XSS
 */
export function renderMarkdown(md: string): string {
  const raw = marked.parse(md, { async: false }) as string
  return sanitizeHtml(raw, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr', 'blockquote',
      'ul', 'ol', 'li',
      'strong', 'em', 'b', 'i', 'u', 's', 'del',
      'code', 'pre',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title'],
      code: ['class'],
      pre: ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: (tagName: string, attribs: any) => ({
        tagName,
        attribs: {
          ...attribs,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    },
  })
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
