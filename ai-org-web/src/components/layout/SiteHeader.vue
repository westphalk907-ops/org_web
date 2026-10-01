<script setup lang="ts">
import { useScroll } from '@/composables/useScroll'
import { useRoute } from 'vue-router'

const { scrollY } = useScroll()
const route = useRoute()

// 7 项导航改为真实路由跳转（不在首屏内的锚点全部走路由）
const NAV_ITEMS = [
  { label: '首页',       en: 'Home',         to: '/' },
  { label: '认知',       en: 'Insight',      to: '/understand' },
  { label: '学习',       en: 'Learn',        to: '/learn' },
  { label: '体验',       en: 'Experience',   to: '/experience' },
  { label: '案例',       en: 'Cases',        to: '/cases' },
  { label: '资源',       en: 'Resources',    to: '/resources' }
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-500"
    :class="scrollY > 32 ? 'bg-ink-950/85 backdrop-blur-md border-b border-gold-700/20' : 'bg-transparent'"
  >
    <div class="container-wide flex h-16 items-center justify-between gap-6">
      <!-- 左：道可乾元 / Do Core Logo -->
      <RouterLink to="/" class="flex shrink-0 items-center gap-2">
        <div class="font-display text-lg font-semibold tracking-[0.2em] text-ink-50">道可乾元</div>
        <div class="h-5 w-px bg-gold-500/60" />
        <div class="font-display text-lg font-semibold tracking-[0.2em] text-ink-50">Do Core</div>
      </RouterLink>

      <!-- 中：7 项导航（路由跳转；仅首页内 "首页" 锚点保留 hash 语义） -->
      <nav class="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-7">
        <RouterLink
          v-for="item in NAV_ITEMS"
          :key="item.label"
          :to="item.to"
          class="group flex flex-col items-center"
          :class="{ 'text-gold-300': isActive(item.to) }"
        >
          <span class="text-xs sm:text-sm font-medium transition-colors group-hover:text-gold-300 whitespace-nowrap" :class="isActive(item.to) ? 'text-gold-300' : 'text-ink-100'">
            {{ item.label }}
          </span>
          <span class="mt-0.5 hidden sm:block text-[10px] uppercase tracking-[0.25em] transition-colors group-hover:text-gold-500" :class="isActive(item.to) ? 'text-gold-400' : 'text-ink-200'">
            {{ item.en }}
          </span>
        </RouterLink>
      </nav>

      <!-- 右：找到你的 AI 下一步 CTA -->
      <RouterLink
        to="/experience/assessment"
        class="group flex shrink-0 items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/5 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-gold-300 backdrop-blur transition-all hover:border-gold-400 hover:bg-gold-500/10 hover:text-gold-200"
      >
        <span>找到你的 AI 下一步</span>
        <span class="transition-transform group-hover:translate-x-1">→</span>
      </RouterLink>
    </div>
  </header>
</template>
