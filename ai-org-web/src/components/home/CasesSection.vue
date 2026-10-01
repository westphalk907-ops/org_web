<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api, type CaseStudy } from '@/api/server'
import { useReveal } from '@/composables/useScroll'

const { observe } = useReveal()
const cases = ref<CaseStudy[]>([])
const loading = ref(true)

async function load() {
  try {
    cases.value = await api.listCases()
  } catch (e) {
    console.error('[CasesSection] 加载失败', e)
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="relative bg-ink-900 py-30">
    <div class="pointer-events-none absolute inset-0 bg-grid bg-grid-lg opacity-15" />

    <div class="container-wide relative">
      <div class="flex items-end justify-between mb-12">
        <SectionHeader
          eyebrow="06 · Cases"
          title="真实案例 · 真实改变"
          description="Before → Intervention → After → Next"
        />
        <BaseButton to="/cases" variant="ghost" class="hidden md:inline-flex">
          查看全部案例 →
        </BaseButton>
      </div>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <article
          v-for="(c, i) in cases"
          :key="c.id"
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal group overflow-hidden rounded-2xl border border-ink-700/80 bg-ink-950 transition-all duration-500 hover:border-gold-700/60 hover:shadow-card-hover hover:-translate-y-1"
          :style="{ transitionDelay: `${i * 100}ms` }"
        >
          <div class="p-8">
            <!-- 公司信息 -->
            <div class="flex items-center justify-between">
              <div class="font-mono text-xs text-gold-500/70">{{ c.industry }}</div>
              <span class="tag">{{ c.scale }}</span>
            </div>

            <h3 class="mt-4 text-xl font-display font-medium text-ink-50 group-hover:text-gold-300 transition-colors leading-snug">
              {{ c.title }}
            </h3>

            <!-- Before / After 流程 -->
            <div class="mt-8 space-y-4 text-sm">
              <div>
                <div class="font-mono text-xs text-ink-200">Before</div>
                <div class="mt-1 text-ink-100 leading-relaxed">{{ c.before }}</div>
              </div>
              <div class="flex items-center gap-2">
                <div class="h-px flex-1 bg-ink-700" />
                <span class="text-xs text-gold-400">→</span>
                <div class="h-px flex-1 bg-ink-700" />
              </div>
              <div>
                <div class="font-mono text-xs text-ink-200">After</div>
                <div class="mt-1 text-ink-100 leading-relaxed">{{ c.after }}</div>
              </div>
            </div>

            <!-- 指标 -->
            <div v-if="c.metrics" class="mt-8 grid grid-cols-3 gap-2 border-t border-ink-800 pt-6">
              <div v-for="m in c.metrics" :key="m.label" class="text-center">
                <div class="text-lg font-display font-medium text-gradient-gold">{{ m.value }}</div>
                <div class="mt-1 text-[10px] text-ink-200">{{ m.label }}</div>
              </div>
            </div>

            <!-- 引言 -->
            <blockquote v-if="c.testimonial" class="mt-6 border-l-2 border-gold-500 pl-4 italic text-sm text-ink-100">
              "{{ c.testimonial.quote }}"
              <div class="mt-2 text-xs text-ink-200 not-italic">— {{ c.testimonial.author }}, {{ c.testimonial.position }}</div>
            </blockquote>
          </div>

          <RouterLink
            :to="`/cases/${c.slug}`"
            class="block border-t border-ink-800 px-8 py-4 text-sm text-gold-400 transition-colors hover:bg-gold-500/5"
          >
            查看完整案例 →
          </RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>
