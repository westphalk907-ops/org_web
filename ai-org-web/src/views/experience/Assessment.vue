<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAssessmentStore, ASSESSMENT_STAGES as STAGES } from '@/stores/assessment'
import type { AssessmentResult } from '@/types/content'
import { DIMENSION_LABEL, type AssessmentQuestion } from '@/api/server'
import { useExperience } from '@/composables/useExperience'
import {
  trackAssessmentStarted,
  trackAssessmentCompleted,
  trackReportDownloaded,
  trackExpertConsultClicked
} from '@/services/assessmentTracker'

const store = useAssessmentStore()

const questions = ref<AssessmentQuestion[]>([])
const loading = ref(true)
const loadError = ref('')

async function load() {
  loading.value = true
  try {
    const data = await useExperience().loadAssessmentQuestions()
    questions.value = data as any
    store.setQuestions(questions.value as any)
  } catch (e: any) {
    loadError.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)

const currentQuestion = computed(() => store.currentQuestion)
const progress = computed(() => store.progress)
const isComplete = computed(() => store.isComplete)
const totalScore = computed(() => store.totalScore)

const selectedScore = ref<number | null>(null)
const showResult = ref(false)

/**
 * 同步 store 里"当前题已选答案"到 selectedScore
 * 用于：上一题返工 / 答完下一题再回看时还原 UI 高亮
 */
function syncSelectedFromStore() {
  const q = store.currentQuestion
  selectedScore.value = q ? (store.answers[q.id] ?? null) : null
}

watch(
  () => store.currentIndex,
  () => syncSelectedFromStore(),
  { immediate: true }
)

function selectOption(score: number) {
  selectedScore.value = score
}

function next() {
  if (!currentQuestion.value || selectedScore.value === null) return
  store.answer(currentQuestion.value.id, selectedScore.value)
  selectedScore.value = null
  store.next()
}

function previous() {
  selectedScore.value = null
  store.previous()
}

const result = computed<AssessmentResult>(() => {
  const score = totalScore.value
  const maxScore = questions.value.length * 6
  const percent = Math.round((score / maxScore) * 100)
  const stage = STAGES.find((s) => percent >= s.min && percent <= s.max) || STAGES[0]

  // 计算维度分数
  const dimScores: Record<string, number> = {}
  const dimCounts: Record<string, number> = {}
  questions.value.forEach((q) => {
    const ans = store.answers[q.id]
    if (ans === undefined) return
    dimScores[q.dimension] = (dimScores[q.dimension] || 0) + ans
    dimCounts[q.dimension] = (dimCounts[q.dimension] || 0) + 1
  })

  const dimAverages = Object.keys(dimScores).map((dim) => ({
    dimension: dim,
    score: Math.round((dimScores[dim] / dimCounts[dim]) * 10) / 10,
    suggestion: ''
  })).sort((a, b) => a.score - b.score)

  const topGaps = dimAverages.slice(0, 3).map((g) => ({
    dimension: g.dimension,
    score: g.score,
    suggestion: getSuggestion(g.dimension)
  }))

  return {
    stage,
    dimensionScores: dimScores,
    topGaps,
    totalScore: percent,
    nextStep: stage.nextStep
  }
})

function getSuggestion(dim: string): string {
  const map: Record<string, string> = {
    strategy: '建议参加高层 AI 战略工作坊，明确 AI 投入与目标',
    people: '启动 AI Academy 培训，提升全员 AI 能力',
    workflow: '使用 Workflow Demo 识别高价值场景，优先改造',
    technology: '建立 AI 工具评估与采购规范',
    data: '启动数据资产盘点与数据中台规划',
    governance: '建立 AI 使用规范与治理委员会',
    organization: '成立 AI 牵头部门，明确组织变革路径'
  }
  return map[dim] || '建议系统化梳理相关能力'
}

function submit() {
  // 埋点：测评完成
  trackAssessmentCompleted({
    stage: result.value.stage.code,
    totalScore: result.value.totalScore,
    topGaps: result.value.topGaps.map((g) => g.dimension),
    answersCount: questions.value.length
  })
  showResult.value = true
}

function onReportDownload() {
  // 埋点：下载报告
  trackReportDownloaded({
    stage: result.value.stage.code,
    totalScore: result.value.totalScore,
    topGaps: result.value.topGaps.map((g) => g.dimension)
  })
}

function onExpertConsult() {
  // 埋点：预约专家解读
  trackExpertConsultClicked({
    stage: result.value.stage.code,
    totalScore: result.value.totalScore
  })
}

onMounted(() => {
  // 埋点：进入测评（仅在还没历史会话时打点，避免刷新重复触发）
  // 通过 store reset 不影响；这里以 sessionStorage 的 started 标记控制幂等
  if (typeof window !== 'undefined' && !sessionStorage.getItem('assessment_started')) {
    sessionStorage.setItem('assessment_started', '1')
    trackAssessmentStarted(questions.value.length)
  }
})

function reset() {
  showResult.value = false
  selectedScore.value = null
  store.reset()
  // 允许下一次"开始测评"再次打 started 埋点
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('assessment_started')
  }
}
</script>

<template>
  <section class="relative overflow-hidden bg-ink-950 pt-20 pb-30">
    <div class="pointer-events-none absolute inset-0 bg-grid bg-grid-lg opacity-20" />

    <div class="container-wide relative">
      <!-- 加载/错误 -->
      <div v-if="loading" class="py-20 text-center text-sm text-ink-200">加载中…</div>
      <div v-else-if="loadError" class="py-20 text-center text-sm text-red-400">⚠ {{ loadError }}</div>

      <template v-else>
      <!-- Header -->
      <div class="max-w-3xl mx-auto text-center mb-12">
        <div class="section-eyebrow justify-center inline-flex">
          <span class="inline-block h-px w-8 bg-gold-500" />
          AI Organization Assessment
          <span class="inline-block h-px w-8 bg-gold-500" />
        </div>
        <h1 class="mt-4 text-display-md font-display font-medium text-balance">
          3 分钟测评你的<br />
          <span class="text-gradient-gold">企业 AI 成熟度</span>
        </h1>
        <p class="mt-4 text-base text-ink-200">15 道题 · 7 大维度 · 输出你的阶段、Top 3 短板和下一步</p>
      </div>

      <!-- 测评 -->
      <div v-if="!showResult && currentQuestion" class="max-w-2xl mx-auto">
        <!-- 进度条 -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-2 text-xs font-mono text-ink-200">
            <span>问题 {{ store.currentIndex + 1 }} / {{ store.questions.length }}</span>
            <span>{{ Math.round(progress) }}%</span>
          </div>
          <div class="h-1 overflow-hidden rounded-full bg-ink-800">
            <div class="h-full bg-gold-500 transition-all duration-500" :style="{ width: `${progress}%` }" />
          </div>
        </div>

        <!-- 题目 -->
        <div class="rounded-2xl border border-ink-700 bg-ink-900 p-8 lg:p-10">
          <div class="text-xs font-mono text-gold-400 tracking-wider">
            Dimension · {{ DIMENSION_LABEL[currentQuestion.dimension as keyof typeof DIMENSION_LABEL] || currentQuestion.dimension }}
          </div>
          <h2 class="mt-4 text-2xl font-display font-medium text-ink-50 text-balance">
            {{ currentQuestion.text }}
          </h2>

          <!-- 选项 -->
          <div class="mt-8 space-y-3">
            <button
              v-for="opt in currentQuestion.options"
              :key="opt.score"
              type="button"
              class="group relative flex w-full items-center justify-between gap-4 rounded-lg border p-4 pl-12 text-left transition-all duration-200"
              :class="selectedScore === opt.score
                ? 'border-gold-500 bg-gold-500/15 shadow-[0_0_0_1px_rgba(212,175,55,0.35)] scale-[1.01]'
                : 'border-ink-700 bg-ink-950 hover:border-gold-700/50 hover:bg-ink-900'"
              @click="selectOption(opt.score)"
            >
              <!-- 选中 ✓ 标记 -->
              <span
                class="absolute left-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border transition-all"
                :class="selectedScore === opt.score
                  ? 'border-gold-500 bg-gold-500 text-ink-950'
                  : 'border-ink-700 bg-transparent text-transparent group-hover:border-gold-700/60'"
              >
                <svg viewBox="0 0 12 12" class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2.5 6.2 L5 8.6 L9.5 3.6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>

              <span
                class="transition-colors"
                :class="selectedScore === opt.score ? 'text-gold-200 font-medium' : 'text-ink-50 group-hover:text-gold-300'"
              >
                {{ opt.label }}
              </span>
              <span
                class="font-mono text-xs transition-colors"
                :class="selectedScore === opt.score ? 'text-gold-300' : 'text-ink-200'"
              >
                +{{ opt.score }}
              </span>
            </button>
          </div>
        </div>

        <!-- 操作 -->
        <div class="mt-6 flex items-center justify-between">
          <button
            type="button"
            class="btn-ghost"
            :disabled="store.currentIndex === 0"
            @click="previous"
          >
            ← 上一题
          </button>

          <BaseButton
            v-if="!isComplete"
            variant="primary"
            :disabled="selectedScore === null"
            @click="next"
          >
            下一题 →
          </BaseButton>
          <BaseButton
            v-else
            variant="primary"
            @click="submit"
          >
            查看测评结果
          </BaseButton>
        </div>
      </div>

      <!-- 结果 -->
      <div v-else class="max-w-3xl mx-auto">
        <div class="rounded-2xl border border-gold-700/30 bg-gradient-to-br from-ink-900 to-ink-950 p-8 lg:p-12">
          <!-- 阶段 -->
          <div class="text-center">
            <div class="text-xs font-mono text-gold-400 uppercase tracking-[0.2em]">Your Stage</div>
            <div class="mt-4 font-mono text-7xl font-medium text-gradient-gold">
              {{ result.stage.code }}
            </div>
            <div class="mt-4 text-3xl font-display font-medium text-ink-50">
              {{ result.stage.name }}
            </div>
            <div class="mt-4 max-w-md mx-auto text-base text-ink-200">
              {{ result.stage.description }}
            </div>
            <div class="mt-6 inline-flex items-center gap-3 rounded-full border border-gold-700/30 bg-gold-500/5 px-5 py-2">
              <span class="text-xs text-ink-200">综合得分</span>
              <span class="text-2xl font-display font-medium text-gradient-gold">{{ result.totalScore }}</span>
              <span class="text-xs text-ink-200">/ 100</span>
            </div>
          </div>

          <!-- Top 3 Gaps -->
          <div class="mt-12">
            <div class="section-eyebrow">Top 3 Gaps · 主要短板</div>
            <div class="mt-4 space-y-3">
              <div
                v-for="(gap, i) in result.topGaps"
                :key="gap.dimension"
                class="flex items-start gap-4 rounded-lg border border-ink-700 bg-ink-950 p-5"
              >
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-700/30 bg-gold-500/10 font-mono text-sm text-gold-400">
                  0{{ i + 1 }}
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-ink-50">
                    {{ DIMENSION_LABEL[gap.dimension as keyof typeof DIMENSION_LABEL] || gap.dimension }}
                  </div>
                  <div class="mt-1 text-sm text-ink-200">{{ gap.suggestion }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Next Step -->
          <div class="mt-12 rounded-lg border border-gold-700/30 bg-gold-500/5 p-6">
            <div class="section-eyebrow text-gold-400">Next Step · 下一步</div>
            <p class="mt-3 text-base text-ink-50">{{ result.nextStep }}</p>
          </div>

          <!-- 行动按钮 -->
          <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
            <BaseButton to="/contact" variant="primary" @click="onExpertConsult">预约专家解读</BaseButton>
            <BaseButton
              to="/resources/ai-organization-maturity-report-2026"
              variant="secondary"
              @click="onReportDownload"
            >
              下载完整报告
            </BaseButton>
            <button class="btn-ghost" @click="reset">重新测评</button>
          </div>
        </div>
      </div>
      </template>
    </div>
  </section>
</template>
