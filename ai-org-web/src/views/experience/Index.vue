<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReveal } from '@/composables/useScroll'
import SubPageHero from '@/components/layout/SubPageHero.vue'
import OwnerContactModal from '@/components/layout/OwnerContactModal.vue'
import { api, type Scenario, type ScenarioCategory, type Content } from '@/api/server'
import { SCENARIO_CATEGORIES } from '@/data/scenarios'

const route = useRoute()
const router = useRouter()
const { observe } = useReveal()

type TabValue = ScenarioCategory | 'ALL'

const initialTab = ((): TabValue => {
  const t = (route.query.tab as string) || 'ALL'
  if (t === 'assessment') return 'ALL'
  return t as TabValue
})()

const activeTab = ref<TabValue>(initialTab)
const scenarios = ref<Scenario[]>([])
const loading = ref(false)
const errorMsg = ref('')
const showContactModal = ref(false)

/** 体验栏目文章（后台 navSection = experience） */
const articles = ref<Content[]>([])
const articlesLoading = ref(false)
const articlesError = ref('')

const tabs = computed(() => [
  { value: 'ALL' as TabValue, label: '全部场景' },
  ...SCENARIO_CATEGORIES.map((c) => ({ value: c.value as TabValue, label: c.label })),
])

const visibleScenarios = computed(() => {
  if (activeTab.value === 'ALL') return scenarios.value
  return scenarios.value.filter((s) => s.category === activeTab.value)
})

const currentCategoryDesc = computed(() => {
  if (activeTab.value === 'ALL') return ''
  return SCENARIO_CATEGORIES.find((c) => c.value === activeTab.value)?.desc ?? ''
})

async function load() {
  loading.value = true
  errorMsg.value = ''
  try {
    const params = activeTab.value === 'ALL'
      ? {}
      : { category: activeTab.value as ScenarioCategory }
    scenarios.value = await api.listScenarios(params)
  } catch (e: any) {
    errorMsg.value = e?.message ?? '加载失败'
  } finally {
    loading.value = false
  }
}

async function loadArticles() {
  articlesLoading.value = true
  articlesError.value = ''
  try {
    const list = await api.listContents({ navSection: 'experience', limit: 60 })
    articles.value = list
      .filter((c) => c.isPublished)
      .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  } catch (e: any) {
    articlesError.value = e?.message ?? '加载失败'
  } finally {
    articlesLoading.value = false
  }
}

function selectTab(t: TabValue) {
  activeTab.value = t
  // 同步到 URL
  router.replace({ query: { ...route.query, tab: t === 'ALL' ? undefined : t } })
}

function openScenario(s: Scenario) {
  router.push(`/experience/scenarios/${s.slug}`)
}

function openContact() {
  showContactModal.value = true
}

onMounted(() => {
  load()
  loadArticles()
})
watch(activeTab, load)
</script>

<template>
  <div>
    <SubPageHero
      eyebrow="Experience · 体验"
      subtitle="具体场景 · 痛点 → 解决方案 · 直接可用的 Prompt"
    >
      <template #title>
        看见 AI <br />
        <span class="text-gradient-gold">如何解决你的真问题</span>
      </template>
    </SubPageHero>

    <!-- Tab 切换 -->
    <section class="border-b border-ink-800/60 bg-ink-950">
      <div class="container-wide">
        <div class="-mx-2 flex gap-1 overflow-x-auto py-4">
          <button
            v-for="t in tabs"
            :key="t.value"
            type="button"
            class="flex shrink-0 items-center gap-2 rounded-full border px-5 py-2 text-sm transition-all"
            :class="
              activeTab === t.value
                ? 'border-gold-500 bg-gold-500/10 text-gold-300'
                : 'border-ink-700 bg-ink-900 text-ink-100 hover:border-gold-700/40 hover:text-ink-50'
            "
            @click="selectTab(t.value)"
          >
            <span>{{ t.label }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 本栏目文章（后台 navSection = experience） -->
    <section class="py-20 border-b border-ink-800/60">
      <div class="container-wide">
        <div class="flex items-end justify-between mb-10">
          <div>
            <div class="text-sm font-mono text-gold-400">体验文章</div>
            <h2 class="mt-3 text-display-sm font-display font-medium text-ink-50">
              评测 · 记录 · 复盘
            </h2>
            <p class="mt-3 text-sm text-ink-200 max-w-xl">
              后台「栏目归属 = 体验」的文章列表。深度评测、落地日志、复盘记录。
            </p>
          </div>
        </div>

        <div v-if="articlesLoading" class="py-8 text-center text-sm text-ink-200">加载中…</div>

        <div v-else-if="articlesError" class="py-8 text-center text-sm text-red-400">⚠ {{ articlesError }}</div>

        <div v-else-if="articles.length === 0" class="py-8 text-center text-sm text-ink-200">
          还没有发布「体验」栏目的文章。
          <span class="block mt-2 text-xs text-ink-300">
            去 <RouterLink to="/admin/articles" class="text-gold-400 hover:text-gold-300">后台 · 文章管理</RouterLink> 创建一个「栏目归属 = 体验」的文章并发布。
          </span>
        </div>

        <div v-else class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <RouterLink
            v-for="(c, i) in articles"
            :key="c.id"
            :to="`/experience/${c.slug}`"
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal group rounded-2xl border border-ink-700 bg-ink-900 p-6 transition-all hover:border-gold-700/50 hover:shadow-card-hover"
            :style="{ transitionDelay: `${(i % 6) * 60}ms` }"
          >
            <div class="font-mono text-xs text-ink-200">{{ c.category }}</div>
            <h3 class="mt-3 text-lg font-display font-medium text-ink-50 group-hover:text-gold-300 transition-colors leading-snug">
              {{ c.title }}
            </h3>
            <p class="mt-3 text-sm text-ink-200 line-clamp-3">
              {{ c.excerpt }}
            </p>
            <div class="mt-6 flex items-center justify-between border-t border-ink-800 pt-4 text-xs text-ink-200">
              <span>{{ (c.publishedAt || '').split('T')[0] }} · {{ c.readingTime || 5 }} 分钟</span>
              <span class="text-gold-400 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- 场景网格 -->
    <section class="py-20">
      <div class="container-wide">
        <div v-if="currentCategoryDesc" class="mb-10 max-w-2xl text-sm text-ink-200">
          {{ currentCategoryDesc }}
        </div>

        <div v-if="loading" class="py-20 text-center text-sm text-ink-200">加载中…</div>
        <div v-else-if="errorMsg" class="py-20 text-center text-sm text-red-400">⚠ {{ errorMsg }}</div>
        <div v-else-if="visibleScenarios.length === 0" class="py-20 text-center text-sm text-ink-200">
          该分类下暂无场景。
        </div>
        <div v-else class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <button
            v-for="(s, i) in visibleScenarios"
            :key="s.id"
            type="button"
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal group flex flex-col items-start rounded-2xl border border-ink-700 bg-ink-900 p-6 text-left transition-all duration-500 hover:border-gold-700/50 hover:shadow-card-hover"
            :style="{ transitionDelay: `${(i % 6) * 60}ms` }"
            @click="openScenario(s)"
          >
            <div class="flex w-full items-start justify-between">
              <span class="rounded-full border border-ink-700 px-2 py-0.5 font-mono text-[10px] uppercase text-ink-200">
                {{ SCENARIO_CATEGORIES.find(c => c.value === s.category)?.label }}
              </span>
            </div>

            <h3 class="mt-5 text-lg font-display font-medium text-ink-50 group-hover:text-gold-300 transition-colors">
              {{ s.title }}
            </h3>

            <p v-if="s.subtitle" class="mt-2 text-sm text-ink-200">
              {{ s.subtitle }}
            </p>

            <p class="mt-4 line-clamp-2 text-sm text-ink-200">
              {{ s.problem }}
            </p>

            <div class="mt-6 flex w-full items-center justify-between">
              <span class="text-xs text-ink-200">
                {{ s.afterSteps.length }} 步 AI 工作流
              </span>
              <span class="text-sm text-gold-400 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- 全站加微信 CTA（底部） -->
    <section class="py-20">
      <div class="container-wide">
        <div class="overflow-hidden rounded-2xl border border-gold-700/30 bg-gradient-to-br from-ink-900 to-gold-500/5 p-10 lg:p-14">
          <div class="grid items-center gap-8 lg:grid-cols-12">
            <div class="lg:col-span-7">
              <div class="font-mono text-xs text-gold-400">想亲自跑一遍？</div>
              <h3 class="mt-3 text-3xl font-display font-medium text-ink-50">
                加 Owner 微信 · 领场景实战包
              </h3>
              <p class="mt-3 text-base text-ink-200">
                好友备注「场景名」,我会一对一拉你进对应实战群,并送上场景相关的 Prompt / 模板 / 视频演示。
              </p>
              <button
                type="button"
                class="mt-6 inline-flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-3 text-sm font-medium text-ink-950 hover:bg-gold-400"
                @click="openContact"
              >
                加微信领场景包 →
              </button>
            </div>
            <div class="lg:col-span-5">
              <div class="rounded-xl border border-gold-700/30 bg-ink-950 p-6 text-sm text-ink-200">
                <div class="font-mono text-xs text-gold-400">免费提供</div>
                <ul class="mt-3 space-y-2">
                  <li>· 每个场景的完整 Prompt 模板</li>
                  <li>· 实施该场景的 12 步行动清单</li>
                  <li>· 真实客户脱敏案例 + ROI 数据</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <OwnerContactModal v-if="showContactModal" @close="showContactModal = false" />
  </div>
</template>
