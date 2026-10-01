<script setup lang="ts">
interface Props {
  variant?: 'header' | 'hero' | 'footer'
  showSubtitle?: boolean
}
withDefaults(defineProps<Props>(), {
  variant: 'header',
  showSubtitle: true
})
</script>

<template>
  <!-- Header / Footer Logo: 方块 AI + 文字 -->
  <RouterLink v-if="variant !== 'hero'" to="/" class="group flex items-center gap-3">
    <div class="relative h-9 w-9 rounded-md bg-gold-gradient">
      <div class="absolute inset-[2px] rounded-[5px] bg-ink-950 grid place-items-center">
        <span class="font-display text-sm font-semibold text-gradient-gold leading-none">AI</span>
      </div>
    </div>
    <div v-if="showSubtitle" class="leading-tight">
      <div class="text-sm font-medium tracking-[0.3em] text-ink-50 group-hover:text-gold-300 transition-colors uppercase">
        Forge
      </div>
      <div class="text-[10px] uppercase tracking-[0.25em] text-ink-200">
        From AI Adoption to AI Organization
      </div>
    </div>
  </RouterLink>

  <!-- Hero Logo: 中央金色六边形 + 文字 -->
  <div v-else class="flex flex-col items-center gap-5">
    <!-- 六边形徽标 -->
    <div class="relative">
      <svg viewBox="0 0 120 120" class="h-20 w-20 lg:h-24 lg:w-24">
        <defs>
          <linearGradient id="forge-hex" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f5edd5" />
            <stop offset="50%" stop-color="#d4af37" />
            <stop offset="100%" stop-color="#a17a25" />
          </linearGradient>
          <linearGradient id="forge-hex-inner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#080808" />
            <stop offset="100%" stop-color="#181818" />
          </linearGradient>
        </defs>
        <!-- 外六边形 -->
        <polygon
          points="60,4 112,32 112,88 60,116 8,88 8,32"
          fill="none"
          stroke="url(#forge-hex)"
          stroke-width="1.5"
        />
        <!-- 内六边形 -->
        <polygon
          points="60,18 98,38 98,82 60,102 22,82 22,38"
          fill="url(#forge-hex-inner)"
          stroke="url(#forge-hex)"
          stroke-width="0.8"
          opacity="0.95"
        />
        <!-- 中心 AI 文字 -->
        <text
          x="60"
          y="68"
          text-anchor="middle"
          fill="url(#forge-hex)"
          font-family="serif"
          font-size="22"
          font-weight="500"
          letter-spacing="1"
        >AI</text>
      </svg>
      <!-- 光晕 -->
      <div class="absolute inset-0 -z-10 blur-2xl bg-gold-500/30 rounded-full" />
    </div>

    <!-- 品牌文字 -->
    <div class="text-center">
      <div class="font-display text-[10px] uppercase tracking-[0.6em] text-gold-400 pl-[0.6em]">
        Forge
      </div>
      <div class="mt-3 text-[10px] font-mono uppercase tracking-[0.4em] text-ink-200">
        From AI Adoption to AI Organization
      </div>
    </div>
  </div>
</template>
