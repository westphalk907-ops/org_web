<script setup lang="ts">
/**
 * 深度洞察列表页 · Insights
 * -----------------------------------------------------------------------------
 * 支持三种 URL query 筛选，可叠加：
 *   ?category=trend|point_of_view|...    文章分类
 *   ?type=pov|framework|insight|mental-model  认知资产类型（FORGE 判断用）
 *   ?node=ai-changing-what|...           认知节点
 *
 *  - type 与 category 是正交维度：例如 type=pov 会把所有 category=point_of_view
 *    与 tags 含 "Judgment"/"Point" 的文章筛出来（语义筛选，不是字段筛选）。
 *  - 顶部 Eyebrow 会随 type 切换成对应分类的描述
 *
 *  - Step 4 新增：当未选 category / type 时，按系列分组展示；
 *    每个系列作为独立 section，附系列描述 + 文章数 + 子主题分布
 */
import { useRoute } from 'vue-router'
import { useReveal } from '@/composables/useScroll'
import { computed, onMounted, ref, watch } from 'vue'
import { api, type Content, type Series, type SubTopic } from '@/api/server'
import SubPageSocialSlot from '@/components/layout/SubPageSocialSlot.vue'

const { observe } = useReveal()
const route = useRoute()

// ---------- 筛选维度 ----------
type CategoryVal = Content['category'] | 'all'
const VALID_CATEGORIES: Content['category'][] = [
  'trend', 'point_of_view', 'field_note', 'insight',
  'research', 'whitepaper', 'playbook', 'framework'
]
const initialCategory = (VALID_CATEGORIES as string[]).includes(route.query.category as string)
  ? (route.query.category as Content['category'])
  : 'all'

// 认知资产类型（FORGE 判断四类）
type AssetType = 'pov' | 'framework' | 'insight' | 'mental-model' | null
const VALID_TYPES: AssetType[] = ['pov', 'framework', 'insight', 'mental-model']
const initialType = (VALID_TYPES as string[]).includes(route.query.type as string)
  ? (route.query.type as AssetType)
  : null

// 认知节点 slug
const initialNode = typeof route.query.node === 'string' ? route.query.node : ''

const filter = ref<CategoryVal>(initialCategory)
const typeFilter = ref<AssetType>(initialType)
const nodeFilter = ref<string>(initialNode)

// ---------- 类型元数据（标题 / 描述 / tag 语义匹配） ----------
const TYPE_META: Record<NonNullable<AssetType>, {
  zh: string; en: string; desc: string;
  /** 用于语义筛选的 tag / category 关键词 */
  matchCategories: Content['category'][];
  matchTags: string[];
}> = {
  pov: {
    zh: '核心观点',
    en: 'POINT OF VIEW',
    desc: 'FORGE 对 AI 组织变革最重要的判断与立场。',
    matchCategories: ['point_of_view', 'insight'],
    matchTags: ['Judgment', 'Point', '观点', '判断']
  },
  framework: {
    zh: '框架模型',
    en: 'FRAMEWORK',
    desc: '可复用的方法论、心智模型与脚手架。',
    matchCategories: ['framework', 'playbook'],
    matchTags: ['Framework', 'Workflow', '框架']
  },
  insight: {
    zh: '深度洞察',
    en: 'INSIGHT',
    desc: '比公众号文章更深的研究、专题、数据分析。',
    matchCategories: ['insight', 'research'],
    matchTags: ['Insight', 'Agent', 'Organization', '深度']
  },
  'mental-model': {
    zh: '心智模型',
    en: 'MENTAL MODEL',
    desc: '我们看 AI 组织变革的方式，决定了我们如何行动。',
    matchCategories: ['insight', 'point_of_view'],
    matchTags: ['Judgment', 'Model', 'Mental', '心智', '判断']
  }
}

// ---------- 状态 ----------
const allArticles = ref<Content[]>([])
const seriesList = ref<Series[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

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

// ---------- 顶部标题（随 type 切换） ----------
const heroMeta = computed(() => {
  if (typeFilter.value) {
    const m = TYPE_META[typeFilter.value]
    return {
      eyebrow: `FORGE · ${m.en}`,
      title: m.zh,
      desc: m.desc
    }
  }
  return {
    eyebrow: 'FORGE Insights',
    title: '深度',
    desc: '比公众号文章更深的研究、专题、数据分析。这些内容长期有效，会反复回到认知地图中作为锚点。'
  }
})

// ---------- 筛选逻辑 ----------
const articles = computed(() => {
  let list = allArticles.value

  // type 筛选
  if (typeFilter.value) {
    const m = TYPE_META[typeFilter.value]
    list = list.filter((a) => {
      const catHit = m.matchCategories.includes(a.category)
      const tagHit = (a.tags ?? []).some((t) =>
        m.matchTags.some((k) => t.toLowerCase().includes(k.toLowerCase()))
      )
      return catHit || tagHit
    })
  }

  // category 筛选
  if (filter.value !== 'all') {
    list = list.filter((a) => a.category === filter.value)
  }

  // node 筛选
  if (nodeFilter.value) {
    // nodeSlug 在数据里有 'ai-changing-org' 这种旧值，做一下兼容
    const aliasMap: Record<string, string> = {
      'ai-changing-organization': 'ai-changing-org'
    }
    const target = aliasMap[nodeFilter.value] ?? nodeFilter.value
    list = list.filter((a) => a.nodeSlug === target)
  }

  return list
})

/** 是否需要按系列分组：仅当没选 type / category / node 时 */
const shouldGroupBySeries = computed(() =>
  !typeFilter.value && filter.value === 'all' && !nodeFilter.value
)

/** 按系列分组的视图模型 */
interface SeriesGroup {
  series: Series
  articles: Content[]
  /** 该系列下子主题分布：[{ topic, count }] */
  topicStats: Array<{ topic: SubTopic; count: number }>
}

const groupedArticles = computed<SeriesGroup[]>(() => {
  // 没有 series 数据时（如后端挂了或 mock 模式无 series），用"未分组"兜底
  if (seriesList.value.length === 0) {
    return [{
      series: {
        id: '__ungrouped__',
        slug: '',
        label: '未归入系列',
        desc: '这些文章尚未绑定到具体系列。可以到后台「文章管理」给它们选择一个系列。',
        navSection: 'understand',
      } as Series,
      articles: articles.value,
      topicStats: [],
    }]
  }

  // 已分组
  const groups: SeriesGroup[] = []
  const ungrouped: Content[] = []

  for (const s of seriesList.value) {
    const items = articles.value.filter((a) => a.seriesId === s.id)
    if (items.length === 0) continue

    // 子主题统计
    const topicCounts = new Map<string, number>()
    for (const a of items) {
      const tid = a.subTopicId ?? '__none__'
      topicCounts.set(tid, (topicCounts.get(tid) ?? 0) + 1)
    }
    const topicStats: SeriesGroup['topicStats'] = []
    for (const t of s.topics ?? []) {
      const c = topicCounts.get(t.id) ?? 0
      if (c > 0) topicStats.push({ topic: t, count: c })
    }
    // 没有 subTopic 但有 series 的文章：单独占一个统计项
    const noneCount = topicCounts.get('__none__') ?? 0
    if (noneCount > 0) {
      topicStats.unshift({
        topic: { id: '__none__', slug: '', name: '未指定子主题' },
        count: noneCount,
      })
    }

    groups.push({ series: s, articles: items, topicStats })
  }

  // 未绑定系列的文章
  for (const a of articles.value) {
    if (!a.seriesId) ungrouped.push(a)
  }
  if (ungrouped.length > 0) {
    groups.push({
      series: {
        id: '__ungrouped__',
        slug: '',
        label: '未归入系列',
        desc: '这些文章尚未绑定到具体系列。可以到后台「文章管理」给它们选择一个系列。',
        navSection: 'understand',
      } as Series,
      articles: ungrouped,
      topicStats: [],
    })
  }

  return groups
})

// ---------- 数据加载 ----------
async function load() {
  loading.value = true
  error.value = null
  try {
    // 并行拉文章和系列
    const [articlesData, seriesData] = await Promise.all([
      api.listContents({ navSection: 'understand', limit: 100 }),
      api.listSeries({ navSection: 'understand' }).catch(() => [] as Series[]),
    ])
    allArticles.value = articlesData
    seriesList.value = seriesData
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

// 监听 query 变化（从一个 type 跳到另一个 type 时，重新初始化）
watch(
  () => [route.query.category, route.query.type, route.query.node],
  () => {
    filter.value = (VALID_CATEGORIES as string[]).includes(route.query.category as string)
      ? (route.query.category as Content['category'])
      : 'all'
    typeFilter.value = (VALID_TYPES as string[]).includes(route.query.type as string)
      ? (route.query.type as AssetType)
      : null
    nodeFilter.value = typeof route.query.node === 'string' ? route.query.node : ''
  }
)

onMounted(load)

// ---------- 筛选操作 ----------
function handleFilter(v: CategoryVal) {
  filter.value = v
  // 同步 URL（不刷新页面）
  const q: Record<string, string> = {}
  if (v !== 'all') q.category = v
  if (typeFilter.value) q.type = typeFilter.value
  if (nodeFilter.value) q.node = nodeFilter.value
  history.replaceState({}, '', location.pathname + (Object.keys(q).length ? '?' + new URLSearchParams(q).toString() : ''))
}

function clearType() {
  typeFilter.value = null
  history.replaceState({}, '', location.pathname)
}

// 筛选 tab（与 type 二选一时不显示）
const FILTER_TABS: { v: CategoryVal; zh: string; en: string }[] = [
  { v: 'all',           zh: '全部',       en: 'ALL' },
  { v: 'trend',         zh: '趋势',       en: 'TREND' },
  { v: 'point_of_view', zh: '观点',       en: 'POINT OF VIEW' },
  { v: 'field_note',    zh: '实践',       en: 'FIELD NOTE' },
  { v: 'insight',       zh: '洞察',       en: 'INSIGHT' },
  { v: 'research',      zh: '研究',       en: 'RESEARCH' },
  { v: 'framework',     zh: '框架',       en: 'FRAMEWORK' }
]
</script>

<template>
  <div class="min-h-screen bg-ink-950 pt-24 pb-30">
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

      <!-- Hero 标题 + 二维码 -->
      <div class="grid items-start gap-10 lg:grid-cols-12">
        <div class="lg:col-span-8 max-w-3xl">
          <div class="section-eyebrow">
            <span class="inline-block h-px w-8 bg-gold-500" />
            {{ heroMeta.eyebrow }}
          </div>
          <h1 class="mt-4 font-display text-display-sm lg:text-display text-ink-50">
            <span class="text-gradient-gold">{{ heroMeta.title }}</span>
          </h1>
          <p class="mt-5 text-base lg:text-lg text-ink-100 leading-relaxed">
            {{ heroMeta.desc }}
          </p>

          <!-- type 标签：可清除 -->
          <div v-if="typeFilter" class="mt-6 inline-flex items-center gap-2 rounded-full border border-gold-700/40 bg-gold-500/5 px-3 py-1.5 text-xs">
            <span class="font-mono uppercase tracking-[0.25em] text-gold-300">
              {{ TYPE_META[typeFilter].en }}
            </span>
            <button
              type="button"
              class="text-ink-300 hover:text-gold-300"
              @click="clearType"
              aria-label="清除筛选"
            >
              ✕
            </button>
          </div>
        </div>

        <aside class="lg:col-span-4">
          <SubPageSocialSlot />
        </aside>
      </div>

      <!-- 分类筛选（仅当未选 type 时显示完整 tab） -->
      <div v-if="!typeFilter" class="mt-10 flex flex-wrap gap-2">
        <button
          v-for="tab in FILTER_TABS"
          :key="tab.v"
          type="button"
          class="rounded-full border px-4 py-1.5 transition-all"
          :class="filter === tab.v
            ? 'border-gold-500 bg-gold-500/10 text-gold-200'
            : 'border-ink-700 bg-ink-900 text-ink-100 hover:border-gold-700/40'"
          @click="handleFilter(tab.v)"
        >
          <span class="font-medium">{{ tab.zh }}</span>
          <span class="ml-2 font-mono text-[10px] uppercase tracking-widest opacity-70">{{ tab.en }}</span>
        </button>
      </div>

      <!-- 文章列表 -->
      <div class="mt-10">

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
        <div v-else-if="articles.length === 0" class="py-20 text-center">
          <p class="text-lg text-ink-200">暂无此类内容</p>
          <p class="mt-2 text-sm text-ink-300">敬请期待更多内容</p>
        </div>

        <!-- ============ 默认：按系列分组 ============ -->
        <template v-else-if="shouldGroupBySeries">
          <div class="space-y-16">
            <section
              v-for="(group, gi) in groupedArticles"
              :key="group.series.id"
              :ref="(el) => observe(el as HTMLElement)"
              class="reveal"
              :style="{ transitionDelay: `${gi * 80}ms` }"
            >
              <!-- 系列头部 -->
              <div class="mb-6 flex items-end justify-between gap-4 border-b border-ink-800 pb-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3">
                    <span class="font-mono text-[11px] uppercase tracking-[0.3em] text-gold-500">
                      SERIES · {{ String(gi + 1).padStart(2, '0') }}
                    </span>
                    <span v-if="group.series.en" class="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-300">
                      {{ group.series.en }}
                    </span>
                  </div>
                  <h2 class="mt-2 font-display text-2xl lg:text-3xl text-ink-50 text-balance">
                    {{ group.series.label }}
                  </h2>
                  <p v-if="group.series.desc" class="mt-2 text-sm text-ink-200 max-w-2xl">
                    {{ group.series.desc }}
                  </p>
                </div>
                <div class="text-right shrink-0">
                  <div class="font-mono text-2xl text-gold-400">{{ group.articles.length }}</div>
                  <div class="text-[10px] uppercase tracking-[0.25em] text-ink-300 mt-0.5">篇文章</div>
                </div>
              </div>

              <!-- 子主题分布小标签 -->
              <div v-if="group.topicStats.length > 0" class="mb-5 flex flex-wrap items-center gap-2">
                <span class="text-[10px] uppercase tracking-[0.25em] text-ink-300 mr-1">SUB-TOPICS</span>
                <RouterLink
                  v-for="(t, ti) in group.topicStats"
                  :key="ti"
                  :to="group.series.slug ? `/understand/series/${group.series.slug}` : '#'"
                  class="inline-flex items-center gap-1.5 rounded-full border border-ink-700 bg-ink-900 px-3 py-1 text-xs text-ink-100 transition-all hover:border-gold-500/40 hover:text-gold-300"
                >
                  <span>{{ t.topic.name }}</span>
                  <span class="font-mono text-[10px] text-ink-300">×{{ t.count }}</span>
                </RouterLink>
              </div>

              <!-- 该系列下的文章卡片 -->
              <div class="space-y-3">
                <RouterLink
                  v-for="(article, ai) in group.articles"
                  :key="article.id"
                  :to="`/understand/${article.slug}`"
                  class="reveal group flex items-start gap-5 rounded-xl border border-ink-700/60 bg-ink-900/40 p-5 transition-all duration-300 hover:border-gold-500/40 hover:bg-ink-900/70"
                  :style="{ transitionDelay: `${ai * 40}ms` }"
                >
                  <div class="font-display text-3xl font-light text-gold-500 leading-none shrink-0 w-10">
                    {{ String(ai + 1).padStart(2, '0') }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="inline-flex items-center rounded-full border border-gold-700/40 bg-gold-500/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-gold-300">
                        {{ CATEGORY_LABEL[article.category] }}
                      </span>
                      <span v-if="article.subTopic" class="inline-flex items-center rounded-full border border-ink-700 bg-ink-800 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-100">
                        {{ article.subTopic.name }}
                      </span>
                      <span class="font-mono text-[11px] text-ink-200 tabular-nums">
                        {{ article.date || (article.publishedAt ? String(article.publishedAt).slice(0, 10).replace(/-/g, '.') : '') }}
                      </span>
                      <span v-if="article.readingTime" class="text-[11px] text-ink-300">
                        · {{ article.readingTime }} 分钟
                      </span>
                    </div>
                    <h3 class="mt-2 text-lg font-medium text-ink-50 leading-snug group-hover:text-gold-300 transition-colors">
                      {{ article.title }}
                    </h3>
                    <p v-if="article.excerpt" class="mt-1.5 text-sm text-ink-200 line-clamp-2">
                      {{ article.excerpt }}
                    </p>
                  </div>
                  <div class="self-center opacity-50 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 shrink-0">
                    <svg class="h-4 w-4 text-gold-400" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </RouterLink>
              </div>

              <!-- 系列底部：查看完整专题 -->
              <div v-if="group.series.slug" class="mt-5 text-right">
                <RouterLink
                  :to="`/understand/series/${group.series.slug}`"
                  class="inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition-colors"
                >
                  查看完整专题页 →
                </RouterLink>
              </div>
            </section>
          </div>
        </template>

        <!-- ============ 有筛选时：平铺列表（保留旧行为） ============ -->
        <template v-else>
          <div class="space-y-4">
            <RouterLink
              v-for="(article, i) in articles"
              :key="article.id"
              :to="`/understand/${article.slug}`"
              :ref="(el) => observe(el as HTMLElement)"
              class="reveal group flex items-start gap-6 rounded-xl border border-ink-700/60 bg-ink-900/40 p-6 transition-all duration-300 hover:border-gold-500/40 hover:bg-ink-900/70"
              :style="{ transitionDelay: `${i * 60}ms` }"
            >
              <div class="font-display text-4xl font-light text-gold-500 leading-none shrink-0 w-12">
                {{ String(i + 1).padStart(2, '0') }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 flex-wrap">
                  <span class="inline-flex items-center gap-1.5 rounded-full border border-gold-700/40 bg-gold-500/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-gold-300">
                    {{ CATEGORY_LABEL[article.category] }}
                  </span>
                  <span v-if="article.subTopic" class="inline-flex items-center rounded-full border border-ink-700 bg-ink-800 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-100">
                    {{ article.subTopic.name }}
                  </span>
                  <span class="font-mono text-[11px] text-ink-200 tabular-nums">
                    {{ article.date || (article.publishedAt ? String(article.publishedAt).slice(0, 10).replace(/-/g, '.') : '') }}
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
              <div class="self-center opacity-50 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 shrink-0">
                <svg class="h-5 w-5 text-gold-400" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </RouterLink>
          </div>
        </template>

      </div>

    </div>
  </div>
</template>
