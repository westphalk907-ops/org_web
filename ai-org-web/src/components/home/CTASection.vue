<script setup lang="ts">
import { useReveal } from '@/composables/useScroll'
const { observe } = useReveal()
</script>

<template>
  <section id="contact" class="relative bg-ink-900 py-30 overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-grid bg-grid-lg opacity-25" />
    <div class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gold-500/8 blur-[140px]" />

    <div class="container-wide relative">
      <div class="mx-auto max-w-5xl text-center">
        <div
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal mb-8 inline-flex items-center gap-2"
        >
          <span class="h-px w-8 bg-gold-500" />
          <span class="text-xs font-mono uppercase tracking-[0.3em] text-gold-400">
            行动 · 即刻开始
          </span>
          <span class="h-px w-8 bg-gold-500" />
        </div>

        <h2
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal text-display-lg lg:text-display-xl font-display font-light leading-[1.1] text-balance"
          style="transition-delay: 0.1s"
        >
          <span class="text-ink-50">让我们一起</span><br />
          <span class="text-gradient-gold font-medium">共建智能未来</span>
        </h2>

        <p
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal mx-auto mt-8 max-w-2xl text-base lg:text-lg text-ink-200 leading-relaxed"
          style="transition-delay: 0.2s"
        >
          加入我们，共建一个更智能、AI 驱动的世界，让创新没有边界。
        </p>

        <div
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal mt-12 flex flex-wrap items-center justify-center gap-4"
          style="transition-delay: 0.3s"
        >
          <BaseButton to="/contact" variant="primary" size="lg">
            立即加入
            <span class="ml-1">→</span>
          </BaseButton>
          <BaseButton to="/contact" variant="secondary" size="lg">
            联系我们
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
