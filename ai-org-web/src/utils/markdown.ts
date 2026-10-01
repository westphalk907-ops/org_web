import { marked } from 'marked'
import DOMPurify from 'dompurify'

/**
 * 渲染 Markdown 为 HTML（带净化）
 */
export function renderMarkdown(md: string): string {
  if (!md) return ''
  const html = marked.parse(md, { async: false, breaks: true }) as string
  return DOMPurify.sanitize(html, {
    ADD_ATTR: ['target', 'rel']
  })
}
