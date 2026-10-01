<script setup lang="ts">
import { useReveal } from '@/composables/useScroll'
const { observe } = useReveal()

// 五级 AI 组织进化路径
const EVOLUTION_STAGES = [
  {
    num: '01',
    en: 'INDIVIDUAL',
    label: '个体能力',
    // 症状
    symptom: '员工开始使用 AI 工具',
    barrier: '每个人都在自己摸索，能力无法积累',
    tag: 'AI Literacy',
    color: 'from-ink-800 to-ink-900',
    borderColor: 'border-ink-700/50',
    hoverBorder: 'hover:border-gold-500/40',
    lineColor: 'bg-gold-500/30'
  },
  {
    num: '02',
    en: 'WORK',
    label: '工作方式',
    symptom: 'AI 已经被使用',
    barrier: '原来的工作方式没有改变',
    tag: 'AI Fluency',
    color: 'from-ink-800 to-ink-900',
    borderColor: 'border-ink-700/50',
    hoverBorder: 'hover:border-gold-500/40',
    lineColor: 'bg-gold-500/40'
  },
  {
    num: '03',
    en: 'WORKFLOW',
    label: '工作流',
    symptom: 'AI 已经进入某些场景',
    barrier: '流程没有真正重构',
    tag: 'AI Workflow',
    color: 'from-ink-800 to-ink-900',
    borderColor: 'border-ink-700/50',
    hoverBorder: 'hover:border-gold-500/50',
    lineColor: 'bg-gold-500/50'
  },
  {
    num: '04',
    en: 'TEAM',
    label: '团队协作',
    symptom: '少数人已经很会用 AI',
    barrier: '能力无法复制到团队',
    tag: 'AI Collaboration',
    color: 'from-ink-800 to-ink-900',
    borderColor: 'border-ink-700/50',
    hoverBorder: 'hover:border-gold-500/50',
    lineColor: 'bg-gold-500/60'
  },
  {
    num: '05',
    en: 'ORGANIZATION',
    label: '组织进化',
    symptom: 'AI 项目越来越多',
    barrier: '企业还没有形成自己的 AI 组织能力',
    tag: 'AI Native',
    color: 'from-ink-800 to-ink-900',
    borderColor: 'border-ink-700/50',
    hoverBorder: 'hover:border-gold-500/60',
    lineColor: 'bg-gold-500/70'
  }
]

</script>

<template>
  <section id="evolution" class="relative overflow-hidden bg-ink-950 pt-32 pb-20">
    <!-- 背景 -->
    <div class="pointer-events-none absolute inset-0 bg-grid bg-grid-lg opacity-15" />
    <div class="pointer-events-none absolute top-1/2 left-0 h-px w-full bg-gradient-to-r from-transparent via-gold-500/10 to-transparent" />

    <div class="container-wide relative">

      <!-- ========== 标题区 ========== -->
      <div class="mx-auto mb-20 max-w-3xl text-center">
        <div
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal mb-5 inline-flex items-center gap-2"
        >
          <span class="h-px w-8 bg-gold-500" />
          <span class="text-xs font-mono uppercase tracking-[0.3em] text-gold-400">
            AI ORGANIZATION EVOLUTION
          </span>
          <span class="h-px w-8 bg-gold-500" />
        </div>
        <h2
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal text-display-lg font-display font-light text-ink-50 leading-tight"
          style="transition-delay: 0.1s"
        >
          AI 进入企业，<br class="hidden lg:block" />
          真正难的不是<span class="text-gradient-gold font-medium">"会不会用"</span>
        </h2>
        <p
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal mx-auto mt-6 max-w-xl text-base text-ink-200 leading-relaxed"
          style="transition-delay: 0.2s"
        >
          从个人使用 AI，到让 AI 真正进入工作、团队与组织——<br>
          中间存在五个关键跃迁。你的企业，现在卡在哪一步？
        </p>
      </div>

      <!-- ========== 五级进化路径（横向） ========== -->
      <div
        :ref="(el) => observe(el as HTMLElement)"
        class="reveal overflow-x-auto pb-4"
        style="transition-delay: 0.3s"
      >
        <!-- 桌面：横向连接线 + 五节点 -->
        <div class="hidden lg:flex items-start min-w-[900px]">
          <!-- 连接线 -->
          <div class="absolute left-1/2 top-[420px] -translate-x-1/2 h-px w-[900px] pointer-events-none">
            <div class="absolute inset-0 flex items-center">
              <div class="h-px w-full bg-gradient-to-r from-gold-500/20 via-gold-500/60 to-gold-500/20" />
            </div>
          </div>

          <!-- 五阶段 -->
          <div class="relative grid grid-cols-5 gap-4 w-full">
            <div
              v-for="(stage, i) in EVOLUTION_STAGES"
              :key="stage.num"
              class="relative flex flex-col items-center text-center"
            >
              <!-- 节点圆 -->
              <div class="relative mb-6 z-10">
                <!-- 外圈 -->
                <div
                  class="absolute -inset-3 rounded-full border transition-all duration-500"
                  :class="stage.borderColor.replace('border-', 'border-')"
                  :style="{}"
                />
                <div
                  class="relative flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-500 group-hover:border-gold-400"
                  :class="stage.borderColor + ' ' + stage.hoverBorder + ' bg-ink-900'"
                >
                  <span class="font-mono text-sm font-bold" :class="i === 0 ? 'text-gold-400' : 'text-gold-500/70'">
                    {{ stage.num }}
                  </span>
                </div>
              </div>

              <!-- 阶段信息 -->
              <div class="mb-3">
                <div class="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-500/70 mb-1">
                  {{ stage.en }}
                </div>
                <div class="text-base font-medium text-ink-50">
                  {{ stage.label }}
                </div>
              </div>

              <!-- 症状 -->
              <div class="w-full rounded-xl border p-4 transition-all duration-300 text-left"
                :class="`${stage.borderColor} ${stage.hoverBorder} ${stage.color} bg-gradient-to-br`"
              >
                <div class="text-xs text-ink-200 leading-relaxed mb-2">
                  {{ stage.symptom }}
                </div>
                <div class="text-xs text-ink-300 leading-relaxed">
                  但 {{ stage.barrier }}
                </div>
                <div class="mt-3 inline-flex items-center gap-1.5">
                  <span class="h-px flex-1 rounded-full" :class="stage.lineColor" />
                  <span class="text-[10px] font-mono uppercase tracking-[0.15em] text-gold-400/80">
                    {{ stage.tag }}
                  </span>
                </div>
              </div>

              <!-- 底部连接箭头（除最后一个） -->
              <div
                v-if="i < EVOLUTION_STAGES.length - 1"
                class="absolute -right-8 top-[70px] z-20 flex items-center"
              >
                <svg class="h-4 w-4 text-gold-500/50" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- 移动端：纵向堆叠 -->
        <div class="flex flex-col gap-4 lg:hidden">
          <div
            v-for="(stage, i) in EVOLUTION_STAGES"
            :key="stage.num"
            class="flex items-center gap-4 rounded-xl border p-4 transition-all duration-300"
            :class="`${stage.borderColor} ${stage.hoverBorder} bg-gradient-to-br ${stage.color}`"
          >
            <span class="font-mono text-lg font-bold text-gold-500 shrink-0 w-8">{{ stage.num }}</span>
            <div class="flex-1">
              <div class="text-[10px] font-mono uppercase tracking-[0.15em] text-gold-400/70">{{ stage.en }}</div>
              <div class="text-sm font-medium text-ink-50 mt-0.5">{{ stage.label }}</div>
              <div class="text-xs text-ink-200 mt-1">{{ stage.symptom }}</div>
              <div class="text-xs text-ink-300 mt-0.5">但 {{ stage.barrier }}</div>
              <div class="mt-2 inline-flex items-center gap-1.5">
                <span class="h-px w-6 rounded-full" :class="stage.lineColor" />
                <span class="text-[10px] font-mono uppercase tracking-[0.15em] text-gold-400/80">{{ stage.tag }}</span>
              </div>
            </div>
            <svg v-if="i < EVOLUTION_STAGES.length - 1" class="h-4 w-4 text-gold-500/30 shrink-0 rotate-90" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
