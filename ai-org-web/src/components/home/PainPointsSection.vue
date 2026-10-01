<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useReveal } from '@/composables/useScroll'
import { api } from '@/api/server'
const { observe } = useReveal()

interface PainPoint {
  id: string
  title: string
  description: string
  icon: string
  href: string
}

const items = ref<PainPoint[]>([])
const loading = ref(true)
const loadError = ref('')

const ICON_MAP: Record<string, string> = {
  user: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  workflow: 'M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 3h2v-2h-2v2zm0-3h2V8h-2v6z',
  organization: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  compass: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm0-14l-2 6 6-2-6-2z'
}

async function load() {
  loading.value = true
  try {
    const cfg = await api.getHomeConfigs(['painPoints'])
    items.value = (cfg.painPoints as PainPoint[]) || []
  } catch (e: any) {
    loadError.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="relative bg-ink-950 py-30">
    <div class="container-wide">
      <SectionHeader
        eyebrow="01 · Pain Points"
        title="你现在遇到哪一个问题？"
        description="不解决真问题，就没有真正的 AI 组织变革。"
      />

      <div v-if="loading" class="py-12 text-center text-sm text-ink-200">加载中…</div>
      <div v-else-if="loadError" class="py-12 text-center text-sm text-red-400">⚠ {{ loadError }}</div>
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <RouterLink
          v-for="(item, i) in items"
          :key="item.id"
          :to="item.href"
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal group relative overflow-hidden rounded-2xl border border-ink-700/80 bg-gradient-to-b from-ink-900/80 to-ink-950 p-8 backdrop-blur transition-all duration-500 hover:border-gold-700/50 hover:-translate-y-1 hover:shadow-card-hover"
          :style="{ transitionDelay: `${i * 80}ms` }"
        >
          <!-- 序号 -->
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs text-gold-500/70">0{{ i + 1 }}</span>
            <span class="h-px flex-1 ml-4 bg-ink-800" />
          </div>

          <!-- 图标 -->
          <div class="mt-8 mb-8 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-gold-700/30 bg-gradient-to-br from-gold-500/10 to-transparent">
            <svg viewBox="0 0 24 24" class="h-6 w-6 text-gold-400" fill="currentColor">
              <path :d="ICON_MAP[item.icon]" />
            </svg>
          </div>

          <!-- 标题 -->
          <h3 class="text-lg font-medium text-ink-50 group-hover:text-gold-300 transition-colors leading-snug">
            {{ item.title }}
          </h3>

          <!-- 描述 -->
          <p class="mt-3 text-sm text-ink-200 leading-relaxed">
            {{ item.description }}
          </p>

          <!-- 箭头 -->
          <div class="mt-10 flex items-center text-sm text-gold-400 transition-transform group-hover:translate-x-1">
            <span>探索解决方案</span>
            <span class="ml-2">→</span>
          </div>

          <!-- 装饰光晕 -->
          <div class="absolute -right-16 -bottom-16 h-40 w-40 rounded-full bg-gold-500/0 blur-3xl transition-all duration-500 group-hover:bg-gold-500/10" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>
