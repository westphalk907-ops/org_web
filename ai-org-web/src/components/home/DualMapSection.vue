<script setup lang="ts">
import { useReveal } from '@/composables/useScroll'
const { observe } = useReveal()
</script>

<template>
  <section class="relative overflow-hidden bg-ink-950 py-30">
    <div class="pointer-events-none absolute inset-0 bg-grid bg-grid-lg opacity-30" />
    <div class="pointer-events-none absolute top-1/4 left-0 h-72 w-72 rounded-full bg-gold-500/5 blur-[120px]" />
    <div class="pointer-events-none absolute bottom-1/4 right-0 h-72 w-72 rounded-full bg-gold-500/5 blur-[120px]" />

    <div class="container-wide relative">
      <SectionHeader
        eyebrow="03 · Dual Maps"
        title="两条进化路径，一场组织变革"
        description="从个体能力到组织设计，重新定义人、AI 与工作的协作。"
      />

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- AI Individual Map → 个人场景 -->
        <RouterLink
          to="/experience?tab=INDIVIDUAL"
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal group relative overflow-hidden rounded-3xl border border-ink-700/80 bg-gradient-to-br from-ink-900/80 via-ink-950 to-ink-950 p-10 lg:p-12 transition-all duration-500 hover:border-gold-700/60 hover:shadow-card-hover hover:-translate-y-1"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="section-eyebrow">个体 · Individual</div>
              <h3 class="mt-4 text-3xl lg:text-4xl font-display font-medium text-ink-50 group-hover:text-gold-300 transition-colors">
                AI 个人场景
              </h3>
              <p class="mt-4 max-w-md text-base text-ink-200 leading-relaxed">
                一人也能 AI 化：周报、会议纪要、深度阅读、写作提效……
              </p>
            </div>
            <div class="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold-700/30 bg-gold-500/5 transition-all group-hover:bg-gold-500/15 group-hover:rotate-45 group-hover:border-gold-500/60">
              <span class="text-2xl text-gold-400">→</span>
            </div>
          </div>

          <!-- 场景预览 -->
          <div class="mt-10 flex flex-wrap gap-2">
            <span v-for="(stage, idx) in ['周报', '会议', '阅读', '写作', '调研']"
                  :key="stage"
                  class="tag transition-colors group-hover:border-gold-700/40 group-hover:text-gold-300"
                  :style="{ transitionDelay: `${idx * 50}ms` }">
              {{ stage }}
            </span>
          </div>

          <div class="mt-10 flex items-center gap-2 text-sm text-gold-400">
            <span>开始探索</span>
            <span class="transition-transform group-hover:translate-x-2">→</span>
          </div>

          <!-- 装饰 -->
          <div class="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gold-500/0 blur-3xl transition-all duration-700 group-hover:bg-gold-500/10" />
        </RouterLink>

        <!-- AI Organization Map → 组织/管理场景 -->
        <RouterLink
          to="/experience?tab=MANAGEMENT"
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal group relative overflow-hidden rounded-3xl border border-ink-700/80 bg-gradient-to-br from-ink-900/80 via-ink-950 to-ink-950 p-10 lg:p-12 transition-all duration-500 hover:border-gold-700/60 hover:shadow-card-hover hover:-translate-y-1"
          style="transition-delay: 0.1s"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="section-eyebrow">组织 · Organization</div>
              <h3 class="mt-4 text-3xl lg:text-4xl font-display font-medium text-ink-50 group-hover:text-gold-300 transition-colors">
                AI 组织场景
              </h3>
              <p class="mt-4 max-w-md text-base text-ink-200 leading-relaxed">
                企业级场景：销售、市场、HR、客服、管理——每个职能都有可落地的 AI 改造路径。
              </p>
            </div>
            <div class="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold-700/30 bg-gold-500/5 transition-all group-hover:bg-gold-500/15 group-hover:rotate-45 group-hover:border-gold-500/60">
              <span class="text-2xl text-gold-400">→</span>
            </div>
          </div>

          <!-- 场景预览 -->
          <div class="mt-10 flex flex-wrap gap-2">
            <span v-for="(stage, idx) in ['销售', '市场', 'HR', '客服', '管理']"
                  :key="stage"
                  class="tag transition-colors group-hover:border-gold-700/40 group-hover:text-gold-300"
                  :style="{ transitionDelay: `${idx * 50}ms` }">
              {{ stage }}
            </span>
          </div>

          <div class="mt-10 flex items-center gap-2 text-sm text-gold-400">
            <span>开始探索</span>
            <span class="transition-transform group-hover:translate-x-2">→</span>
          </div>

          <div class="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gold-500/0 blur-3xl transition-all duration-700 group-hover:bg-gold-500/10" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>
