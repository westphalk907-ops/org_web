<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useReveal } from '@/composables/useScroll'
import SubPageHero from '@/components/layout/SubPageHero.vue'
import { api, type Content } from '@/api/server'

const { observe } = useReveal()

const SUBNAV = [
  { label: '框架', href: '/learn/frameworks' },
  { label: '行动手册', href: '/learn/playbooks' },
  { label: '白皮书', href: '/learn/whitepapers' }
]

const items = ref<Content[]>([])
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

const CATEGORY_EN: Record<string, string> = {
  framework: 'Framework',
  playbook: 'Playbook',
  whitepaper: 'Whitepaper',
  insight: 'Insight',
  research: 'Research',
  trend: 'Trend',
  point_of_view: 'Point of View',
  field_note: 'Field Note',
}

async function load() {
  loading.value = true
  errorMsg.value = ''
  try {
    // 只拉 navSection = learn 的文章（后台统一管理）
    const list = await api.listContents({ navSection: 'learn', limit: 60 })
    items.value = list
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
    <SubPageHero
      eyebrow="Learn · 学习"
      subtitle="框架、行动手册、白皮书。建立你的 AI 组织知识体系。"
    >
      <template #title>
        从认知到方法，<br />
        <span class="text-gradient-gold">系统化的 AI 组织方法论</span>
      </template>
    </SubPageHero>

    <section class="sticky top-16 z-30 border-y border-ink-800 bg-ink-950/80 backdrop-blur">
      <div class="container-wide flex gap-1 overflow-x-auto py-3">
        <RouterLink
          v-for="s in SUBNAV"
          :key="s.href"
          :to="s.href"
          class="whitespace-nowrap rounded px-4 py-1.5 text-sm text-ink-100 transition-colors hover:text-gold-300"
          active-class="text-gold-400 bg-gold-500/5"
        >
          {{ s.label }}
        </RouterLink>
      </div>
    </section>

    <section class="py-30">
      <div class="container-wide">

        <div v-if="loading" class="py-12 text-center text-sm text-ink-200">加载中…</div>

        <div v-else-if="errorMsg" class="py-12 text-center text-sm text-red-400">⚠ {{ errorMsg }}</div>

        <div v-else-if="items.length === 0" class="py-16 text-center text-sm text-ink-200">
          还没有发布的学习内容。
          <span class="block mt-2 text-xs text-ink-300">
            去 <RouterLink to="/admin/articles" class="text-gold-400 hover:text-gold-300">后台 · 文章管理</RouterLink> 创建一个「栏目归属=学习」的文章并发布。
          </span>
        </div>

        <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <RouterLink
            v-for="(c, i) in items"
            :key="c.id"
            :to="`/learn/${c.slug}`"
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal group card-base p-6"
            :style="{ transitionDelay: `${i * 60}ms` }"
          >
            <div class="font-mono text-xs text-ink-200">
              {{ CATEGORY_EN[c.category] || c.category }} ·
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
