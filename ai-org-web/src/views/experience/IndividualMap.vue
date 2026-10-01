<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useExperience } from '@/composables/useExperience'

const { currentMap, stages, loading, error: loadError, loadMap } = useExperience()

const activeId = ref<string>('')
const active = computed(() => stages.value.find((s) => s.id === activeId.value) ?? null)

async function load() {
  await loadMap('INDIVIDUAL')
  if (stages.value[0]) activeId.value = stages.value[0].id
}

onMounted(load)
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
          从感知者到架构师，<br />
          <span class="text-gradient-gold">{{ currentMap?.subtitle }}</span>
        </h1>
        <p class="mt-4 text-base text-ink-200">{{ currentMap?.heroDesc }}</p>
      </div>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- 阶段列表 -->
        <div class="lg:col-span-1">
          <div class="space-y-2">
            <button
              v-for="node in stages"
              :key="node.id"
              type="button"
              class="group flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-all"
              :class="
                activeId === node.id
                  ? 'border-gold-500 bg-gold-500/5'
                  : 'border-ink-700 bg-ink-900 hover:border-gold-700/40'
              "
              @click="activeId = node.id"
            >
              <div
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs"
                :class="
                  activeId === node.id
                    ? 'border-gold-500 text-gold-400'
                    : 'border-ink-700 text-ink-200'
                "
              >
                {{ node.stage }}
              </div>
              <div>
                <div
                  class="text-sm font-medium"
                  :class="activeId === node.id ? 'text-gold-300' : 'text-ink-50'"
                >
                  {{ node.title }}
                </div>
                <div class="mt-1 text-xs text-ink-200 line-clamp-2">
                  {{ node.description }}
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- 详情 -->
        <div class="lg:col-span-2" v-if="active">
          <div class="rounded-2xl border border-ink-700 bg-ink-900 p-8 lg:p-10">
            <div class="font-mono text-xs text-gold-400">Stage {{ active.stage }}</div>
            <h2 class="mt-3 text-3xl font-display font-medium text-ink-50">
              {{ active.title }}
            </h2>
            <p class="mt-3 text-base text-ink-200">{{ active.description }}</p>

            <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <div class="section-eyebrow">特征</div>
                <ul class="mt-3 space-y-2 text-sm text-ink-100">
                  <li v-for="(c, i) in active.characteristics" :key="i" class="flex gap-2">
                    <span class="text-gold-400">·</span>
                    <span>{{ c }}</span>
                  </li>
                </ul>
              </div>

              <div>
                <div class="section-eyebrow">痛点</div>
                <ul class="mt-3 space-y-2 text-sm text-ink-100">
                  <li v-for="(p, i) in active.painPoints" :key="i" class="flex gap-2">
                    <span class="text-gold-400">·</span>
                    <span>{{ p }}</span>
                  </li>
                </ul>
              </div>

              <div class="md:col-span-2">
                <div class="section-eyebrow">关键动作</div>
                <ul class="mt-3 space-y-2 text-sm text-ink-100">
                  <li v-for="(a, i) in active.actions" :key="i" class="flex gap-2">
                    <span class="text-gold-400">→</span>
                    <span>{{ a }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      </template>
    </div>
  </section>
</template>