<script setup lang="ts">
import { useReveal } from '@/composables/useScroll'
const { observe } = useReveal()

const PATHS = [
  { label: '我要提升员工 AI 能力', target: 'AI Academy', href: '/act/academy' },
  { label: '我要找到 AI 场景', target: 'AI Work Lab', href: '/act/work-lab' },
  { label: '我要重构工作流程', target: 'AI Workflow', href: '/experience?tab=SALES' },
  { label: '我要制定组织路线', target: 'AI Organization Consulting', href: '/act/consulting' }
]
</script>

<template>
  <section class="relative bg-ink-900 py-30 overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-grid bg-grid-lg opacity-20" />
    <div class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full bg-gold-500/5 blur-[140px]" />

    <div class="container-wide relative">
      <div
        :ref="(el) => observe(el as HTMLElement)"
        class="reveal rounded-3xl border border-gold-700/30 bg-gradient-to-br from-ink-900 via-ink-950 to-ink-900 p-12 lg:p-16 shadow-gold-glow"
      >
        <div class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div class="section-eyebrow">08 · Next Step</div>
            <h2 class="mt-4 text-display-lg font-display font-light text-ink-50 leading-[1.15]">
              找到你的<br />
              <span class="text-gradient-gold font-medium">AI 组织下一步</span>
            </h2>
            <p class="mt-6 max-w-md text-base text-ink-200 leading-relaxed">
              告诉我们你现在处于哪个阶段，我们帮助你找到适合的下一步。
            </p>
          </div>

          <div class="space-y-3">
            <RouterLink
              v-for="(p, i) in PATHS"
              :key="p.label"
              :to="p.href"
              class="group flex items-center justify-between gap-4 rounded-xl border border-ink-700/80 bg-ink-950/60 px-6 py-5 backdrop-blur transition-all duration-300 hover:border-gold-700/60 hover:bg-ink-950 hover:translate-x-1"
              :style="{ transitionDelay: `${i * 60}ms` }"
            >
              <div>
                <div class="text-sm text-ink-100 group-hover:text-gold-300 transition-colors">
                  {{ p.label }}
                </div>
                <div class="mt-1 text-xs font-mono text-ink-200">
                  → {{ p.target }}
                </div>
              </div>
              <span class="text-gold-400 transition-transform group-hover:translate-x-2">→</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
