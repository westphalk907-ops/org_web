<script setup lang="ts">
import { useReveal } from '@/composables/useScroll'
const { observe } = useReveal()
</script>

<template>
  <section class="relative overflow-hidden bg-ink-950 pt-32 pb-24">
    <!-- 背景：米金光晕 + 细网格 -->
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 h-[420px] w-[760px] rounded-full bg-gold-500/8 blur-[140px]" />
      <div class="absolute bottom-0 right-1/4 h-[300px] w-[480px] rounded-full bg-gold-700/5 blur-[120px]" />
    </div>
    <div class="pointer-events-none absolute inset-0 bg-grid bg-grid-lg opacity-25" />

    <div class="container-wide relative">
      <div class="mx-auto max-w-3xl text-center">

        <!-- 顶部标记 INSIGHT -->
        <div
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal flex items-center justify-center gap-3"
        >
          <span class="h-px w-10 bg-gradient-to-r from-transparent to-gold-500/70" />
          <span class="font-mono text-[11px] uppercase tracking-[0.5em] text-gold-400">
            Insight
          </span>
          <span class="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/70" />
        </div>

        <!-- 主标题 -->
        <h1
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal mt-8 font-display text-display-md lg:text-display-lg font-light leading-[1.15] text-balance"
          style="transition-delay: 0.1s"
        >
          <span class="block text-ink-50">AI 组织变革</span>
          <span class="block mt-1">
            <span class="text-gradient-gold font-medium">认知地图</span>
          </span>
        </h1>

        <!-- 副标语：三段式 -->
        <p
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal mt-7 text-base lg:text-lg text-ink-100 leading-relaxed tracking-wide"
          style="transition-delay: 0.2s"
        >
          <span class="text-ink-50">看见变化</span>
          <span class="mx-3 text-gold-500/60">·</span>
          <span class="text-ink-50">理解变化</span>
          <span class="mx-3 text-gold-500/60">·</span>
          <span class="text-ink-50">建立判断</span>
        </p>

        <!-- 角色定位说明 -->
        <p
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal mt-5 text-sm text-ink-200 max-w-xl mx-auto leading-relaxed"
          style="transition-delay: 0.3s"
        >
          公众号持续观察 AI 的变化，认知页把变化组织起来，形成对 AI 组织变革的系统认知。
        </p>

        <!-- 向下滚动提示 -->
        <div
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal mt-14 flex flex-col items-center gap-2"
          style="transition-delay: 0.5s"
        >
          <span class="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-200">从个体到组织</span>
          <div class="h-10 w-px bg-gradient-to-b from-gold-500/60 to-transparent" />
        </div>

      </div>
    </div>
  </section>
</template>
