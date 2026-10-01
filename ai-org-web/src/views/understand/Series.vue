<script setup lang="ts">
/**
 * 系列专题页 · Series
 * -----------------------------------------------------------------------------
 * 进入路径：/understand/series/:slug
 *
 *  - 优先用后端 /api/series/:slug 取系列详情（label / en / desc / topics）
 *  - 然后用 /api/contents?seriesSlug= 取该系列下文章
 *  - 子主题用 subTopicSlug 在客户端做切换过滤
 *  - 顶部 Hero 介绍系列背景
 *  - 二级子主题做 tab 切换
 *  - 文章卡片列表（与原 Series.vue 一致）
 */
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { api, type Content, type Series, type SubTopic } from '@/api/server'
import { COGNITION_PATH, type CognitionNode } from '@/data/insightMap'
import { useReveal } from '@/composables/useScroll'
import SubPageSocialSlot from '@/components/layout/SubPageSocialSlot.vue'

const { observe } = useReveal()
const route = useRoute()

const slug = computed(() => String(route.params.slug ?? ''))

// 当前系列（优先后端，没有时回退到前端 COGNITION_PATH 静态数据）
const series = ref<Series | null>(null)
const topics = ref<SubTopic[]>([])
const articles = ref<Content[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const dataSource = ref<'backend' | 'static' | 'not-found'>('backend')

// 当前子主题 tab（默认 all = 全部）
const activeTopicSlug = ref<string>('all')

// 文章分类标签
const CATEGORY_LABEL: Record<Content['category'], string> = {
  trend: 'TREND',
  point_of_view: 'POINT OF VIEW',
  field_note: 'FIELD NOTE',
  insight: 'INSIGHT',
  research: 'RESEARCH',
  whitepaper: 'WHITEPAPER',
  playbook: 'PLAYBOOK',
  framework: 'FRAMEWORK'
}

const NODE_ORDER_MAP: Record<string, number> = {
  'ai-changing-what': 1,
  'ai-changing-work': 2,
  'ai-changing-workflow': 2,
  'ai-changing-organization': 3,
  'ai-changing-org': 3,
}

// 相邻系列（用于底部"继续探索"导航）
const siblingSeries = computed<Series[]>(() => {
  // 如果当前从后端拿到，所有同栏目系列都用后端数据
  if (allBackendSeries.value.length > 0) {
    return allBackendSeries.value.filter((s) => s.slug !== slug.value)
  }
  // 否则回退到静态数据
  return COGNITION_PATH
    .filter((n) => n.slug !== slug.value)
    .map((n) => ({
      id: n.slug,
      slug: n.slug,
      label: n.label,
      en: n.en,
      desc: n.desc,
      navSection: 'understand' as const,
    }))
})

const allBackendSeries = ref<Series[]>([])

// 按子主题过滤后的文章
const filteredArticles = computed(() => {
  if (activeTopicSlug.value === 'all') return articles.value
  return articles.value.filter((a) => a.subTopic?.slug === activeTopicSlug.value)
})

/** 把 COGNITION_PATH 的 CognitionNode 适配成 Series 形状 */
function adaptStaticNode(n: CognitionNode): Series {
  return {
    id: n.slug,
    slug: n.slug,
    label: n.label,
    en: n.en,
    desc: n.desc,
    navSection: 'understand',
    topics: n.topics.map((t) => ({ id: t.name, slug: t.name, name: t.name })),
  }
}

async function load() {
  loading.value = true
  error.value = null
  series.value = null
  topics.value = []
  articles.value = []
  activeTopicSlug.value = 'all'

  try {
    // 1) 拉后端系列详情
    let s: Series | null = null
    try {
      s = await api.getSeries(slug.value)
      dataSource.value = 'backend'
    } catch {
      // 后端没有 → 回退到前端静态数据（保留对老 nodeSlug 的兼容）
      const node = COGNITION_PATH.find((n) => n.slug === slug.value)
      if (node) {
        s = adaptStaticNode(node)
        dataSource.value = 'static'
      }
    }

    if (!s) {
      dataSource.value = 'not-found'
      error.value = '未找到该认知节点'
      loading.value = false
      return
    }

    series.value = s
    topics.value = s.topics ?? []

    // 2) 拉系列下的文章
    const all = await api.listContents({ seriesSlug: slug.value, limit: 100 })
    articles.value = all
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

/** 拉所有 understand 系列，用于底部"继续探索" */
async function loadSiblingSeries() {
  try {
    allBackendSeries.value = await api.listSeries({ navSection: 'understand' })
  } catch {
    allBackendSeries.value = []
  }
}

watch(() => slug.value, () => {
  load()
  loadSiblingSeries()
}, { immediate: true })
onMounted(() => {
  load()
  loadSiblingSeries()
})
</script>

<template>
  <div v-if="series" class="min-h-screen bg-ink-950 pt-24 pb-30">
    <div class="container-wide">

      <!-- 返回上一级 -->
      <div class="mb-8">
        <RouterLink
          to="/understand"
          class="inline-flex items-center gap-2 text-sm text-ink-200 transition-colors hover:text-gold-400"
        >
          <span>←</span>
          <span>返回认知地图</span>
        </RouterLink>
      </div>

      <!-- Series Hero -->
      <div class="grid items-start gap-10 lg:grid-cols-12">
        <div class="lg:col-span-8 max-w-3xl">
          <div class="section-eyebrow">
            <span class="inline-block h-px w-8 bg-gold-500" />
            Series · 0{{ NODE_ORDER_MAP[series.slug] ?? '0' }} / 03
            <span v-if="dataSource === 'static'" class="ml-3 text-ink-300">（本地回退）</span>
          </div>
          <h1 class="mt-4 font-display text-display-sm lg:text-display text-ink-50 text-balance">
            <span class="text-gradient-gold">{{ series.label }}</span>
          </h1>
          <p v-if="series.en" class="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-ink-200">
            {{ series.en }}
          </p>
          <p class="mt-6 text-base lg:text-lg text-ink-100 leading-relaxed">
            {{ series.desc }}。本系列围绕这条主线，逐步沉淀判断、洞察与行动建议——
            让"零散观点"变成"结构化认知资产"。
          </p>

          <!-- 系列统计 -->
          <div class="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
            <div class="flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-gold-500" />
              <span class="text-ink-200">系列文章</span>
              <span class="text-ink-50 font-mono">{{ articles.length }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-gold-500/60" />
              <span class="text-ink-200">子主题</span>
              <span class="text-ink-50 font-mono">{{ topics.length }}</span>
            </div>
            <div v-if="series.frameworks" class="flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-gold-500/40" />
              <span class="text-ink-200">框架模型</span>
              <span class="text-ink-50 font-mono">{{ series.frameworks }}</span>
            </div>
          </div>
        </div>

        <aside class="lg:col-span-4">
          <SubPageSocialSlot />
        </aside>
      </div>

      <!-- 二级主题 tab -->
      <div
        v-if="topics.length"
        class="mt-12 border-t border-ink-800 pt-8"
      >
        <div class="flex items-center gap-3 mb-5">
          <span class="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-500">
            SUB-TOPICS
          </span>
          <span class="h-px flex-1 bg-ink-800" />
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-full border px-4 py-1.5 transition-all"
            :class="activeTopicSlug === 'all'
              ? 'border-gold-500 bg-gold-500/10 text-gold-200'
              : 'border-ink-700 bg-ink-900 text-ink-100 hover:border-gold-700/40'"
            @click="activeTopicSlug = 'all'"
          >
            <span class="font-medium">全部</span>
            <span class="ml-2 font-mono text-[10px] tabular-nums opacity-70">
              {{ articles.length }}
            </span>
          </button>
          <button
            v-for="t in topics"
            :key="t.slug"
            type="button"
            class="rounded-full border px-4 py-1.5 transition-all"
            :class="activeTopicSlug === t.slug
              ? 'border-gold-500 bg-gold-500/10 text-gold-200'
              : 'border-ink-700 bg-ink-900 text-ink-100 hover:border-gold-700/40'"
            @click="activeTopicSlug = t.slug"
          >
            <span class="font-medium">{{ t.name }}</span>
            <span v-if="t.count" class="ml-2 font-mono text-[10px] tabular-nums opacity-70">
              {{ t.count }}
            </span>
          </button>
        </div>
      </div>

      <!-- 文章列表 -->
      <div class="mt-10 space-y-4">

        <!-- 加载态 -->
        <div v-if="loading" class="space-y-4">
          <div
            v-for="i in 5"
            :key="i"
            class="flex items-start gap-6 rounded-xl border border-ink-700/40 bg-ink-900/40 p-6 animate-pulse"
          >
            <div class="h-10 w-10 rounded-lg bg-ink-800 shrink-0" />
            <div class="flex-1 space-y-2">
              <div class="h-3 w-32 rounded bg-ink-800" />
              <div class="h-5 w-2/3 rounded bg-ink-800" />
              <div class="h-4 w-full rounded bg-ink-800" />
            </div>
          </div>
        </div>

        <!-- 错误态 -->
        <div v-else-if="error" class="rounded-xl border border-red-900/40 bg-red-950/20 p-8 text-center text-sm text-red-400">
          ⚠ {{ error }}
        </div>

        <!-- 空态 -->
        <div v-else-if="filteredArticles.length === 0" class="py-20 text-center">
          <p class="text-lg text-ink-200">该子主题下还没有文章</p>
          <p class="mt-2 text-sm text-ink-300">敬请期待更多内容</p>
        </div>

        <!-- 正常列表 -->
        <template v-else>
          <RouterLink
            v-for="(article, i) in filteredArticles"
            :key="article.id"
            :to="`/understand/${article.slug}`"
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal group flex items-start gap-6 rounded-xl border border-ink-700/60 bg-ink-900/40 p-6 transition-all duration-300 hover:border-gold-500/40 hover:bg-ink-900/70"
            :style="{ transitionDelay: `${i * 60}ms` }"
          >
            <!-- 序号 -->
            <div class="font-display text-4xl font-light text-gold-500 leading-none shrink-0 w-12">
              {{ String(i + 1).padStart(2, '0') }}
            </div>

            <!-- 内容 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 flex-wrap">
                <span class="inline-flex items-center gap-1.5 rounded-full border border-gold-700/40 bg-gold-500/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-gold-300">
                  {{ CATEGORY_LABEL[article.category] }}
                </span>
                <span v-if="article.subTopic" class="inline-flex items-center gap-1.5 rounded-full border border-ink-700 bg-ink-800 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-100">
                  {{ article.subTopic.name }}
                </span>
                <span class="font-mono text-[11px] text-ink-200 tabular-nums">
                  {{ (article.publishedAt || '').split('T')[0] }}
                </span>
                <span v-if="article.readingTime" class="text-[11px] text-ink-300">
                  · {{ article.readingTime }} 分钟
                </span>
              </div>
              <h2 class="mt-3 text-xl font-medium text-ink-50 leading-snug group-hover:text-gold-300 transition-colors">
                {{ article.title }}
              </h2>
              <p v-if="article.excerpt" class="mt-2 text-sm text-ink-200 line-clamp-2">
                {{ article.excerpt }}
              </p>
            </div>

            <!-- 箭头 -->
            <div class="self-center opacity-50 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 shrink-0">
              <svg class="h-5 w-5 text-gold-400" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </RouterLink>
        </template>
      </div>

      <!-- 继续探索：兄弟系列 -->
      <div v-if="siblingSeries.length" class="mt-24 border-t border-ink-800 pt-12">
        <div class="flex items-center gap-3 mb-6">
          <span class="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-500">
            CONTINUE · 继续探索相邻系列
          </span>
          <span class="h-px flex-1 bg-ink-800" />
        </div>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RouterLink
            v-for="sn in siblingSeries"
            :key="sn.slug"
            :to="`/understand/series/${sn.slug}`"
            class="group flex items-start gap-5 rounded-xl border border-ink-700/60 bg-ink-900/40 p-6 transition-all duration-300 hover:border-gold-500/40"
          >
            <div class="font-mono text-[10px] uppercase tracking-[0.3em] text-gold-500 mt-1 shrink-0">
              0{{ NODE_ORDER_MAP[sn.slug] ?? '0' }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-display text-lg text-ink-50 group-hover:text-gold-300 transition-colors">
                {{ sn.label }}
              </h3>
              <p class="mt-2 text-sm text-ink-200 line-clamp-2">{{ sn.desc }}</p>
            </div>
            <div class="self-center opacity-50 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 shrink-0">
              <svg class="h-5 w-5 text-gold-400" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </RouterLink>
        </div>
      </div>

    </div>
  </div>

  <!-- 节点未找到 -->
  <div v-else-if="!loading" class="min-h-screen bg-ink-950 pt-24 pb-30">
    <div class="container-reading text-center">
      <div class="text-sm font-mono text-red-400">404</div>
      <h1 class="mt-3 text-display-md font-display font-medium text-ink-50">系列专题不存在</h1>
      <RouterLink to="/understand" class="mt-8 inline-block text-gold-400 hover:text-gold-300">
        ← 返回认知地图
      </RouterLink>
    </div>
  </div>
</template>
