<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api, type Resource } from '@/api/server'
import { useReveal } from '@/composables/useScroll'

const { observe } = useReveal()
const resources = ref<Resource[]>([])
const loading = ref(true)

async function load() {
  try {
    resources.value = await api.listResources({ featured: true, limit: 4 })
  } catch (e) {
    console.error('[ResourcesSection] 加载失败', e)
  } finally {
    loading.value = false
  }
}

onMounted(load)

const TYPE_LABEL: Record<string, string> = {
  whitepaper: '白皮书',
  framework: '框架',
  playbook: 'Playbook',
  checklist: 'Checklist',
  research: '研究',
  case: '案例',
  insight: '洞察',
  tool: '工具',
  prompt: '提示词',
  skill: '技能',
  workflow: '工作流'
}

interface FeaturedCard {
  id: string
  type: string
  title: string
  description: string
  meta: string
  href: string
  tag: string
}

const cards = ref<FeaturedCard[]>([])

function mapToCards(rs: Resource[]): FeaturedCard[] {
  return rs.map((r) => ({
    id: r.id,
    type: r.type,
    title: r.title,
    description: r.summary,
    meta: r.fileSize || (r.pages ? `${r.pages} 页` : ''),
    href: `/resources/${r.slug}`,
    tag: r.isFeatured ? '精选资源' : (TYPE_LABEL[r.type] || r.type),
  }))
}

watch(resources, (rs) => {
  cards.value = mapToCards(rs)
}, { immediate: true })

import { watch } from 'vue'
</script>

<template>
  <section class="relative bg-ink-950 py-30">
    <div class="container-wide">
      <div class="flex items-end justify-between mb-12">
        <SectionHeader
          eyebrow="07 · Resources"
          title="可带走的内容资产"
          description="下载可用的报告、框架、Playbook 和 Checklist。"
        />
        <BaseButton to="/resources" variant="ghost" class="hidden md:inline-flex">
          浏览资料库 →
        </BaseButton>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <RouterLink
          v-for="(res, i) in cards"
          :key="res.id"
          :to="res.href"
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal group relative overflow-hidden rounded-2xl border border-ink-700/80 bg-gradient-to-b from-ink-900/40 to-ink-950 p-6 transition-all duration-500 hover:border-gold-700/60 hover:shadow-card-hover hover:-translate-y-1"
          :style="{ transitionDelay: `${i * 80}ms` }"
        >
          <div class="flex items-center justify-between">
            <span class="tag-gold">{{ res.tag }}</span>
            <span class="text-xs font-mono text-ink-200">{{ TYPE_LABEL[res.type] }}</span>
          </div>

          <h3 class="mt-8 text-base font-medium text-ink-50 group-hover:text-gold-300 transition-colors leading-snug min-h-12">
            {{ res.title }}
          </h3>

          <p class="mt-3 text-xs text-ink-200 leading-relaxed line-clamp-3">
            {{ res.description }}
          </p>

          <div class="mt-8 flex items-center justify-between border-t border-ink-800 pt-4">
            <span class="text-[10px] font-mono uppercase tracking-wider text-ink-200">{{ res.meta }}</span>
            <span class="text-gold-400 text-sm transition-transform group-hover:translate-y-1">↓</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
