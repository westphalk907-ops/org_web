<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useReveal } from '@/composables/useScroll'
import { api } from '@/api/server'
const { observe } = useReveal()

interface MethodologyStage {
  id: string
  title: string
  desc: string
}

const stages = ref<MethodologyStage[]>([])
const loading = ref(true)
const loadError = ref('')

async function load() {
  loading.value = true
  try {
    const cfg = await api.getHomeConfigs(['methodology'])
    stages.value = (cfg.methodology as MethodologyStage[]) || []
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
    <div class="pointer-events-none absolute inset-0 bg-grid bg-grid-lg opacity-30" />

    <div class="container-wide relative">
      <SectionHeader
        eyebrow="05 · Methodology"
        title="AI 个体 → AI 组织"
        description="个体能力是起点，工作流是落点，组织设计决定规模化。"
      />

      <div v-if="loading" class="py-12 text-center text-sm text-ink-200">加载中…</div>
      <div v-else-if="loadError" class="py-12 text-center text-sm text-red-400">⚠ {{ loadError }}</div>
      <div v-else class="relative">
        <!-- 连接线 -->
        <div class="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent lg:block" />

        <div class="grid grid-cols-2 gap-6 lg:grid-cols-5">
          <div
            v-for="(stage, i) in stages"
            :key="stage.id"
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal group relative"
            :style="{ transitionDelay: `${i * 100}ms` }"
          >
            <div class="relative rounded-2xl border border-ink-700/80 bg-gradient-to-b from-ink-900/60 to-ink-950 p-6 text-center backdrop-blur transition-all duration-500 group-hover:border-gold-700/60 group-hover:-translate-y-1 group-hover:shadow-card-hover">
              <div class="font-mono text-xs text-gold-500/70">0{{ i + 1 }}</div>
              <div class="mt-3 text-2xl font-display font-medium text-gradient-gold">
                {{ stage.title }}
              </div>
              <div class="mt-2 text-xs text-ink-200 leading-relaxed">{{ stage.desc }}</div>

              <!-- 节点 -->
              <div class="absolute -bottom-1.5 left-1/2 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-gold-500 ring-4 ring-ink-950 lg:block transition-transform group-hover:scale-125" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
