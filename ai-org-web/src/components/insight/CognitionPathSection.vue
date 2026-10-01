<script setup lang="ts">
/**
 * 认知路径 · Cognition Path
 * -----------------------------------------------------------------------------
 * Step 5：从 HomeConfig.cognitionPath 静态配置 → 后端 Series 表动态数据
 *
 *  - 数据源：GET /api/series?navSection=understand
 *  - 后端按 sortOrder 排序，子主题按 sortOrder 排序
 *  - 显示：序号、标题、副标签、子主题列表、文章数/框架数
 *  - 卡片右侧用 router-link 跳到 /understand/series/:slug（Series.vue）
 *  - 不再写死 3 个节点，Series 表有几个就显示几个
 */
import { ref, onMounted, computed } from 'vue'
import { useReveal } from '@/composables/useScroll'
import { api, type Series, type SubTopic } from '@/api/server'

const { observe } = useReveal()

const seriesList = ref<Series[]>([])
const loading = ref(true)
const loadError = ref('')

// 当前 hover 的系列
const hoveredSeries = ref<string | null>(null)
function setHovered(slug: string | null) {
  hoveredSeries.value = slug
}

async function load() {
  loading.value = true
  try {
    seriesList.value = await api.listSeries({ navSection: 'understand' })
  } catch (e: any) {
    loadError.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)

/** UI 用的视图模型 */
interface NodeVM {
  slug: string
  label: string
  en: string
  desc: string
  topics: Array<{ name: string; count?: number }>
  articles: number
  frameworks: number
}

const nodes = computed<NodeVM[]>(() => {
  return seriesList.value.map((s) => {
    // desc 字段后端有 "趋势 / 技术 / Agent / AI Evolution" 这种短副标签
    // 我们把它从 desc 中拆出来作为副标签（如果有 desc）
    // 这里把整个 desc 当副标签，保持原 UI 结构
    return {
      slug: s.slug,
      label: s.label,
      en: s.en ?? '',
      desc: s.desc ?? '',
      topics: (s.topics ?? []).map((t: SubTopic) => ({
        name: t.name,
        count: t.count ?? 0,
      })),
      articles: s.articles ?? 0,
      frameworks: s.frameworks ?? 0,
    }
  })
})
</script>

<template>
  <section class="relative bg-ink-950 py-24 lg:py-30">
    <div class="container-wide">

      <!-- Section header -->
      <div :ref="(el) => observe(el as HTMLElement)" class="reveal max-w-3xl">
        <div class="section-eyebrow">
          <span class="inline-block h-px w-8 bg-gold-500" />
          01 — 03 · 认知路径
        </div>
        <h2 class="section-title text-balance">
          AI 正在改变什么，又将如何<br />
          <span class="text-gradient-gold">重塑企业？</span>
        </h2>
        <p class="mt-5 max-w-2xl text-base lg:text-lg text-ink-200 leading-relaxed">
          从 AI 技术本身的演进，到它对工作方式的渗透，再到组织形态必须发生的改变——
          我们沿着这条路径，建立对 AI 时代的完整认知。
        </p>
      </div>

      <div v-if="loading" class="py-20 text-center text-sm text-ink-200">加载中…</div>
      <div v-else-if="loadError" class="py-20 text-center text-sm text-red-400">⚠ {{ loadError }}</div>
      <div v-else-if="nodes.length === 0" class="py-20 text-center">
        <p class="text-lg text-ink-200">还没有发布任何认知系列</p>
        <p class="mt-2 text-sm text-ink-300">
          去 <RouterLink to="/admin/series" class="text-gold-400 hover:text-gold-300">后台 · 系列管理</RouterLink> 创建一个「栏目归属 = 认知」并发布。
        </p>
      </div>
      <div v-else class="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">

        <RouterLink
          v-for="(node, i) in nodes"
          :key="node.slug"
          :to="`/understand/series/${node.slug}`"
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal group relative block"
          :style="{ transitionDelay: `${i * 80}ms` }"
          @mouseenter="setHovered(node.slug)"
          @mouseleave="setHovered(null)"
        >
          <!-- 序号 + 连接线（桌面端） -->
          <div class="relative">
            <div
              class="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-ink-900 to-ink-950 p-7 lg:p-8 transition-all duration-300 h-full"
              :class="hoveredSeries === node.slug
                ? 'border-gold-500/60 shadow-gold-glow'
                : 'border-ink-700/60 hover:border-gold-700/40'"
            >
              <!-- 细网格 -->
              <div class="pointer-events-none absolute inset-0 bg-grid bg-grid-lg opacity-25" />

              <div class="relative">
                <!-- 顶部 meta -->
                <div class="flex items-center justify-between">
                  <span class="font-mono text-[10px] uppercase tracking-[0.3em] text-gold-500">
                    0{{ i + 1 }}
                  </span>
                  <span class="font-mono text-[10px] tracking-[0.2em] text-ink-200">
                    {{ node.en }}
                  </span>
                </div>

                <!-- 主标题 -->
                <h3 class="mt-6 font-display text-2xl lg:text-[28px] font-medium leading-snug text-ink-50 text-balance">
                  {{ node.label }}
                </h3>

                <!-- 副标签 -->
                <p class="mt-3 text-sm text-gold-300/80 font-medium">
                  {{ node.desc }}
                </p>

                <!-- 二级认知主题 -->
                <div class="mt-7 space-y-2.5 border-t border-ink-800 pt-6">
                  <div
                    v-for="t in node.topics"
                    :key="t.name"
                    class="flex items-center justify-between text-sm"
                  >
                    <span class="text-ink-100">{{ t.name }}</span>
                    <span
                      v-if="t.count"
                      class="font-mono text-[11px] text-ink-200 tabular-nums"
                    >
                      {{ t.count }} 篇
                    </span>
                  </div>
                  <div v-if="node.topics.length === 0" class="text-xs text-ink-300 italic">
                    暂无子主题
                  </div>
                </div>

                <!-- 底部 stat -->
                <div class="mt-7 flex items-center gap-5 text-xs">
                  <div class="flex items-center gap-1.5">
                    <span class="h-1 w-1 rounded-full bg-gold-500" />
                    <span class="text-ink-200">文章</span>
                    <span class="text-ink-50 font-mono">{{ node.articles }}</span>
                  </div>
                  <div v-if="node.frameworks" class="flex items-center gap-1.5">
                    <span class="h-1 w-1 rounded-full bg-gold-500/60" />
                    <span class="text-ink-200">框架</span>
                    <span class="text-ink-50 font-mono">{{ node.frameworks }}</span>
                  </div>
                </div>

                <!-- hover 时的箭头 -->
                <div
                  class="mt-6 flex items-center gap-1.5 text-xs font-medium text-gold-400 transition-all duration-300"
                  :class="hoveredSeries === node.slug ? 'opacity-100 translate-x-1' : 'opacity-60'"
                >
                  <span>进入系列专题</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            <!-- 卡片光晕 -->
            <div
              class="pointer-events-none absolute -inset-3 -z-10 rounded-2xl bg-gold-500/0 blur-2xl transition-all duration-500"
              :class="hoveredSeries === node.slug ? 'bg-gold-500/8' : ''"
            />
          </div>
        </RouterLink>
      </div>

      <!-- 路径指示 -->
      <div :ref="(el) => observe(el as HTMLElement)" class="reveal mt-12 flex flex-wrap items-center justify-center gap-3 text-sm">
        <span class="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-200">演进路径</span>
        <span class="h-px w-6 bg-ink-700" />
        <span class="text-ink-100">个体</span>
        <span class="text-gold-500/50">→</span>
        <span class="text-ink-100">工作</span>
        <span class="text-gold-500/50">→</span>
        <span class="text-ink-100">流程</span>
        <span class="text-gold-500/50">→</span>
        <span class="text-ink-100">团队</span>
        <span class="text-gold-500/50">→</span>
        <span class="text-gold-300">组织</span>
        <span class="h-px w-6 bg-ink-700" />
        <span class="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-400">AI Org Map</span>
      </div>

    </div>
  </section>
</template>