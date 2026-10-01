<script setup lang="ts">
import { ref } from 'vue'
import { useReveal } from '@/composables/useScroll'
const { observe } = useReveal()

// 核心方法论三阶 —— 链接到对应的体验页路由
const STAGES = [
  {
    code: '01',
    label: 'AI 个人',
    href: '/experience/individual-map',
    title: '个人阶段',
    desc: '员工掌握 AI 工具，提升个人产出',
    sub: 'AI Literacy · 个人效率 · 场景化'
  },
  {
    code: '02',
    label: 'AI 场景',
    href: '/experience',
    title: '场景阶段',
    desc: '把 AI 嵌入销售 / 市场 / HR 等具体业务场景',
    sub: '12+ 实战场景 · 可复用 Prompt'
  },
  {
    code: '03',
    label: 'AI 组织',
    href: '/experience/organization-map',
    title: '组织阶段',
    desc: '人与 AI 共生的新型组织形态',
    sub: '治理框架 · 决策智能 · 组织韧性'
  }
]

// 当前 hover 的 stage（用于 SVG 高亮联动）
const hoveredStage = ref<number | null>(null)

function setHovered(i: number | null) {
  hoveredStage.value = i
}
</script>

<template>
  <section id="home" class="relative overflow-hidden bg-ink-950 pt-32 pb-16">
    <!-- 背景装饰 -->
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 h-[480px] w-[680px] rounded-full bg-gold-500/7 blur-[140px]" />
    </div>
    <div class="pointer-events-none absolute inset-0 bg-grid bg-grid-lg opacity-20" />

    <div class="container-wide relative">
      <div class="grid items-start gap-12 lg:gap-14 lg:grid-cols-12">

        <!-- ============ 左：文案 ============ -->
        <div class="lg:col-span-6 lg:pt-4">
          <!-- 徽章 -->
          <div
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal mb-6 inline-flex items-center gap-2"
          >
            <span class="h-px w-8 bg-gold-500" />
            <span class="text-[11px] font-mono uppercase tracking-[0.25em] text-gold-400">
              道可乾元 Do Core · 企业 AI 组织进化伙伴
            </span>
          </div>

          <!-- 标题：两行，窄宽 -->
          <h1
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal max-w-sm text-display-md lg:text-display-lg font-display font-light leading-[1.2] text-balance"
            style="transition-delay: 0.1s"
          >
            <span class="block text-ink-50">AI 正在改变企业的</span>
            <span class="block text-ink-50">工作方式。</span>
            <span class="block mt-1">
              <span class="text-gradient-gold font-medium">你的组织准备好了吗？</span>
            </span>
          </h1>

          <!-- 副标：重新设计 -->
          <p
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal mt-6 max-w-xs text-sm lg:text-base text-ink-200 leading-relaxed"
            style="transition-delay: 0.2s"
          >
            从 AI 个体能力，到 AI 组织进化——<br>
            道可乾元帮助企业<span class="text-ink-50">重新设计</span><span class="text-gold-300">人与 AI 协作</span>的工作方式。
          </p>

          <!-- 双 CTA -->
          <div
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal mt-8 flex flex-wrap items-center gap-3"
            style="transition-delay: 0.3s"
          >
            <BaseButton to="/experience" variant="primary" size="lg">
              查看 AI 场景库
              <span class="ml-1">→</span>
            </BaseButton>
            <BaseButton to="/learn" variant="secondary" size="lg">
              开始系统学习
            </BaseButton>
          </div>

          <!-- 三阶路径指示器（缩小） -->
          <div
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal mt-10 flex items-center gap-x-4"
            style="transition-delay: 0.4s"
          >
            <div
              v-for="(s, i) in STAGES"
              :key="s.code"
              class="flex items-center gap-1.5"
            >
              <span class="text-[10px] font-mono text-gold-500">{{ s.code }}</span>
              <span class="text-xs font-medium text-ink-100">{{ s.label }}</span>
              <span
                v-if="i < STAGES.length - 1"
                class="h-px w-4 bg-gradient-to-r from-gold-500/50 to-transparent"
              />
            </div>
          </div>
        </div>

        <!-- ============ 右：AI Organization Map（可交互） ============ -->
        <div class="lg:col-span-6">
          <div
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal relative"
            style="transition-delay: 0.2s"
          >
            <div
              class="relative overflow-hidden rounded-2xl border border-gold-700/30 bg-gradient-to-br from-ink-900 to-ink-950 p-7 lg:p-8"
              :class="hoveredStage !== null ? 'border-gold-500/50' : ''"
              style="transition: border-color 0.25s ease"
            >
              <!-- 细网格 -->
              <div class="pointer-events-none absolute inset-0 bg-grid bg-grid-lg opacity-30" />

              <div class="relative">
                <!-- 顶部方法论标签 -->
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-400">METHODOLOGY · 三阶进化模型</span>
                  <span class="text-[10px] font-mono tracking-[0.2em] text-ink-200">2025 · v1</span>
                </div>

                <!-- 三阶段方法论主体（放大） -->
                <div class="relative mt-5 space-y-3">
                  <RouterLink
                    v-for="(s, i) in STAGES"
                    :key="s.code"
                    :to="s.href"
                    class="group relative flex items-start gap-4 rounded-xl border border-ink-700/50 bg-ink-950/60 p-5 transition-all duration-300 hover:border-gold-500/60 hover:bg-ink-800/40 cursor-pointer block"
                    @mouseenter="setHovered(i)"
                    @mouseleave="setHovered(null)"
                  >
                    <span class="font-display text-2xl lg:text-3xl font-light text-gold-500 mt-0.5 shrink-0 leading-none">
                      {{ s.code }}
                    </span>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-sm font-mono uppercase tracking-[0.2em] text-gold-400 font-semibold">
                          {{ s.label }}
                        </span>
                        <span class="text-[10px] text-ink-200">·</span>
                        <span class="text-sm font-medium text-ink-100">{{ s.title }}</span>
                        <span class="ml-auto opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <svg class="h-4 w-4 text-gold-400" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </span>
                      </div>
                      <div class="mt-2 text-xs leading-relaxed text-ink-200">
                        {{ s.sub }}
                      </div>
                    </div>
                  </RouterLink>
                </div>
              </div>
            </div>

            <!-- 卡片光晕 -->
            <div class="pointer-events-none absolute -inset-4 -z-10 rounded-2xl bg-gold-500/4 blur-2xl" />
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
