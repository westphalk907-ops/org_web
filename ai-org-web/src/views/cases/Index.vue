<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api, type CaseStudy } from '@/api/server'
import SubPageHero from '@/components/layout/SubPageHero.vue'

const cases = ref<CaseStudy[]>([])
const loading = ref(false)
const loadError = ref('')

async function load() {
  loading.value = true
  loadError.value = ''
  try {
    cases.value = await api.listCases()
  } catch (e: any) {
    loadError.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <SubPageHero
      eyebrow="Cases · 案例"
      subtitle="从意识到行动，每一个改变都可被看见。"
    >
      <template #title>
        真实案例 · <span class="text-gradient-gold">真实改变</span>
      </template>
    </SubPageHero>

    <section class="py-30">
      <div class="container-wide space-y-12">
        <div v-if="loading" class="py-20 text-center text-sm text-ink-200">加载中…</div>
        <div v-else-if="loadError" class="py-20 text-center text-sm text-red-400">⚠ {{ loadError }}</div>
        <div v-else-if="cases.length === 0" class="py-20 text-center text-sm text-ink-200">暂无案例</div>
        <template v-else>
          <article
            v-for="c in cases"
            :key="c.id"
            class="rounded-2xl border border-ink-700 bg-ink-900 overflow-hidden"
          >
          <div class="grid grid-cols-1 gap-0 lg:grid-cols-12">
            <div class="lg:col-span-4 bg-gradient-to-br from-ink-950 to-gold-500/5 p-10 border-b border-ink-800 lg:border-b-0 lg:border-r">
              <div class="font-mono text-xs text-ink-200">{{ c.industry }}</div>
              <div class="mt-2 text-sm text-gold-400">{{ c.scale }}</div>
              <h2 class="mt-6 text-2xl font-display font-medium text-ink-50">{{ c.title }}</h2>
              <div class="mt-4 text-sm text-ink-200">{{ c.company }}</div>
            </div>

            <div class="lg:col-span-8 p-10">
              <div class="space-y-6">
                <div>
                  <div class="text-xs font-mono text-ink-200 uppercase tracking-wider">Before</div>
                  <p class="mt-2 text-base text-ink-100">{{ c.before }}</p>
                </div>
                <div>
                  <div class="text-xs font-mono text-gold-400 uppercase tracking-wider">Intervention</div>
                  <p class="mt-2 text-base text-ink-100">{{ c.intervention }}</p>
                </div>
                <div>
                  <div class="text-xs font-mono text-gold-400 uppercase tracking-wider">After</div>
                  <p class="mt-2 text-base text-ink-100">{{ c.after }}</p>
                </div>
                <div>
                  <div class="text-xs font-mono text-ink-200 uppercase tracking-wider">Next</div>
                  <p class="mt-2 text-base text-ink-100">{{ c.next }}</p>
                </div>
              </div>

              <div v-if="c.metrics" class="mt-8 grid grid-cols-3 gap-4 border-t border-ink-800 pt-6">
                <div v-for="m in c.metrics" :key="m.label" class="text-center">
                  <div class="text-2xl font-display font-medium text-gradient-gold">{{ m.value }}</div>
                  <div class="mt-1 text-xs text-ink-200">{{ m.label }}</div>
                </div>
              </div>

              <blockquote v-if="c.testimonial" class="mt-6 border-l-2 border-gold-500 pl-4 italic text-sm text-ink-100">
                "{{ c.testimonial.quote }}"
                <div class="mt-2 text-xs text-ink-200 not-italic">— {{ c.testimonial.author }}, {{ c.testimonial.position }}</div>
              </blockquote>
            </div>
          </div>
        </article>
        </template>
      </div>
    </section>
  </div>
</template>
