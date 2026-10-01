<script setup lang="ts">
// 页脚导航
const FOOTER_LINKS = [
  { label: '关于我们', to: '/about' },
  { label: '联系我们', to: '/contact' },
  { label: '隐私政策', to: '/privacy' },
  { label: '服务条款', to: '/terms' }
]
</script>

<template>
  <footer class="relative bg-ink-950 border-t border-gold-700/20">
    <!-- 顶部品牌区 -->
    <div class="container-wide py-16">
      <div class="mx-auto max-w-md text-center">
        <RouterLink to="/" class="flex items-center justify-center gap-2">
          <div class="font-display text-lg font-semibold tracking-[0.2em] text-ink-50">道可乾元</div>
          <div class="h-5 w-px bg-gold-500/60" />
          <div class="font-display text-lg font-semibold tracking-[0.2em] text-ink-50">Do Core</div>
        </RouterLink>
        <p class="mt-4 text-sm text-ink-200 leading-relaxed">
          为明天挑战打造的前沿 AI 解决方案。
        </p>

        <!-- 底部导航链接 -->
        <nav class="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <RouterLink
            v-for="link in FOOTER_LINKS"
            :key="link.label"
            :to="link.to"
            class="text-xs text-ink-200 transition-colors hover:text-gold-300"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
      </div>
    </div>

    <!-- 底部一行 -->
    <div class="border-t border-ink-800">
      <div class="container-wide py-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div class="flex items-center gap-2">
          <div class="font-display text-sm font-semibold tracking-[0.2em] text-ink-50">道可乾元</div>
          <div class="h-3 w-px bg-gold-500/60" />
          <div class="font-display text-sm font-semibold tracking-[0.2em] text-ink-50">Do Core</div>
          <span class="ml-3 text-xs text-ink-200">hello@docore.com</span>
        </div>
        <div class="flex items-center gap-5 text-xs text-ink-200">
          <span>© 2025 道可乾元 Do Core 保留所有权利。</span>
        </div>
      </div>
    </div>
  </footer>
</template>
