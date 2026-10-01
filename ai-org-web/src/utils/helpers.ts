/**
 * 简单防抖
 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * 简单节流
 */
export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  interval = 300
): (...args: Parameters<T>) => void {
  let last = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn(...args)
    }
  }
}

/**
 * 邮箱校验
 */
export function isEmail(email: string): boolean {
  return /^[\w.+-]+@[a-zA-Z\d-]+(\.[a-zA-Z\d-]+)+$/.test(email)
}

/**
 * 复制到剪贴板（带降级方案）
 */
export async function copyText(text: string): Promise<boolean> {
  // 方案 1：现代 Clipboard API（需 HTTPS 或 localhost）
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // 进入降级方案
  }

  // 方案 2：execCommand('copy') 降级（兼容 HTTP、iframe、旧浏览器）
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.top = '0'
    textarea.style.left = '0'
    textarea.style.opacity = '0'
    textarea.style.pointerEvents = 'none'
    document.body.appendChild(textarea)

    textarea.focus()
    textarea.select()
    textarea.setSelectionRange(0, text.length)

    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}
