<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useReveal } from '@/composables/useScroll'
import { api } from '@/api/server'

const { observe } = useReveal()

interface JudgmentItem {
  code: string
  label: string
  en: string
  desc: string
  href: string
  highlights: string[]
}

const items = ref<JudgmentItem[]>([])
const loading = ref(true)
const loadError = ref('')

async function load() {
  loading.value = true
  try {
    const cfg = await api.getHomeConfigs(['forgeJudgments'])
    items.value = (cfg.forgeJudgments as JudgmentItem[]) || []
  } catch (e: any) {
    loadError.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="relative bg-ink-900/40 py-24 lg:py-30 border-y border-ink-800">
    <div class="container-wide">

      <!-- Section header -->
      <div class="grid items-end gap-8 lg:grid-cols-12">
        <div class="lg:col-span-7">
          <div :ref="(el) => observe(el as HTMLElement)" class="reveal section-eyebrow">
            <span class="inline-block h-px w-8 bg-gold-500" />
            04 · Forge's Judgment
          </div>
          <h2
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal mt-3 section-title text-balance"
            style="transition-delay: 0.1s"
          >
            <span class="text-ink-50">FORGE 的</span>
            <span class="text-gradient-gold">判断</span>
          </h2>
        </div>
        <div class="lg:col-span-5">
          <p
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal text-base text-ink-200 leading-relaxed"
            style="transition-delay: 0.2s"
          >
            我们对 AI 组织变革的立场、框架与心智模型。
            它们不是一次性结论，而是会随着认知地图一起持续生长。
          </p>
        </div>
      </div>

      <!-- 4 类判断 -->
      <div v-if="loading" class="py-20 text-center text-sm text-ink-200">加载中…</div>
      <div v-else-if="loadError" class="py-20 text-center text-sm text-red-400">⚠ {{ loadError }}</div>
      <div v-else class="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">

        <RouterLink
          v-for="(j, i) in items"
          :key="j.code"
          :to="j.href"
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal group block"
          :style="{ transitionDelay: `${i * 80}ms` }"
        >
          <div class="relative h-full overflow-hidden rounded-xl border border-ink-700/60 bg-ink-950/60 p-7 transition-all duration-300 hover:border-gold-500/50 hover:bg-ink-900/70">
            <!-- 左侧色条 -->
            <div class="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-gold-500/0 via-gold-500/40 to-gold-500/0 opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-3">
                <!-- code 圆形标记 -->
                <div class="flex h-10 w-10 items-center justify-center rounded-full border border-gold-700/40 bg-gold-500/5 font-mono text-sm font-medium text-gold-300">
                  {{ j.code }}
                </div>
                <div>
                  <div class="text-base font-medium text-ink-50">{{ j.label }}</div>
                  <div class="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-200">{{ j.en }}</div>
                </div>
              </div>
              <span class="text-gold-400 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </div>

            <p class="mt-5 text-sm text-ink-100 leading-relaxed">
              {{ j.desc }}
            </p>

            <!-- 关键高亮（用点状列出） -->
            <ul class="mt-5 space-y-2 border-t border-ink-800 pt-5">
              <li
                v-for="h in j.highlights"
                :key="h"
                class="flex items-start gap-2.5 text-sm text-ink-200"
              >
                <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-500/70" />
                <span class="leading-relaxed">{{ h }}</span>
              </li>
            </ul>
          </div>
        </RouterLink>

      </div>

    </div>
  </section>
</template>
