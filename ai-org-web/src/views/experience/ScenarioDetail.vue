<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReveal } from '@/composables/useScroll'
import { api, type Scenario, type Resource } from '@/api/server'
import { SCENARIO_CATEGORIES } from '@/data/scenarios'
import OwnerContactModal from '@/components/layout/OwnerContactModal.vue'

const route = useRoute()
const router = useRouter()
const { observe } = useReveal()

const scenario = ref<Scenario | null>(null)
const relatedResources = ref<Resource[]>([])
const loading = ref(false)
const errorMsg = ref('')
const showContact = ref(false)

const categoryMeta = computed(() => {
  if (!scenario.value) return null
  return SCENARIO_CATEGORIES.find((c) => c.value === scenario.value!.category)
})

const promptCopiedIdx = ref<number | null>(null)

async function load(slug: string) {
  loading.value = true
  errorMsg.value = ''
  scenario.value = null
  relatedResources.value = []
  try {
    scenario.value = await api.getScenario(slug)
    // 加载关联资料
    if (scenario.value.resourceSlugs.length > 0) {
      try {
        const results = await Promise.all(
          scenario.value.resourceSlugs.map((s) => api.getResource(s).catch(() => null))
        )
        relatedResources.value = results.filter((r): r is Resource => r !== null)
      } catch {
        // 关联资料失败不影响主流程
      }
    }
  } catch (e: any) {
    errorMsg.value = e?.message ?? '加载失败'
  } finally {
    loading.value = false
  }
}

async function copyPrompt(text: string, idx: number) {
  try {
    await navigator.clipboard.writeText(text)
    promptCopiedIdx.value = idx
    setTimeout(() => (promptCopiedIdx.value = null), 1500)
  } catch {
    alert('复制失败,请手动选中复制')
  }
}

onMounted(() => load(String(route.params.slug)))
watch(
  () => route.params.slug,
  (slug) => slug && load(String(slug))
)
</script>

<template>
  <section class="bg-ink-950 py-16 lg:py-24">
    <div class="container-wide">
      <button
        type="button"
        class="text-xs text-ink-200 hover:text-gold-300"
        @click="router.push('/experience')"
      >
        ← 返回体验区
      </button>

      <div v-if="loading" class="mt-20 text-center text-sm text-ink-200">加载中…</div>
      <div v-else-if="errorMsg" class="mt-20 text-center text-sm text-red-400">⚠ {{ errorMsg }}</div>
      <template v-else-if="scenario">
        <!-- 头部 -->
        <div class="mt-6 max-w-3xl">
          <div class="flex items-center gap-3 text-sm text-ink-200">
            <span class="text-2xl">{{ scenario.icon || '✨' }}</span>
            <span class="rounded-full border border-gold-700/40 px-3 py-0.5 font-mono text-xs text-gold-400">
              {{ categoryMeta?.label }}
            </span>
          </div>
          <h1 class="mt-5 text-display-md font-display font-medium text-balance text-ink-50">
            {{ scenario.title }}
          </h1>
          <p v-if="scenario.subtitle" class="mt-4 text-lg text-ink-200">
            {{ scenario.subtitle }}
          </p>
          <p v-if="scenario.heroDesc" class="mt-4 text-base text-ink-200 leading-relaxed">
            {{ scenario.heroDesc }}
          </p>
        </div>

        <!-- 痛点 -->
        <div :ref="(el) => observe(el as HTMLElement)" class="reveal mt-12 rounded-2xl border border-ink-700 bg-ink-900 p-8 lg:p-10">
          <div class="section-eyebrow">这个场景在解决什么</div>
          <p class="mt-4 text-lg leading-relaxed text-ink-100">
            {{ scenario.problem }}
          </p>
        </div>

        <!-- 传统 vs AI 对比 -->
        <div class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div :ref="(el) => observe(el as HTMLElement)" class="reveal rounded-2xl border border-ink-700 bg-ink-900 p-8">
            <div class="flex items-center justify-between">
              <div class="section-eyebrow">传统做法</div>
              <span class="font-mono text-sm text-ink-200">耗时 / 易出错</span>
            </div>
            <ol class="mt-6 space-y-3">
              <li
                v-for="(step, i) in scenario.beforeSteps"
                :key="i"
                class="flex items-start gap-3 rounded-lg border border-ink-800 bg-ink-950 p-4"
              >
                <span class="font-mono text-xs text-ink-200 mt-0.5">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="flex-1 text-sm text-ink-100">{{ step }}</span>
              </li>
            </ol>
          </div>

          <div :ref="(el) => observe(el as HTMLElement)" class="reveal rounded-2xl border border-gold-700/30 bg-gradient-to-br from-ink-900 to-gold-500/5 p-8">
            <div class="flex items-center justify-between">
              <div class="section-eyebrow text-gold-400">AI 做法</div>
              <span class="font-mono text-sm text-gradient-gold">效率 × 数倍</span>
            </div>
            <ol class="mt-6 space-y-3">
              <li
                v-for="(step, i) in scenario.afterSteps"
                :key="i"
                class="flex items-start gap-3 rounded-lg border border-gold-700/20 bg-ink-950 p-4"
              >
                <span class="font-mono text-xs text-gold-400 mt-0.5">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="flex-1 text-sm text-ink-50">{{ step }}</span>
              </li>
            </ol>
          </div>
        </div>

        <!-- Prompt / Skill -->
        <div v-if="scenario.prompts.length > 0" :ref="(el) => observe(el as HTMLElement)" class="reveal mt-10 rounded-2xl border border-ink-700 bg-ink-900 p-8">
          <div class="section-eyebrow">可复用 Prompt</div>
          <p class="mt-3 text-sm text-ink-200">
            复制下方 Prompt,在 ChatGPT / Claude / 国内大模型 中粘贴使用。
          </p>
          <div class="mt-6 space-y-4">
            <div
              v-for="(p, i) in scenario.prompts"
              :key="i"
              class="relative rounded-lg border border-ink-700 bg-ink-950 p-5"
            >
              <button
                type="button"
                class="absolute right-3 top-3 rounded border border-gold-700/40 px-3 py-1 text-xs text-gold-400 hover:bg-gold-500/10"
                @click="copyPrompt(p, i)"
              >
                {{ promptCopiedIdx === i ? '已复制 ✓' : '复制' }}
              </button>
              <pre class="overflow-x-auto whitespace-pre-wrap pr-16 font-mono text-xs leading-relaxed text-ink-100">{{ p }}</pre>
            </div>
          </div>
        </div>

        <!-- 关联资料 -->
        <div v-if="relatedResources.length > 0" :ref="(el) => observe(el as HTMLElement)" class="reveal mt-10">
          <div class="section-eyebrow">相关资料</div>
          <div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <RouterLink
              v-for="r in relatedResources"
              :key="r.id"
              :to="`/resources/${r.slug}`"
              class="group rounded-xl border border-ink-700 bg-ink-900 p-5 transition-all hover:border-gold-700/40"
            >
              <div class="text-xs font-mono text-gold-400">{{ r.type }}</div>
              <div class="mt-2 text-base text-ink-50 group-hover:text-gold-300">{{ r.title }}</div>
              <div class="mt-2 line-clamp-2 text-sm text-ink-200">{{ r.summary }}</div>
            </RouterLink>
          </div>
        </div>

        <!-- 加微信 CTA -->
        <div v-if="scenario.ownerContactEnabled" :ref="(el) => observe(el as HTMLElement)" class="reveal mt-16 overflow-hidden rounded-2xl border border-gold-700/30 bg-gradient-to-br from-ink-900 to-gold-500/5 p-8 lg:p-12">
          <div class="grid items-center gap-8 lg:grid-cols-12">
            <div class="lg:col-span-7">
              <div class="font-mono text-xs text-gold-400">想跑一遍这个场景？</div>
              <h3 class="mt-3 text-3xl font-display font-medium text-ink-50">
                加 Owner 微信 · 领完整实战包
              </h3>
              <p class="mt-3 text-base text-ink-200">
                备注「{{ scenario.title }}」,我会一对一拉你进实战群,送上完整 Prompt + 12 步行动清单 + 真实案例视频。
              </p>
              <button
                type="button"
                class="mt-6 inline-flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-3 text-sm font-medium text-ink-950 hover:bg-gold-400"
                @click="showContact = true"
              >
                加微信领实战包 →
              </button>
            </div>
            <div class="lg:col-span-5">
              <div class="rounded-xl border border-gold-700/30 bg-ink-950 p-6 text-sm text-ink-200">
                <div class="font-mono text-xs text-gold-400">实战群内提供</div>
                <ul class="mt-3 space-y-2">
                  <li>· 每周一次该场景的直播演示</li>
                  <li>· 同行落地经验分享</li>
                  <li>· 失败案例 & 踩坑警示</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <OwnerContactModal v-if="showContact" @close="showContact = false" />
  </section>
</template>
