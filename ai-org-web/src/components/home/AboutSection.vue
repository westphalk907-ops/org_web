<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useReveal } from '@/composables/useScroll'
import { api, type Resource } from '@/api/server'
import { downloadResource, downloadCta } from '@/utils/download'
const { observe } = useReveal()

// 类目（货架标签）— 中英文结合，中文为主
const TABS = [
  { v: 'all',       zh: '全部',      en: 'ALL' },
  { v: 'insight',   zh: '洞察',      en: 'INSIGHT' },
  { v: 'prompt',    zh: '提示词',    en: 'PROMPT' },
  { v: 'skill',     zh: '技能',      en: 'SKILL' },
  { v: 'workflow',  zh: '工作流',    en: 'WORKFLOW' },
  { v: 'playbook',  zh: '行动手册',  en: 'PLAYBOOK' }
] as const

type TabKey = typeof TABS[number]['v']

const active = ref<TabKey>('all')

// 当前类目的中英文短名（用于卡片角标）
const TAB_LABEL: Record<TabKey, { zh: string; en: string }> = {
  all:      { zh: '全部',      en: 'ALL' },
  insight:  { zh: '洞察',      en: 'INSIGHT' },
  prompt:   { zh: '提示词',    en: 'PROMPT' },
  skill:    { zh: '技能',      en: 'SKILL' },
  workflow: { zh: '工作流',    en: 'WORKFLOW' },
  playbook: { zh: '行动手册',  en: 'PLAYBOOK' }
}

// 从后端加载资源
const allResources = ref<Resource[]>([])
const loading = ref(true)
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

// 取当前类目的资产（从后端数据过滤）
const currentItems = computed(() => {
  if (active.value === 'all') {
    return [
      ...allResources.value.filter((r) => r.type === 'workflow' && r.tags?.includes('工作流')),
      ...allResources.value.filter((r) => r.type === 'insight').slice(0, 2),
      ...allResources.value.filter((r) => r.type === 'prompt').slice(0, 2),
      ...allResources.value.filter((r) => r.type === 'skill').slice(0, 2),
      ...allResources.value.filter((r) => r.type === 'playbook' || r.type === 'checklist').slice(0, 1)
    ]
  }
  return allResources.value.filter((r) => r.type === active.value)
})

// Hero 大卡：从后端数据找旗舰工作流
const HERO = computed<Resource | undefined>(() => {
  return allResources.value.find((r) => r.slug === 'ai-market-research-workflow')
})

const downloadingId = ref<string | null>(null)
const errorMsg = ref('')

async function handleDownload(id: string) {
  const item = allResources.value.find((r) => r.id === id)
  if (!item) return
  downloadingId.value = id
  errorMsg.value = ''
  try {
    await downloadResource({
      ...item,
      downloadUrl: item.fileUrl,
    } as any)
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : '下载失败'
  } finally {
    downloadingId.value = null
  }
}
</script>

<template>
  <section id="library" class="relative bg-ink-900 pt-16 pb-32">
    <div class="container-wide">
      <!-- 标题区：中文字体大、英文字体小 -->
      <div class="mx-auto mb-12 max-w-3xl text-center">
        <div class="mb-5 inline-flex items-center gap-2">
          <span class="h-px w-8 bg-gold-500" />
          <span class="text-xs font-mono uppercase tracking-[0.3em] text-gold-400">
            LIBRARY · 工作资产货架
          </span>
          <span class="h-px w-8 bg-gold-500" />
        </div>
        <h2 class="font-display font-light text-ink-50 leading-tight">
          <span class="block text-4xl sm:text-5xl">AI 工作资产库</span>
          <span class="mt-2 block text-sm sm:text-base font-mono uppercase tracking-[0.35em] text-gradient-gold">
            AI WORK LIBRARY
          </span>
        </h2>
        <p class="mx-auto mt-6 max-w-2xl text-base text-ink-200 leading-relaxed">
          从知识，到能力；从 <span class="text-gold-300">Skill</span>，到 <span class="text-gold-300">Workflow</span>。
        </p>
      </div>

      <!-- 类目 chips（货架标签条）— 可点击切换 -->
      <div class="mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <button
          v-for="t in TABS"
          :key="t.v"
          type="button"
          class="rounded-full border px-4 py-1.5 transition-all sm:px-5 sm:py-2"
          :class="
            active === t.v
              ? 'border-gold-500 bg-gold-500/10'
              : 'border-ink-700 bg-ink-950 hover:border-gold-700/40'
          "
          @click="active = t.v"
        >
          <span
            class="text-base font-medium sm:text-lg"
            :class="active === t.v ? 'text-gold-200' : 'text-ink-50'"
          >{{ t.zh }}</span>
          <span
            class="ml-2 text-[10px] font-mono uppercase tracking-[0.25em] sm:text-xs"
            :class="active === t.v ? 'text-gold-400' : 'text-ink-200'"
          >{{ t.en }}</span>
        </button>
      </div>

      <!-- Hero 大卡（仅 ALL 显示，且数据加载完成） -->
      <div v-if="active === 'all' && HERO" class="mb-6">
        <article :ref="(el) => observe(el as HTMLElement)" class="reveal">
          <div class="group relative block overflow-hidden rounded-2xl border border-ink-700/80 bg-gradient-to-br from-ink-800 to-ink-950 p-8 transition-all hover:border-gold-500/60 sm:p-10">
            <div class="absolute inset-0 bg-grid bg-grid-lg opacity-30" />
            <div class="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gold-500/10 blur-3xl" />

            <div class="relative grid grid-cols-1 gap-8 lg:grid-cols-5">
              <div class="lg:col-span-3">
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center gap-2 rounded-md border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-sm font-medium text-gold-200">
                    工作流
                  </span>
                  <span class="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-400">
                    WORKFLOW
                  </span>
                </div>

                <h3 class="mt-6 font-display font-medium text-ink-50 leading-snug">
                  <span class="block text-3xl sm:text-4xl">{{ HERO.title }}</span>
                  <span class="mt-2 block text-sm font-mono uppercase tracking-[0.25em] text-ink-200">
                    {{ HERO.subtitle }}
                  </span>
                </h3>

                <p class="mt-5 max-w-xl text-base text-ink-200 leading-relaxed">
                  {{ HERO.summary }}
                </p>

                <div class="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full border border-gold-500 bg-gold-500/10 px-5 py-2.5 text-sm font-medium text-gold-200 transition-all hover:bg-gold-500/20 disabled:opacity-50"
                    :disabled="downloadingId === HERO.id"
                    @click="handleDownload(HERO.id)"
                  >
                    <span>{{ downloadingId === HERO.id ? '下载中…' : downloadCta(HERO as any) }}</span>
                  </button>
                  <RouterLink
                    :to="`/resources/${HERO.slug}`"
                    class="inline-flex items-center gap-2 text-sm text-ink-200 transition-colors hover:text-gold-300"
                  >
                    <span>查看详情</span>
                    <span>→</span>
                  </RouterLink>
                </div>

                <div v-if="errorMsg" class="mt-3 text-xs text-red-400">{{ errorMsg }}</div>
              </div>

              <div class="lg:col-span-2 lg:border-l lg:border-ink-700/60 lg:pl-8">
                <div class="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-200">
                  INCLUDED · 资产构成
                </div>
                <ul class="mt-4 space-y-3 text-sm text-ink-100">
                  <li class="flex items-center gap-3">
                    <span class="h-1.5 w-1.5 rounded-full bg-gold-500" />
                    <span>市场信息收集 <span class="text-ink-200 text-xs">/ Information Scan</span></span>
                  </li>
                  <li class="flex items-center gap-3">
                    <span class="h-1.5 w-1.5 rounded-full bg-gold-500" />
                    <span>洞察聚类 <span class="text-ink-200 text-xs">/ Insight Cluster</span></span>
                  </li>
                  <li class="flex items-center gap-3">
                    <span class="h-1.5 w-1.5 rounded-full bg-gold-500" />
                    <span>管理层报告 <span class="text-ink-200 text-xs">/ Executive Report</span></span>
                  </li>
                </ul>
                <div class="mt-6 text-xs font-mono text-ink-200">
                  {{ HERO.fileSize || `${HERO.pages ?? 0} 页` }}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- 加载中 -->
      <div v-else-if="loading" class="py-20 text-center text-sm text-ink-200">加载中…</div>

      <!-- 错误 -->
      <div v-else-if="loadError" class="py-20 text-center text-sm text-red-400">⚠ {{ loadError }}</div>

      <!-- 类目内容卡（中英文结合） -->
      <div
        :key="active"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="(item, i) in currentItems"
          :key="item.id"
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal"
          :style="{ transitionDelay: `${i * 80}ms` }"
        >
          <div class="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-700/80 bg-ink-950 p-6 transition-all hover:border-gold-500/60 sm:p-7">
            <div class="absolute inset-0 bg-grid opacity-20" />

            <!-- 类目角标 -->
            <div class="relative flex items-center gap-2">
              <span class="inline-flex items-center rounded-md border border-gold-500/40 bg-gold-500/10 px-2.5 py-0.5 text-xs font-medium text-gold-200">
                {{ TAB_LABEL[item.type as TabKey]?.zh || item.type }}
              </span>
              <span class="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-400">
                {{ TAB_LABEL[item.type as TabKey]?.en || item.type.toUpperCase() }}
              </span>
            </div>

            <!-- 中文字大、英文字小 -->
            <RouterLink :to="`/resources/${item.slug}`" class="relative mt-5 block leading-snug">
              <span class="block text-xl font-medium text-ink-50 group-hover:text-gold-300 transition-colors">
                {{ item.title }}
              </span>
              <span class="mt-1 block text-[11px] font-mono uppercase tracking-[0.25em] text-ink-200">
                {{ item.subtitle }}
              </span>
            </RouterLink>

            <p class="relative mt-4 text-sm text-ink-200 leading-relaxed line-clamp-3">
              {{ item.summary }}
            </p>

            <div class="relative mt-auto flex items-center justify-between pt-6">
              <span class="text-xs font-mono text-ink-200">{{ item.fileSize || `${item.pages ?? 0} 页` }}</span>
              <button
                type="button"
                class="inline-flex items-center gap-1 text-xs text-gold-400 transition-colors hover:text-gold-300 disabled:opacity-50"
                :disabled="downloadingId === item.id"
                @click="handleDownload(item.id)"
              >
                <span>{{ downloadingId === item.id ? '下载中…' : downloadCta(item) }}</span>
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- 底部跳转 -->
      <div class="mt-12 text-center">
        <RouterLink
          to="/resources"
          class="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/5 px-6 py-3 transition-all hover:border-gold-400 hover:bg-gold-500/10"
        >
          <span class="text-base font-medium text-gold-200">查看全部资产</span>
          <span class="text-xs font-mono uppercase tracking-[0.25em] text-gold-400">View All</span>
          <span class="text-gold-300">→</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
