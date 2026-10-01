<script setup lang="ts">
/**
 * 认知页 / Understand
 * -----------------------------------------------------------------------------
 * 定位：AI 组织变革的「认知地图」
 *
 *  - 公众号负责"持续发生"（每周三篇：趋势 / 观点 / 实践）
 *  - 认知页负责"持续沉淀"（把零散观点组织成结构化的认知资产）
 *
 * 7 大模块结构：
 *  00 - Hero（INSIGHT · AI 组织变革认知地图）
 *  01 - 03 + 03 · 认知路径（AI 改变什么 → 改变工作 → 必须改变组织）
 *  04 · FORGE 的判断（观点 / 框架 / 洞察 / 心智模型）
 *  05 · 本周 FORGE 观察（公众号最新 3 篇）
 *  06 · 深度认知（研究 / 专题 / 数据分析）
 *  07 · 继续探索（学习 / 体验 / 资源 / 解决方案）
 *  08 · 本栏目文章（后台 navSection = understand 的全部 Content）
 */
import { onMounted, ref } from 'vue'
import { api, type Content } from '@/api/server'
import { useReveal } from '@/composables/useScroll'
import InsightHeroSection from '@/components/insight/InsightHeroSection.vue'
import InsightSocialBridge from '@/components/insight/InsightSocialBridge.vue'
import CognitionPathSection from '@/components/insight/CognitionPathSection.vue'
import ForgeJudgmentSection from '@/components/insight/ForgeJudgmentSection.vue'
import WeeklyForgeSection from '@/components/insight/WeeklyForgeSection.vue'
import DeepInsightSection from '@/components/insight/DeepInsightSection.vue'
import ContinueExploreSection from '@/components/insight/ContinueExploreSection.vue'

const { observe } = useReveal()

/** 本栏目文章 = 后台 navSection = understand 的全部 Content */
const articles = ref<Content[]>([])
const loading = ref(false)
const errorMsg = ref('')

const CATEGORY_ZH: Record<string, string> = {
  framework: '框架',
  playbook: '行动手册',
  whitepaper: '白皮书',
  insight: '洞察',
  research: '研究',
  trend: '趋势',
  point_of_view: '观点',
  field_note: '实践',
}

async function load() {
  loading.value = true
  errorMsg.value = ''
  try {
    const list = await api.listContents({ navSection: 'understand', limit: 60 })
    articles.value = list
      .filter((c) => c.isPublished)
      .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  } catch (e: any) {
    errorMsg.value = e?.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <!-- 00 · Hero -->
    <InsightHeroSection />

    <!-- 过渡带：社交二维码占位（公众号 / 抖音 / 小红书） -->
    <InsightSocialBridge />

    <!-- 01 - 03 · 认知路径 -->
    <CognitionPathSection />

    <!-- 04 · DOCORE 的判断 -->
    <ForgeJudgmentSection />

    <!-- 05 · 本周 FORGE 观察 -->
    <WeeklyForgeSection />

    <!-- 06 · 深度认知 -->
    <DeepInsightSection />

    <!-- 07 · 继续探索 -->
    <ContinueExploreSection />

    <!-- 08 · 本栏目文章（后台 navSection = understand 全部） -->
    <section class="py-30">
      <div class="container-wide">
        <div class="flex items-end justify-between mb-12">
          <div>
            <div class="text-sm font-mono text-gold-400">08 · 本栏目文章</div>
            <h2 class="mt-3 text-display-sm font-display font-medium text-ink-50">
              认知文章
            </h2>
            <p class="mt-3 text-sm text-ink-200 max-w-xl">
              后台「栏目归属 = 认知」的文章列表。可以是观点、洞察、趋势、研究、框架的任意组合。
            </p>
          </div>
          <RouterLink
            to="/understand/insights"
            class="hidden md:inline-block text-sm text-gold-400 hover:text-gold-300"
          >
            查看完整列表 →
          </RouterLink>
        </div>

        <div v-if="loading" class="py-12 text-center text-sm text-ink-200">加载中…</div>

        <div v-else-if="errorMsg" class="py-12 text-center text-sm text-red-400">⚠ {{ errorMsg }}</div>

        <div v-else-if="articles.length === 0" class="py-16 text-center text-sm text-ink-200">
          还没有发布「认知」栏目的文章。
          <span class="block mt-2 text-xs text-ink-300">
            去 <RouterLink to="/admin/articles" class="text-gold-400 hover:text-gold-300">后台 · 文章管理</RouterLink> 创建一个「栏目归属 = 认知」的文章并发布。
          </span>
        </div>

        <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <RouterLink
            v-for="(c, i) in articles"
            :key="c.id"
            :to="`/understand/${c.slug}`"
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal group card-base p-6"
            :style="{ transitionDelay: `${i * 60}ms` }"
          >
            <div class="font-mono text-xs text-ink-200">
              {{ CATEGORY_ZH[c.category] || c.category }}
            </div>
            <h3 class="mt-3 text-lg font-medium text-ink-50 group-hover:text-gold-300 transition-colors leading-snug">
              {{ c.title }}
            </h3>
            <p class="mt-3 text-sm text-ink-200 leading-relaxed line-clamp-3">
              {{ c.excerpt }}
            </p>
            <div class="mt-6 flex items-center justify-between border-t border-ink-800 pt-4 text-xs text-ink-200">
              <span>{{ (c.publishedAt || '').split('T')[0] }} · {{ c.readingTime || 5 }} 分钟阅读</span>
              <span class="text-gold-400 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
