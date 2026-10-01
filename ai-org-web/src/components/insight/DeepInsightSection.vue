<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useReveal } from '@/composables/useScroll'
import { api } from '@/api/server'

const { observe } = useReveal()

interface DeepInsight {
  code: string
  category: string
  title: string
  summary: string
  readTime: string
  href: string
  accent: 'gold' | 'ember' | 'jade'
}

const items = ref<DeepInsight[]>([])
const loading = ref(true)
const loadError = ref('')

async function load() {
  loading.value = true
  try {
    const cfg = await api.getHomeConfigs(['deepInsights'])
    items.value = (cfg.deepInsights as DeepInsight[]) || []
  } catch (e: any) {
    loadError.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)

/** 不同 accent 类型的样式映射 */
const accentStyles: Record<string, { dot: string; badge: string }> = {
  gold: {
    dot: 'bg-gold-500',
    badge: 'border-gold-700/40 bg-gold-500/10 text-gold-300'
  },
  ember: {
    dot: 'bg-accent-ember',
    badge: 'border-accent-ember/40 bg-accent-ember/10 text-accent-ember'
  },
  jade: {
    dot: 'bg-accent-jade',
    badge: 'border-accent-jade/40 bg-accent-jade/10 text-accent-jade'
  }
}
</script>

<template>
  <section class="relative bg-ink-900/40 py-24 lg:py-30 border-y border-ink-800">
    <div class="container-wide">

      <!-- Header -->
      <div class="grid items-end gap-8 lg:grid-cols-12">
        <div class="lg:col-span-7">
          <div :ref="(el) => observe(el as HTMLElement)" class="reveal section-eyebrow">
            <span class="inline-block h-px w-8 bg-gold-500" />
            06 · Deep Insight
          </div>
          <h2
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal mt-3 section-title text-balance"
            style="transition-delay: 0.1s"
          >
            <span class="text-ink-50">深度</span>
            <span class="text-gradient-gold">认知</span>
          </h2>
        </div>
        <div class="lg:col-span-5">
          <p
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal text-base text-ink-200 leading-relaxed"
            style="transition-delay: 0.2s"
          >
            研究 · 专题 · 数据分析。<br />
            这些内容长期有效，会反复回到认知地图中作为锚点。
          </p>
        </div>
      </div>

      <!-- 卡片网格：3 列 / 1 列堆叠 -->
      <div v-if="loading" class="py-20 text-center text-sm text-ink-200">加载中…</div>
      <div v-else-if="loadError" class="py-20 text-center text-sm text-red-400">⚠ {{ loadError }}</div>
      <div v-else class="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">

        <RouterLink
          v-for="(d, i) in items"
          :key="d.code"
          :to="d.href"
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal group flex flex-col"
          :style="{ transitionDelay: `${i * 100}ms` }"
        >
          <div class="relative h-full overflow-hidden rounded-xl border border-ink-700/60 bg-ink-950/60 p-7 transition-all duration-300 hover:border-gold-500/40 hover:bg-ink-900/70">

            <!-- 顶部 meta 行 -->
            <div class="flex items-center justify-between">
              <span
                class="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] font-semibold"
                :class="accentStyles[d.accent].badge"
              >
                <span
                  class="h-1 w-1 rounded-full"
                  :class="accentStyles[d.accent].dot"
                />
                {{ d.category }}
              </span>
              <span class="font-mono text-[10px] tracking-[0.2em] text-ink-200">
                {{ d.code }}
              </span>
            </div>

            <!-- 标题 -->
            <h3 class="mt-7 text-lg lg:text-xl font-medium text-ink-50 leading-snug group-hover:text-gold-300 transition-colors text-balance">
              {{ d.title }}
            </h3>

            <!-- 摘要 -->
            <p class="mt-4 text-sm text-ink-200 leading-relaxed flex-1">
              {{ d.summary }}
            </p>

            <!-- 底部 -->
            <div class="mt-7 flex items-center justify-between border-t border-ink-800 pt-4 text-xs">
              <span class="font-mono text-ink-200">{{ d.readTime }} read</span>
              <span class="text-gold-400 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>
        </RouterLink>

      </div>

      <!-- 底部入口 -->
      <div
        :ref="(el) => observe(el as HTMLElement)"
        class="reveal mt-12 flex flex-wrap items-center justify-center gap-3 text-sm"
      >
        <RouterLink
          to="/understand/research"
          class="inline-flex items-center gap-1.5 text-ink-100 transition-colors hover:text-gold-300"
        >
          <span>Research</span>
          <span class="text-gold-500/60">→</span>
        </RouterLink>
        <span class="h-3 w-px bg-ink-700" />
        <RouterLink
          to="/understand/insights"
          class="inline-flex items-center gap-1.5 text-ink-100 transition-colors hover:text-gold-300"
        >
          <span>Insights</span>
          <span class="text-gold-500/60">→</span>
        </RouterLink>
        <span class="h-3 w-px bg-ink-700" />
        <RouterLink
          to="/understand/trends"
          class="inline-flex items-center gap-1.5 text-ink-100 transition-colors hover:text-gold-300"
        >
          <span>Trends</span>
          <span class="text-gold-500/60">→</span>
        </RouterLink>
      </div>

    </div>
  </section>
</template>
