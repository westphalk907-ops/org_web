import { onMounted, onUnmounted, ref, type Ref } from 'vue'

/**
 * 滚动到元素时触发的渐入动画
 */
export function useReveal(threshold = 0.15) {
  const elements: Ref<HTMLElement[]> = ref([])

  const observer = (() => {
    if (typeof window === 'undefined') return null
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer?.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin: '0px 0px -80px 0px' }
    )
  })()

  function observe(el: HTMLElement | { $el?: HTMLElement | null } | null) {
    if (!el || !observer) return
    const target = (el as { $el?: HTMLElement | null }).$el ?? (el as HTMLElement)
    if (!(target instanceof Element)) return
    observer.observe(target)
    elements.value.push(target as HTMLElement)
  }

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { observe }
}

/**
 * 监听滚动方向
 */
export function useScroll() {
  const scrollY = ref(0)
  const direction = ref<'up' | 'down'>('down')
  let lastY = 0

  function update() {
    const y = window.scrollY
    if (y > lastY) direction.value = 'down'
    else if (y < lastY) direction.value = 'up'
    lastY = y
    scrollY.value = y
  }

  onMounted(() => {
    window.addEventListener('scroll', update, { passive: true })
    update()
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', update)
  })

  return { scrollY, direction }
}

/**
 * 平滑滚动到锚点
 */
export function scrollToAnchor(selector: string, offset = 80) {
  const el = document.querySelector(selector)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}
