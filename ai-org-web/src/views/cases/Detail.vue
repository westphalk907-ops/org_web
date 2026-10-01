<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api, type CaseStudy } from '@/api/server'

const route = useRoute()
const c = ref<CaseStudy | null>(null)
const loading = ref(false)
const loadError = ref('')

async function load() {
  const slug = route.params.slug as string
  loading.value = true
  loadError.value = ''
  try {
    c.value = await api.getCase(slug)
  } catch (e: any) {
    loadError.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => route.params.slug, load)
</script>

<template>
  <article class="py-20">
    <div v-if="loading" class="container-reading py-20 text-center text-sm text-ink-200">加载中…</div>
    <div v-else-if="loadError" class="container-reading py-20 text-center text-sm text-red-400">⚠ {{ loadError }}</div>
    <div v-else-if="!c" class="container-reading py-20 text-center text-sm text-ink-200">案例不存在</div>
    <template v-else>
      <div class="container-reading">
        <div class="text-sm font-mono text-gold-400">Case Study</div>
        <h1 class="mt-3 text-display-md font-display font-medium text-ink-50 text-balance">
          {{ c.title }}
        </h1>
        <div class="mt-4 flex items-center gap-3 text-sm text-ink-200">
          <span>{{ c.company }}</span>
          <span class="h-1 w-1 rounded-full bg-ink-700" />
          <span>{{ c.industry }}</span>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div class="card-base p-6">
            <div class="text-xs font-mono text-ink-200">Before</div>
            <p class="mt-3 text-sm text-ink-100 leading-relaxed">{{ c.before }}</p>
          </div>
          <div class="card-base p-6">
            <div class="text-xs font-mono text-gold-400">Intervention</div>
            <p class="mt-3 text-sm text-ink-100 leading-relaxed">{{ c.intervention }}</p>
          </div>
          <div class="card-base p-6">
            <div class="text-xs font-mono text-gold-400">After</div>
            <p class="mt-3 text-sm text-ink-100 leading-relaxed">{{ c.after }}</p>
          </div>
          <div class="card-base p-6">
            <div class="text-xs font-mono text-ink-200">Next</div>
            <p class="mt-3 text-sm text-ink-100 leading-relaxed">{{ c.next }}</p>
          </div>
        </div>
      </div>

      <div v-if="c.metrics" class="container-reading mt-12 grid grid-cols-3 gap-4 rounded-2xl border border-gold-700/30 bg-gold-500/5 p-8">
        <div v-for="m in c.metrics" :key="m.label" class="text-center">
          <div class="text-3xl font-display font-medium text-gradient-gold">{{ m.value }}</div>
          <div class="mt-2 text-xs text-ink-200">{{ m.label }}</div>
        </div>
      </div>

      <div class="mt-12 text-center">
        <BaseButton to="/contact" variant="primary" size="lg">咨询同类项目</BaseButton>
      </div>
    </template>
  </article>
</template>
