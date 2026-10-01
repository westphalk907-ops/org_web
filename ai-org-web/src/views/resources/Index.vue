<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api, type Resource } from '@/api/server'
import { downloadResource, downloadCta } from '@/utils/download'
import SubPageHero from '@/components/layout/SubPageHero.vue'

const route = useRoute()

// 频道页类型筛选（含 PROMPT + SKILL + WORKFLOW）
type FilterType = 'all' | 'insight' | 'prompt' | 'skill' | 'workflow' | 'playbook' | 'whitepaper' | 'framework' | 'checklist'

// 从 URL ?type=xxx 读取初始筛选（用于 Learn 子页面跳转）
const filter = ref<FilterType>(((route.query.type as FilterType) || 'all'))

// 监听 URL 变化（Learn 子页面切换）
watch(() => route.query.type, (t) => {
  filter.value = (t as FilterType) || 'all'
})

const FILTER_TABS: { v: FilterType; zh: string; en: string }[] = [
  { v: 'all',        zh: '全部',      en: 'ALL' },
  { v: 'insight',    zh: '洞察',      en: 'INSIGHT' },
  { v: 'prompt',     zh: '提示词',    en: 'PROMPT' },
  { v: 'skill',      zh: '技能',      en: 'SKILL' },
  { v: 'workflow',   zh: '工作流',    en: 'WORKFLOW' },
  { v: 'playbook',   zh: '行动手册',  en: 'PLAYBOOK' },
  { v: 'whitepaper', zh: '白皮书',    en: 'WHITEPAPER' },
  { v: 'framework',  zh: '框架',      en: 'FRAMEWORK' },
  { v: 'checklist',  zh: '清单',      en: 'CHECKLIST' }
]

// === 从后端加载资源 ===
const allResources = ref<Resource[]>([])
const loading = ref(false)
const loadError = ref('')

async function load() {
  loading.value = true
  loadError.value = ''
  try {
    allResources.value = await api.listResources({ limit: 200 })
  } catch (e: any) {
    loadError.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)

// 监听筛选 tab 切换，重新加载（如果是从外部 tab 进入）
watch(filter, () => { /* 仅本地筛选，无需重载 */ })

const filtered = computed(() => {
  if (filter.value === 'all') return allResources.value
  return allResources.value.filter((r) => r.type === filter.value)
})

const downloadingId = ref<string | null>('')
const errorId = ref<string>('')
const errorMsg = ref<string>('')

async function handleDownload(id: string) {
  const item = allResources.value.find((r) => r.id === id)
  if (!item) return
  downloadingId.value = id
  errorId.value = ''
  try {
    await downloadResource({
      ...item,
      downloadUrl: item.fileUrl,
    } as any)
  } catch (e) {
    errorId.value = id
    errorMsg.value = e instanceof Error ? e.message : '下载失败'
  } finally {
    downloadingId.value = null
  }
}

const TYPE_LABEL: Record<string, { zh: string; en: string }> = {
  insight: { zh: '洞察', en: 'INSIGHT' },
  research: { zh: '研究', en: 'RESEARCH' },
  framework: { zh: '框架', en: 'FRAMEWORK' },
  playbook: { zh: 'Playbook', en: 'PLAYBOOK' },
  checklist: { zh: '清单', en: 'CHECKLIST' },
  whitepaper: { zh: '白皮书', en: 'WHITEPAPER' },
  prompt: { zh: '提示词', en: 'PROMPT' },
  skill: { zh: '技能', en: 'SKILL' },
  workflow: { zh: '工作流', en: 'WORKFLOW' },
  case: { zh: '案例', en: 'CASE' },
  tool: { zh: '工具', en: 'TOOL' }
}
</script>

<template>
  <div>
    <!-- Hero -->
    <SubPageHero
      eyebrow="Resources · 工作资产库"
      subtitle="从知识，到能力；从 Skill，到 Workflow。"
    >
      <template #title>
        <span class="block text-display-md">AI 工作资产库</span>
        <span class="mt-2 block text-sm font-mono uppercase tracking-[0.35em] text-gradient-gold">
          AI WORK LIBRARY
        </span>
      </template>
    </SubPageHero>

    <!-- 列表 -->
    <section class="py-30">
      <div class="container-wide">
        <!-- 类目筛选 -->
        <div class="mb-8 flex flex-wrap gap-2">
          <button
            v-for="t in FILTER_TABS"
            :key="t.v"
            type="button"
            class="rounded-full border px-4 py-1.5 transition-all sm:px-5 sm:py-2"
            :class="
              filter === t.v
                ? 'border-gold-500 bg-gold-500/10'
                : 'border-ink-700 bg-ink-900 hover:border-gold-700/40'
            "
            @click="filter = t.v"
          >
            <span
              class="text-base font-medium sm:text-lg"
              :class="filter === t.v ? 'text-gold-200' : 'text-ink-50'"
            >{{ t.zh }}</span>
            <span
              class="ml-2 text-[10px] font-mono uppercase tracking-[0.25em] sm:text-xs"
              :class="filter === t.v ? 'text-gold-400' : 'text-ink-200'"
            >{{ t.en }}</span>
          </button>
        </div>

        <!-- 加载/错误/列表 -->
        <div v-if="loading" class="py-20 text-center text-sm text-ink-200">加载中…</div>
        <div v-else-if="loadError" class="py-20 text-center text-sm text-red-400">⚠ {{ loadError }}</div>
        <div v-else-if="filtered.length === 0" class="py-20 text-center text-sm text-ink-200">暂无该类目资产</div>
        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(r, i) in filtered"
            :key="r.id"
            class="card-base group p-6"
            :style="{ animationDelay: `${i * 60}ms` }"
          >
            <!-- 类目角标 -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center rounded-md border border-gold-500/40 bg-gold-500/10 px-2.5 py-0.5 text-xs font-medium text-gold-200">
                  {{ TYPE_LABEL[r.type]?.zh || r.type }}
                </span>
                <span class="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-400">
                  {{ TYPE_LABEL[r.type]?.en || r.type.toUpperCase() }}
                </span>
              </div>
              <span class="text-xs font-mono text-ink-200">{{ r.fileSize || `${r.pages ?? 0} 页` }}</span>
            </div>

            <!-- 标题：中文大字 + 英文小字 -->
            <RouterLink
              :to="`/resources/${r.slug}`"
              class="mt-6 block leading-snug"
            >
              <span class="block text-lg font-medium text-ink-50 group-hover:text-gold-300 transition-colors min-h-14">
                {{ r.title }}
              </span>
              <span v-if="r.subtitle" class="mt-1 block text-[11px] font-mono uppercase tracking-[0.25em] text-ink-200">
                {{ r.subtitle }}
              </span>
            </RouterLink>

            <!-- 摘要 -->
            <p class="mt-3 text-sm text-ink-200 leading-relaxed line-clamp-3">
              {{ r.summary }}
            </p>

            <!-- 操作行：详情 + 下载 -->
            <div class="mt-6 flex items-center justify-between border-t border-ink-800 pt-4">
              <RouterLink
                :to="`/resources/${r.slug}`"
                class="text-xs text-ink-200 hover:text-gold-300 transition-colors"
              >
                查看详情 →
              </RouterLink>
              <button
                type="button"
                class="text-sm text-gold-400 transition-all hover:text-gold-200 disabled:opacity-50"
                :disabled="downloadingId === r.id"
                @click="handleDownload(r.id)"
              >
                <span v-if="downloadingId === r.id">下载中…</span>
                <span v-else>{{ downloadCta(r) }}</span>
              </button>
            </div>

            <!-- 错误提示 -->
            <div v-if="errorId === r.id" class="mt-2 text-xs text-red-400">
              {{ errorMsg }}
            </div>
          </article>
        </div>

        <!-- 空态 -->
        <div v-if="filtered.length === 0" class="py-20 text-center text-sm text-ink-200">
          暂无该类目资产
        </div>
      </div>
    </section>
  </div>
</template>
