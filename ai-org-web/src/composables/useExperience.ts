import { computed, ref } from 'vue'
import type { ExperienceMap } from '@/api/server'
import { api } from '@/api/server'
import { USE_BACKEND } from '@/data/flags'
import { ORGANIZATION_MAP } from '@/data/maps'
import { WORKFLOW_SCENARIOS } from '@/data/workflows'
import { ASSESSMENT_QUESTIONS } from '@/data/assessment-questions'

/**
 * 地图类型枚举（与后端 ExperienceKind 保持一致）
 */
export type MapType = 'INDIVIDUAL' | 'ORGANIZATION' | 'WORKFLOW'

/**
 * 本地 mock：三个地图，形状与后端 ExperienceMap 完全一致
 * - kind 是唯一标识
 * - 描述用 subtitle / heroDesc
 * - id/slug/isActive/sortOrder 用占位值
 *
 * 注：WORKFLOW 没有对应的"五阶段"数据，临时复用 WORKFLOW_SCENARIOS，
 *     实际产品里应单独维护一份 workflow stages mock
 */
const LOCAL_MAPS: Record<MapType, ExperienceMap> = {
  INDIVIDUAL: {
    id: 'local-individual',
    kind: 'INDIVIDUAL',
    slug: 'individual',
    title: '个人 AI 能力进化路径',
    subtitle: '从工具使用者到 AI 协作者',
    heroDesc: '从工具使用者到 AI 协作者的五级成长路径',
    isActive: true,
    sortOrder: 1,
    stages: ORGANIZATION_MAP as unknown as ExperienceMap['stages']
  },
  ORGANIZATION: {
    id: 'local-organization',
    kind: 'ORGANIZATION',
    slug: 'organization',
    title: '企业 AI 组织进化路径',
    subtitle: '从 AI Adoption 到 AI Organization',
    heroDesc: '从认知期到原生 AI 组织的企业 AI 转型五阶段',
    isActive: true,
    sortOrder: 2,
    stages: ORGANIZATION_MAP as unknown as ExperienceMap['stages']
  },
  WORKFLOW: {
    id: 'local-workflow',
    kind: 'WORKFLOW',
    slug: 'workflow',
    title: '工作流 AI 化演进',
    subtitle: '看见 AI 改造流程的价值',
    heroDesc: '从单点工具到端到端智能工作流',
    isActive: true,
    sortOrder: 3,
    stages: WORKFLOW_SCENARIOS as unknown as ExperienceMap['stages']
  }
}

/**
 * 统一封装 experience 数据获取
 *
 * 根据 USE_BACKEND 开关决定走 mock 还是真实后端，
 * 调用方无需关心。后端失败时自动回退到 mock。
 */
export function useExperience() {
  const maps = ref<ExperienceMap[]>([])
  const currentMap = ref<ExperienceMap | null>(null)
  const stages = computed(() => currentMap.value?.stages ?? [])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadAll() {
    loading.value = true
    error.value = null
    try {
      if (USE_BACKEND) {
        maps.value = await api.listExperienceMaps()
      } else {
        maps.value = Object.values(LOCAL_MAPS)
      }
    } catch (e: any) {
      error.value = e?.message ?? '加载失败'
      maps.value = Object.values(LOCAL_MAPS) // 后端失败时回退 mock
    } finally {
      loading.value = false
    }
  }

  async function loadMap(type: MapType) {
    loading.value = true
    error.value = null
    try {
      if (USE_BACKEND) {
        currentMap.value = await api.getExperienceMap(type)
      } else {
        currentMap.value = LOCAL_MAPS[type] ?? null
      }
    } catch (e: any) {
      error.value = e?.message ?? '加载失败'
      currentMap.value = LOCAL_MAPS[type] ?? null
    } finally {
      loading.value = false
    }
  }

  async function loadAssessmentQuestions() {
    if (USE_BACKEND) {
      try {
        return await api.listAssessmentQuestions()
      } catch {
        // 回退到 mock，data 的 AssessmentQuestion 形状比后端少几个，
        // 通过 unknown 强转对齐接口
        return ASSESSMENT_QUESTIONS as unknown as Awaited<
          ReturnType<typeof api.listAssessmentQuestions>
        >
      }
    }
    return ASSESSMENT_QUESTIONS as unknown as Awaited<
      ReturnType<typeof api.listAssessmentQuestions>
    >
  }

  return {
    maps,
    currentMap,
    stages,
    loading,
    error,
    loadAll,
    loadMap,
    loadAssessmentQuestions
  }
}