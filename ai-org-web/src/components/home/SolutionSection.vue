<script setup lang="ts">
import { useReveal } from '@/composables/useScroll'
const { observe } = useReveal()

// 三维解决方案
const PILLARS = [
  {
    id: '人',
    en: 'INDIVIDUAL',
    label: '人',
    subtitle: 'AI 个体能力',
    tagline: '培训改变能力',
    desc: '从 AI Literacy 到 AI Fluency——帮助每一位员工建立与 AI 协作的信心与习惯。',
    tags: ['Academy 培训体系', 'Learning Map 学习地图', 'AI 使用规范'],
    iconPath: 'M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zm0 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z'
  },
  {
    id: '工作',
    en: 'WORK',
    label: '工作',
    subtitle: 'AI Workflow',
    tagline: '项目改变工作',
    desc: '从单个场景切入——将 AI 嵌入真实工作流程，以项目驱动真实改变。',
    tags: ['Work Lab 工作实验室', '场景设计', '流程再造'],
    iconPath: 'M3 3h18v4H3V3zm0 6h18v4H3V9zm0 6h10v4H3v-4z'
  },
  {
    id: '组织',
    en: 'ORGANIZATION',
    label: '组织',
    subtitle: 'AI Organization',
    tagline: '咨询改变组织',
    desc: '从战略到治理——帮助企业建立 AI 时代的组织能力、决策机制与文化。',
    tags: ['AI 战略规划', '治理框架', '组织变革咨询'],
    iconPath: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'
  }
]

</script>

<template>
  <section id="solution" class="relative overflow-hidden bg-ink-900 pt-20 pb-20">
    <!-- 背景 -->
    <div class="pointer-events-none absolute inset-0 bg-grid bg-grid-lg opacity-10" />
    <div class="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-gold-500/4 blur-[180px]" />

    <div class="container-wide relative">

      <!-- ========== 标题区 ========== -->
      <div class="mx-auto mb-20 max-w-3xl text-center">
        <div
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal mb-5 inline-flex items-center gap-2"
        >
          <span class="h-px w-8 bg-gold-500" />
          <span class="text-xs font-mono uppercase tracking-[0.3em] text-gold-400">
            AI ORGANIZATION TRANSFORMATION
          </span>
          <span class="h-px w-8 bg-gold-500" />
        </div>
        <h2
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal text-display-lg font-display font-light text-ink-50 leading-tight"
          style="transition-delay: 0.1s"
        >
          一场 AI 组织变革，<br class="hidden lg:block" />
          需要同时改变<span class="text-gradient-gold font-medium">三件事</span>
        </h2>
        <p
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal mx-auto mt-6 max-w-xl text-base text-ink-200 leading-relaxed"
          style="transition-delay: 0.2s"
        >
          从一个人会用 AI，到一个组织与 AI 共事——<br>
          人、工作、组织，三个维度缺一不可。
        </p>
      </div>

      <!-- ========== 人 × 工作 × 组织 三角体系 ========== -->
      <div
        :ref="(el) => observe(el as HTMLElement)"
        class="reveal mb-16"
        style="transition-delay: 0.3s"
      >
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">

          <!-- 三角：个体（底部） -->
          <div class="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-8">

            <!-- 人 -->
            <article class="group relative rounded-2xl border border-ink-700/60 bg-gradient-to-br from-ink-800 to-ink-950 p-8 transition-all duration-500 hover:border-gold-500/50 hover:shadow-2xl hover:shadow-gold-500/5">
              <div class="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-gold-500/0 to-gold-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />

              <div class="mb-6 flex items-center gap-4">
                <div class="flex h-14 w-14 items-center justify-center rounded-xl border border-gold-500/30 bg-ink-900">
                  <svg class="h-7 w-7 text-gold-400" viewBox="0 0 24 24" fill="none">
                    <path :d="PILLARS[0].iconPath" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div>
                  <div class="font-mono text-[10px] uppercase tracking-[0.3em] text-gold-400/70">
                    {{ PILLARS[0].en }}
                  </div>
                  <div class="mt-1 text-2xl font-display font-medium text-ink-50">
                    {{ PILLARS[0].label }}
                  </div>
                </div>
              </div>

              <div class="mb-4 text-xs font-mono uppercase tracking-[0.2em] text-gold-400">
                {{ PILLARS[0].subtitle }}
              </div>

              <p class="text-sm text-ink-200 leading-relaxed mb-6">
                {{ PILLARS[0].desc }}
              </p>

              <div class="mb-6 space-y-2">
                <div
                  v-for="tag in PILLARS[0].tags"
                  :key="tag"
                  class="inline-flex items-center gap-2 rounded-md border border-ink-700/40 bg-ink-950/60 px-3 py-1.5 mr-2 mb-2"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-gold-500/60" />
                  <span class="text-xs text-ink-200">{{ tag }}</span>
                </div>
              </div>

              <div class="border-t border-ink-700/40 pt-4">
                <p class="text-xs font-mono text-gold-400/80">
                  {{ PILLARS[0].tagline }}
                </p>
              </div>
            </article>

            <!-- 工作 -->
            <article class="group relative rounded-2xl border border-ink-700/60 bg-gradient-to-br from-ink-800 to-ink-950 p-8 transition-all duration-500 hover:border-gold-500/50 hover:shadow-2xl hover:shadow-gold-500/5">
              <div class="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-gold-500/0 to-gold-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />

              <div class="mb-6 flex items-center gap-4">
                <div class="flex h-14 w-14 items-center justify-center rounded-xl border border-gold-500/30 bg-ink-900">
                  <svg class="h-7 w-7 text-gold-400" viewBox="0 0 24 24" fill="none">
                    <path :d="PILLARS[1].iconPath" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div>
                  <div class="font-mono text-[10px] uppercase tracking-[0.3em] text-gold-400/70">
                    {{ PILLARS[1].en }}
                  </div>
                  <div class="mt-1 text-2xl font-display font-medium text-ink-50">
                    {{ PILLARS[1].label }}
                  </div>
                </div>
              </div>

              <div class="mb-4 text-xs font-mono uppercase tracking-[0.2em] text-gold-400">
                {{ PILLARS[1].subtitle }}
              </div>

              <p class="text-sm text-ink-200 leading-relaxed mb-6">
                {{ PILLARS[1].desc }}
              </p>

              <div class="mb-6 space-y-2">
                <div
                  v-for="tag in PILLARS[1].tags"
                  :key="tag"
                  class="inline-flex items-center gap-2 rounded-md border border-ink-700/40 bg-ink-950/60 px-3 py-1.5 mr-2 mb-2"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-gold-500/60" />
                  <span class="text-xs text-ink-200">{{ tag }}</span>
                </div>
              </div>

              <div class="border-t border-ink-700/40 pt-4">
                <p class="text-xs font-mono text-gold-400/80">
                  {{ PILLARS[1].tagline }}
                </p>
              </div>
            </article>

            <!-- 组织 -->
            <article class="group relative rounded-2xl border border-ink-700/60 bg-gradient-to-br from-ink-800 to-ink-950 p-8 transition-all duration-500 hover:border-gold-500/50 hover:shadow-2xl hover:shadow-gold-500/5">
              <div class="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-gold-500/0 to-gold-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />

              <div class="mb-6 flex items-center gap-4">
                <div class="flex h-14 w-14 items-center justify-center rounded-xl border border-gold-500/30 bg-ink-900">
                  <svg class="h-7 w-7 text-gold-400" viewBox="0 0 24 24" fill="none">
                    <path :d="PILLARS[2].iconPath" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div>
                  <div class="font-mono text-[10px] uppercase tracking-[0.3em] text-gold-400/70">
                    {{ PILLARS[2].en }}
                  </div>
                  <div class="mt-1 text-2xl font-display font-medium text-ink-50">
                    {{ PILLARS[2].label }}
                  </div>
                </div>
              </div>

              <div class="mb-4 text-xs font-mono uppercase tracking-[0.2em] text-gold-400">
                {{ PILLARS[2].subtitle }}
              </div>

              <p class="text-sm text-ink-200 leading-relaxed mb-6">
                {{ PILLARS[2].desc }}
              </p>

              <div class="mb-6 space-y-2">
                <div
                  v-for="tag in PILLARS[2].tags"
                  :key="tag"
                  class="inline-flex items-center gap-2 rounded-md border border-ink-700/40 bg-ink-950/60 px-3 py-1.5 mr-2 mb-2"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-gold-500/60" />
                  <span class="text-xs text-ink-200">{{ tag }}</span>
                </div>
              </div>

              <div class="border-t border-ink-700/40 pt-4">
                <p class="text-xs font-mono text-gold-400/80">
                  {{ PILLARS[2].tagline }}
                </p>
              </div>
            </article>

          </div>
        </div>
      </div>

      <!-- ========== 核心主张 + 乘法公式 ========== -->
      <div
        :ref="(el) => observe(el as HTMLElement)"
        class="reveal mx-auto max-w-2xl text-center"
        style="transition-delay: 0.4s"
      >
        <div class="rounded-2xl border border-gold-500/20 bg-gold-500/5 p-8">
          <div class="mb-4 text-xs font-mono uppercase tracking-[0.3em] text-gold-400/70">
            METHODOLOGY
          </div>
          <p class="text-xl lg:text-2xl font-display font-light text-ink-50 leading-relaxed">
            培训改变能力 ·
            <span class="text-gold-400">项目改变工作</span> ·
            咨询改变组织
          </p>
        </div>
      </div>

    </div>
  </section>
</template>
