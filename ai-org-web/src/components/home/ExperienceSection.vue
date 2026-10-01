<script setup lang="ts">
import { useReveal } from '@/composables/useScroll'
const { observe } = useReveal()

const EXPERIENCES = [
  {
    code: '01',
    title: 'AI Organization Assessment',
    desc: '3–5 分钟测评，输出你的企业 AI 阶段、主要短板和下一步建议。',
    duration: '3–5 min',
    href: '/experience'
  },
  {
    code: '02',
    title: 'AI 场景库',
    desc: '12+ 个具体业务场景，每个含痛点、传统 vs AI 对比、可复用 Prompt。',
    duration: '5–10 min',
    href: '/experience?tab=TEAM'
  },
  {
    code: '03',
    title: 'AI 场景 Demo',
    desc: '一键体验真实业务场景的 AI 改造效果，直观对比效率提升。',
    duration: '5–10 min',
    href: '/experience'
  }
]
</script>

<template>
  <section class="relative bg-ink-900 py-30">
    <div class="pointer-events-none absolute inset-0 bg-grid bg-grid-lg opacity-20" />

    <div class="container-wide relative">
      <SectionHeader
        eyebrow="04 · Experience"
        title="体验比阅读更有说服力"
        description="3 个核心互动，让你 5 分钟内得到一个明确判断。"
      />

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RouterLink
          v-for="(item, i) in EXPERIENCES"
          :key="item.code"
          :to="item.href"
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal group relative overflow-hidden rounded-2xl border border-ink-700/80 bg-ink-950 p-8 transition-all duration-500 hover:border-gold-700/60 hover:shadow-card-hover hover:-translate-y-1"
          :style="{ transitionDelay: `${i * 100}ms` }"
        >
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs text-gold-500/70">{{ item.code }}</span>
            <span class="tag-gold">{{ item.duration }}</span>
          </div>

          <h3 class="mt-8 text-2xl font-display font-medium text-ink-50 group-hover:text-gold-300 transition-colors leading-tight">
            {{ item.title }}
          </h3>

          <p class="mt-4 text-sm text-ink-200 leading-relaxed">
            {{ item.desc }}
          </p>

          <!-- 装饰图 -->
          <div class="relative mt-8 h-28 overflow-hidden rounded-xl border border-ink-800 bg-ink-900">
            <div class="absolute inset-0 bg-grid bg-grid-lg opacity-50" />
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/15 to-transparent" />
            <!-- 装饰线 -->
            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
              <path d="M0,80 Q50,40 100,60 T200,30" fill="none" stroke="#d4af37" stroke-width="1" opacity="0.4"/>
              <circle cx="100" cy="60" r="3" fill="#d4af37" />
            </svg>
          </div>

          <div class="mt-6 flex items-center gap-2 text-sm text-gold-400">
            <span>开始体验</span>
            <span class="transition-transform group-hover:translate-x-2">→</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
