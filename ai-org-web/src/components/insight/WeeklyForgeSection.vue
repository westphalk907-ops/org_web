<script setup lang="ts">
import { computed } from 'vue'
import { useReveal } from '@/composables/useScroll'
import { useArticles } from '@/composables/useArticles'
import type { ArticleItem } from '@/composables/useArticles'
import ArticleCard from './ArticleCard.vue'

const { observe } = useReveal()
const { articles, loading, error } = useArticles({ limit: 3 })

// 按链接类型分组（避免 v-for + v-if 同元素冲突）
const externalArticles = computed(() => articles.value.filter((a) => a.href !== '#'))
const internalArticles = computed(() => articles.value.filter((a) => a.href === '#'))

/**
 * 内部文章跳转规则：
 *  - 如果有 nodeSlug，跳到对应的「系列专题页」
 *  - 否则跳到 Insights 列表
 */
function internalHref(a: ArticleItem) {
  if (a.nodeSlug) return `/understand/series/${a.nodeSlug}`
  return `/understand/insights`
}
</script>

<template>
  <section class="relative bg-ink-950 py-24 lg:py-30">
    <div class="container-wide">

      <div class="grid items-start gap-10 lg:grid-cols-12">

        <!-- 左：标题区 -->
        <div class="lg:col-span-4">
          <div :ref="(el) => observe(el as HTMLElement)" class="reveal section-eyebrow">
            <span class="inline-block h-px w-8 bg-gold-500" />
            05 · Weekly Notes
          </div>
          <h2
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal mt-3 section-title text-balance"
            style="transition-delay: 0.1s"
          >
            <span class="text-ink-50">本周 </span>
            <span class="text-gradient-gold">FORGE</span>
            <span class="text-ink-50"> 观察</span>
          </h2>
          <p
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal mt-5 text-sm text-ink-200 leading-relaxed"
            style="transition-delay: 0.2s"
          >
            公众号每周三篇：趋势、观点、实践观察。
            这里是它们最新到达的三个声音。
          </p>

          <div
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal mt-8 inline-flex items-center gap-2 rounded-full border border-gold-700/30 bg-gold-500/5 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.25em] text-gold-300"
            style="transition-delay: 0.3s"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse-slow" />
            每周三篇
          </div>
        </div>

        <!-- 右：3 篇文章卡片 -->
        <div class="lg:col-span-8">
          <!-- 加载态 -->
          <div v-if="loading" class="space-y-3">
            <div
              v-for="i in 3"
              :key="i"
              class="flex items-start gap-5 rounded-xl border border-ink-700/40 bg-ink-900/40 p-5 lg:p-6 animate-pulse"
            >
              <div class="h-10 w-10 rounded-lg bg-ink-800 shrink-0" />
              <div class="flex-1 space-y-2">
                <div class="h-3 w-32 rounded bg-ink-800" />
                <div class="h-4 w-3/4 rounded bg-ink-800" />
              </div>
            </div>
          </div>

          <!-- 错误态 -->
          <div v-else-if="error" class="rounded-xl border border-red-900/40 bg-red-950/20 p-6 text-sm text-red-400">
            ⚠ {{ error }}
          </div>

          <!-- 空态 -->
          <div v-else-if="articles.length === 0" class="rounded-xl border border-ink-700/40 bg-ink-900/40 p-8 text-center text-sm text-ink-200">
            暂无最新文章，敬请期待
          </div>

          <!-- 文章列表 -->
          <div v-else class="space-y-3">
            <!-- 外部链接（公众号原文等）：渲染 <a target=_blank> -->
            <a
              v-for="(article, i) in externalArticles"
              :key="article.id"
              :href="article.href"
              target="_blank"
              rel="noopener noreferrer"
              :ref="(el) => observe(el as HTMLElement)"
              class="reveal group flex items-start gap-5 rounded-xl border border-ink-700/60 bg-ink-900/40 p-5 lg:p-6 transition-all duration-300 hover:border-gold-500/40 hover:bg-ink-900/70"
              :style="{ transitionDelay: `${i * 80}ms` }"
            >
              <ArticleCard :article="article" />
            </a>

            <!-- 内部跳转：优先跳详情页；否则跳对应节点系列专题页 -->
            <RouterLink
              v-for="(article, i) in internalArticles"
              :key="article.id"
              :to="internalHref(article)"
              :ref="(el) => observe(el as HTMLElement)"
              class="reveal group flex items-start gap-5 rounded-xl border border-ink-700/60 bg-ink-900/40 p-5 lg:p-6 transition-all duration-300 hover:border-gold-500/40 hover:bg-ink-900/70"
              :style="{ transitionDelay: `${i * 80}ms` }"
            >
              <ArticleCard :article="article" />
            </RouterLink>
          </div>

          <!-- 关注公众号 + 全部观点 -->
          <div
            v-if="!loading && !error"
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal mt-7 flex flex-wrap items-center justify-between gap-4"
            style="transition-delay: 0.3s"
          >
            <div class="flex items-center gap-4">
              <!-- 二维码占位 -->
              <div class="h-14 w-14 rounded-md border border-gold-700/40 bg-ink-900 flex items-center justify-center">
                <span class="font-mono text-[9px] text-ink-200 tracking-tighter">QR</span>
              </div>
              <div>
                <div class="text-sm font-medium text-ink-50">关注智链公众号</div>
                <div class="text-xs text-ink-200 mt-0.5">每周三篇 · 趋势 · 观点 · 实践</div>
              </div>
            </div>

            <RouterLink
              to="/understand/insights"
              class="group inline-flex items-center gap-2 text-sm font-medium text-gold-400 transition-colors hover:text-gold-300"
            >
              <span>查看全部观点</span>
              <span class="transition-transform group-hover:translate-x-1">→</span>
            </RouterLink>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
