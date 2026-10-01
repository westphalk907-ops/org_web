<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useExperience } from '@/composables/useExperience'

const { currentMap, stages, loading, error: loadError, loadMap } = useExperience()

const activeId = ref<string>('')
const active = computed(() => stages.value.find((s) => s.id === activeId.value) ?? null)

async function load() {
  await loadMap('WORKFLOW')
  if (stages.value[0]) activeId.value = stages.value[0].id
}

onMounted(load)

const INDUSTRY_LABEL: Record<string, string> = {
  sales: '销售',
  marketing: '市场',
  hr: 'HR',
  service: '客服',
  management: '管理'
}
</script>

<template>
  <section class="relative overflow-hidden bg-ink-950 pt-20 pb-30">
    <div class="pointer-events-none absolute inset-0 bg-grid bg-grid-lg opacity-20" />

    <div class="container-wide relative">
      <div v-if="loading" class="py-20 text-center text-sm text-ink-200">加载中…</div>
      <div v-else-if="loadError" class="py-20 text-center text-sm text-red-400">⚠ {{ loadError }}</div>
      <template v-else>
      <div class="max-w-3xl mb-12">
        <div class="section-eyebrow">{{ currentMap?.title }}</div>
        <h1 class="mt-4 text-display-md font-display font-medium text-balance">
          看见<br />
          <span class="text-gradient-gold">{{ currentMap?.subtitle }}</span>
        </h1>
        <p class="mt-4 text-base text-ink-200">{{ currentMap?.heroDesc }}</p>
      </div>

      <!-- 场景选择 -->
      <div class="mb-12 flex flex-wrap gap-2">
        <button
          v-for="s in stages"
          :key="s.id"
          type="button"
          class="rounded-full border px-5 py-2 text-sm transition-all"
          :class="
            activeId === s.id
              ? 'border-gold-500 bg-gold-500/10 text-gold-300'
              : 'border-ink-700 bg-ink-900 text-ink-100 hover:border-gold-700/40'
          "
          @click="activeId = s.id"
        >
          {{ INDUSTRY_LABEL[s.details?.industry || ''] || '场景' }} · {{ s.title }}
        </button>
      </div>

      <!-- 描述 -->
      <div v-if="active" class="mb-8 max-w-2xl text-base text-ink-200">
        {{ active.description }}
      </div>

      <!-- 对比 -->
      <div v-if="active?.details" class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- 传统 -->
        <div class="rounded-2xl border border-ink-700 bg-ink-900 p-8">
          <div class="flex items-center justify-between">
            <div class="section-eyebrow">传统工作方式</div>
            <span class="font-mono text-2xl text-ink-200">{{ active.details.traditional?.duration }}</span>
          </div>

          <div v-if="active.details.traditional" class="mt-6 space-y-3">
            <div
              v-for="(s, i) in active.details.traditional.steps"
              :key="i"
              class="flex items-start gap-3 rounded-lg border border-ink-800 bg-ink-950 p-4"
            >
              <div class="font-mono text-xs text-ink-200 mt-0.5">{{ String(i + 1).padStart(2, '0') }}</div>
              <div class="flex-1">
                <div class="text-xs text-ink-200">{{ s.role }}</div>
                <div class="mt-1 text-sm text-ink-50">{{ s.action }}</div>
              </div>
              <div class="font-mono text-xs text-ink-200">{{ s.duration }}</div>
            </div>
          </div>

          <div v-if="active.details.traditional" class="mt-6 rounded-lg border border-ink-800 bg-ink-950 p-4 text-sm text-ink-200">
            <span class="text-ink-100">产出：</span>{{ active.details.traditional.output }}
          </div>
        </div>

        <!-- AI -->
        <div class="rounded-2xl border border-gold-700/30 bg-gradient-to-br from-ink-900 to-gold-500/5 p-8">
          <div class="flex items-center justify-between">
            <div class="section-eyebrow text-gold-400">AI 工作方式</div>
            <span class="font-mono text-2xl text-gradient-gold">{{ active.details.aiEnabled?.duration }}</span>
          </div>

          <div v-if="active.details.aiEnabled" class="mt-6 space-y-3">
            <div
              v-for="(s, i) in active.details.aiEnabled.steps"
              :key="i"
              class="flex items-start gap-3 rounded-lg border border-gold-700/20 bg-ink-950 p-4"
            >
              <div class="font-mono text-xs text-gold-400 mt-0.5">{{ String(i + 1).padStart(2, '0') }}</div>
              <div class="flex-1">
                <div class="text-xs text-gold-400">{{ s.role }}</div>
                <div class="mt-1 text-sm text-ink-50">{{ s.action }}</div>
                <div v-if="s.aiCapability" class="mt-2 text-xs text-ink-200">
                  ✦ {{ s.aiCapability }}
                </div>
              </div>
              <div class="font-mono text-xs text-gold-400">{{ s.duration }}</div>
            </div>
          </div>

          <div v-if="active.details.aiEnabled" class="mt-6 rounded-lg border border-gold-700/20 bg-gold-500/5 p-4 text-sm text-ink-100">
            <span class="text-gold-300">产出：</span>{{ active.details.aiEnabled.output }}
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-12 text-center">
        <BaseButton to="/contact" variant="primary" size="lg">
          想要改造你的工作流？预约咨询 →
        </BaseButton>
      </div>
      </template>
    </div>
  </section>
</template>