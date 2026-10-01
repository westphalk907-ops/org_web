<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useReveal } from '@/composables/useScroll'
import { api } from '@/api/server'

const { observe } = useReveal()

interface ExploreEntry {
  label: string
  en: string
  desc: string
  href: string
}

const items = ref<ExploreEntry[]>([])
const loading = ref(true)
const loadError = ref('')

async function load() {
  loading.value = true
  try {
    const cfg = await api.getHomeConfigs(['exploreEntries'])
    items.value = (cfg.exploreEntries as ExploreEntry[]) || []
  } catch (e: any) {
    loadError.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="relative bg-ink-950 py-24 lg:py-30">
    <div class="container-wide">

      <!-- Header -->
      <div :ref="(el) => observe(el as HTMLElement)" class="reveal text-center max-w-2xl mx-auto">
        <div class="section-eyebrow justify-center">
          <span class="inline-block h-px w-8 bg-gold-500" />
          07 · Continue Exploring
          <span class="inline-block h-px w-8 bg-gold-500" />
        </div>
        <h2 class="section-title text-balance">
          <span class="text-ink-50">继续</span>
          <span class="text-gradient-gold">探索</span>
        </h2>
        <p class="mt-5 text-base text-ink-200 leading-relaxed">
          从认知，到学习、体验、资源，再到具体解决方案。<br />
          沿着地图继续往下走。
        </p>
      </div>

      <!-- 4 个入口 -->
      <div v-if="loading" class="py-12 text-center text-sm text-ink-200">加载中…</div>
      <div v-else-if="loadError" class="py-12 text-center text-sm text-red-400">⚠ {{ loadError }}</div>
      <div v-else class="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <RouterLink
          v-for="(entry, i) in items"
          :key="entry.label"
          :to="entry.href"
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal group relative block"
          :style="{ transitionDelay: `${i * 70}ms` }"
        >
          <div class="relative h-full overflow-hidden rounded-xl border border-ink-700/60 bg-gradient-to-br from-ink-900 to-ink-950 p-7 transition-all duration-300 hover:border-gold-500/50 hover:bg-ink-900/70">

            <div class="relative">
              <div class="font-mono text-[10px] uppercase tracking-[0.3em] text-gold-500">
                0{{ i + 1 }}
              </div>

              <h3 class="mt-5 text-2xl font-display font-medium text-ink-50">
                {{ entry.label }}
              </h3>
              <div class="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-200 mt-1">
                {{ entry.en }}
              </div>

              <p class="mt-5 text-sm text-ink-200 leading-relaxed pr-8">
                {{ entry.desc }}
              </p>

              <div class="mt-7 inline-flex items-center gap-1.5 text-xs font-medium text-gold-400 transition-all duration-300 group-hover:translate-x-1">
                <span>进入</span>
                <span>→</span>
              </div>
            </div>

          </div>
        </RouterLink>

      </div>

      <!-- 结尾一句 -->
      <div
        :ref="(el) => observe(el as HTMLElement)"
        class="reveal mt-20 text-center"
      >
        <p class="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-200">
          持续观察 AI 的变化
        </p>
        <p class="mt-3 font-display text-xl lg:text-2xl font-light text-balance text-ink-100">
          <span class="text-gold-300">系统理解</span>组织的变化
        </p>
      </div>

    </div>
  </section>
</template>
