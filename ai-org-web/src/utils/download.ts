/**
 * 资源下载工具
 *
 * 三种下载策略：
 *  - pdf  → 后端流式代理 /api/download?id=xxx → Blob → 自动下载
 *  - md   → 前端生成 Blob → 下载 .md 文件（用于 Prompt 包）
 *  - link → window.open 打开外部链接 / 站内页面
 *
 * 当前为前端 mock：后端只需实现 GET /api/download?id=xxx → 文件流
 * 后期接后端时只需替换 downloadByProxy 内的 fetch 逻辑。
 */
import type { ContentItem } from '@/types/content'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'
// 后端文件上传走这个域名（默认 4000 端口）
// 已上传的文件 fileUrl 是 /uploads/... 形式，需要拼上后端域名
const UPLOAD_BASE = import.meta.env.VITE_UPLOAD_BASE || API_BASE.replace(/\/api$/, '')

/**
 * 解析 fileUrl 为可访问的 URL
 * - 后端上传：/uploads/xxx → http://localhost:4000/uploads/xxx
 * - 静态资源：/files/xxx → 直接用（public 目录）
 * - 外部链接：http://... → 直接用
 * - 站内跳转：/experience/xxx → 直接用
 */
export function resolveFileUrl(url: string): string {
  if (!url) return url
  // 已经是绝对 URL
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  // 后端上传的文件
  if (url.startsWith('/uploads/')) return `${UPLOAD_BASE}${url}`
  // 静态资源 / 站内跳转
  return url
}

/**
 * 触发浏览器下载 Blob
 */
export function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // 释放内存
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * 从 URL 下载文件（fetch 流式，绕过跨域、保留文件名）
 * - 后端实现：GET /api/download?id=xxx → 文件流 + Content-Disposition
 */
export async function downloadByProxy(url: string, fileName: string) {
  const res = await fetch(url, { method: 'GET' })
  if (!res.ok) throw new Error(`下载失败：${res.status}`)
  const blob = await res.blob()
  saveBlob(blob, fileName)
}

/**
 * 把字符串保存为 .md 文件（用于 Prompt 一键下载）
 */
export function downloadAsMarkdown(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  saveBlob(blob, fileName.endsWith('.md') ? fileName : `${fileName}.md`)
}

/**
 * 打开链接（站内或站外）
 */
export function openLink(href: string, newTab = true) {
  if (newTab) window.open(href, '_blank', 'noopener,noreferrer')
  else window.location.href = href
}

/**
 * 主入口：按资源类型分发下载动作
 */
export async function downloadResource(item: ContentItem) {
  if (!item.fileType) {
    throw new Error('资源未配置下载方式')
  }

  // 站外链接 / 站内页面：直接跳转
  if (item.fileType === 'link') {
    const target = item.fileUrl || `/resources/${item.slug}`
    openLink(target, true)
    return
  }

  // Prompt / md：前端直接生成 .md
  if (item.fileType === 'md') {
    if (!item.fileUrl) throw new Error('Markdown 资源缺少 fileUrl')
    const res = await fetch(resolveFileUrl(item.fileUrl))
    if (!res.ok) throw new Error(`下载失败：${res.status}`)
    const text = await res.text()
    const name = item.fileName || `${item.slug}.md`
    downloadAsMarkdown(text, name)
    return
  }

  // PDF / ZIP / 其他：走后端流式代理
  if (item.fileType === 'pdf' || item.fileType === 'zip' || item.fileType === 'notion') {
    const downloadUrl = item.fileUrl ? resolveFileUrl(item.fileUrl) : `${API_BASE}/download?id=${item.id}`
    const ext = item.fileType === 'zip' ? '.zip' : '.pdf'
    const name = item.fileName || `${item.slug}${ext}`
    await downloadByProxy(downloadUrl, name)
    return
  }

  throw new Error(`暂不支持的文件类型：${item.fileType}`)
}

/**
 * UI 文案：按 fileType 返回对应的 CTA
 */
export function downloadCta(item: ContentItem): string {
  switch (item.fileType) {
    case 'pdf':
      return '↓ 下载 PDF'
    case 'md':
      return '↓ 下载 .md'
    case 'zip':
      return '↓ 下载压缩包'
    case 'link':
      return '查看 →'
    case 'notion':
      return '查看原文 →'
    default:
      return '查看 →'
  }
}
