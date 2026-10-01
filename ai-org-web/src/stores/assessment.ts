import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AssessmentQuestion, AssessmentResult, AssessmentStage } from '@/types/content'

/**
 * Assessment 测评状态
 */
export const useAssessmentStore = defineStore('assessment', () => {
  const questions = ref<AssessmentQuestion[]>([])
  const currentIndex = ref(0)
  const answers = ref<Record<string, number>>({})
  const result = ref<AssessmentResult | null>(null)
  const isSubmitting = ref(false)

  const currentQuestion = computed(() => questions.value[currentIndex.value])
  const progress = computed(() =>
    questions.value.length === 0 ? 0 : (currentIndex.value / questions.value.length) * 100
  )
  const isComplete = computed(() => currentIndex.value >= questions.value.length)
  const totalScore = computed(() =>
    Object.values(answers.value).reduce((sum, v) => sum + v, 0)
  )

  /** 当前题已选分数（用于返工时还原 UI 高亮） */
  const currentSelectedScore = computed(() => {
    const q = currentQuestion.value
    return q ? (answers.value[q.id] ?? null) : null
  })

  function setQuestions(q: AssessmentQuestion[]) {
    questions.value = q
    currentIndex.value = 0
    answers.value = {}
    result.value = null
  }

  function answer(questionId: string, score: number) {
    answers.value[questionId] = score
  }

  function next() {
    if (currentIndex.value < questions.value.length) {
      currentIndex.value++
    }
  }

  function previous() {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }

  function setResult(r: AssessmentResult) {
    result.value = r
  }

  function reset() {
    currentIndex.value = 0
    answers.value = {}
    result.value = null
  }

  return {
    questions,
    currentIndex,
    answers,
    result,
    isSubmitting,
    currentQuestion,
    progress,
    isComplete,
    totalScore,
    currentSelectedScore,
    setQuestions,
    answer,
    next,
    previous,
    setResult,
    reset
  }
})

/**
 * 阶段映射工具
 */
export const ASSESSMENT_STAGES: AssessmentStage[] = [
  {
    code: 'L1',
    name: '认知期',
    min: 0,
    max: 30,
    description: '企业刚开始意识到 AI 的潜力，尚未系统化投入。',
    characteristics: ['少量个人尝试', '没有战略规划', '零散工具使用'],
    nextStep: '从 AI 组织成熟度报告与趋势洞察开始，建立基础认知。'
  },
  {
    code: 'L2',
    name: '探索期',
    min: 31,
    max: 50,
    description: '局部团队开始 AI 工具试点，尚未形成组织共识。',
    characteristics: ['部门级尝试', '缺乏统一规划', '价值不明确'],
    nextStep: '推荐 AI Academy 培训与 AI 个体地图，推动个体能力沉淀。'
  },
  {
    code: 'L3',
    name: '构建期',
    min: 51,
    max: 70,
    description: '已建立专项团队和试点项目，开始关注工作流与场景。',
    characteristics: ['专项团队', '场景化试点', '部分工作流改造'],
    nextStep: '推荐 AI Work Lab，识别高价值场景并设计 AI 工作流。'
  },
  {
    code: 'L4',
    name: '规模化期',
    min: 71,
    max: 85,
    description: 'AI 在多个业务线规模化，需要组织机制保障。',
    characteristics: ['多业务线铺开', '需要组织治理', '开始关注 ROI'],
    nextStep: '推荐组织变革咨询，建立 AI 组织的治理与流程机制。'
  },
  {
    code: 'L5',
    name: 'AI 组织期',
    min: 86,
    max: 100,
    description: 'AI 已深度融入组织运作，人机协作成为核心生产力。',
    characteristics: ['AI 嵌入业务流程', '数据驱动决策', '组织持续进化'],
    nextStep: '进入下一阶段：行业基准对标与生态合作。'
  }
]
