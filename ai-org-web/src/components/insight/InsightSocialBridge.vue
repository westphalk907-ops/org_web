<script setup lang="ts">
/**
 * InsightSocialBridge · 首页 Hero 与认知路径之间的"社交过渡带"
 * -----------------------------------------------------------------------------
 * 目的：在第一屏（品牌叙事）与第二屏（认知路径）之间插入一条
 *        "关注我们" 的过渡，让公众号 / 抖音 / 小红书获得曝光，
 *        同时不影响首页的居中构图。
 *
 * 设计：
 *  - 居中 eyebrow + 短句
 *  - 三个二维码卡片（公众号 / 抖音 / 小红书）横向铺开
 *  - 米金细线分隔，呼应 Hero 的金线节奏
 */
import { useReveal } from '@/composables/useScroll'
import { SOCIAL_QR_LIST } from '@/data/socialQr'

const { observe } = useReveal()
</script>

<template>
  <section class="relative bg-ink-950 py-16 lg:py-20">
    <!-- 上下细线分隔 -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
    <div class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-700/20 to-transparent" />

    <div class="container-wide relative">
      <!-- 标题 -->
      <div
        :ref="(el) => observe(el as HTMLElement)"
        class="reveal flex flex-col items-center gap-3"
      >
        <div class="flex items-center gap-3">
          <span class="h-px w-10 bg-gradient-to-r from-transparent to-gold-500/70" />
          <span class="font-mono text-[11px] uppercase tracking-[0.4em] text-gold-400">
            Follow Us
          </span>
          <span class="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/70" />
        </div>
        <h3 class="font-display text-xl lg:text-2xl font-medium text-ink-50 text-center">
          多一个入口，多一种方式<span class="text-gradient-gold">看见变化</span>
        </h3>
      </div>

      <!-- 三个二维码卡片 -->
      <div class="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
        <div
          v-for="item in SOCIAL_QR_LIST"
          :key="item.id"
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal group flex items-center gap-4 rounded-xl border border-ink-700/60 bg-ink-900/60 p-4 transition-all hover:border-gold-700/40 hover:bg-ink-900/80"
        >
          <!-- 二维码 / 占位 -->
          <div
            class="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border border-ink-700"
            :style="{ backgroundColor: '#0a0a0a' }"
          >
            <img
              v-if="item.src"
              :src="item.src"
              :alt="`${item.zhName} 二维码`"
              class="h-full w-full object-contain"
              loading="lazy"
            />
            <svg
              v-else
              viewBox="0 0 12 12"
              class="absolute inset-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)]"
              :style="{ color: item.accent, opacity: 0.55 }"
            >
              <rect x="0" y="0" width="3" height="3" fill="currentColor" />
              <rect x="0.5" y="0.5" width="2" height="2" fill="#0a0a0a" />
              <rect x="1" y="1" width="1" height="1" fill="currentColor" />
              <rect x="9" y="0" width="3" height="3" fill="currentColor" />
              <rect x="9.5" y="0.5" width="2" height="2" fill="#0a0a0a" />
              <rect x="10" y="1" width="1" height="1" fill="currentColor" />
              <rect x="0" y="9" width="3" height="3" fill="currentColor" />
              <rect x="0.5" y="9.5" width="2" height="2" fill="#0a0a0a" />
              <rect x="1" y="10" width="1" height="1" fill="currentColor" />
              <rect x="4" y="4" width="1" height="1" fill="currentColor" />
              <rect x="6" y="5" width="1" height="1" fill="currentColor" />
              <rect x="7" y="6" width="1" height="1" fill="currentColor" />
              <rect x="5" y="7" width="1" height="1" fill="currentColor" />
              <rect x="8" y="9" width="1" height="1" fill="currentColor" />
            </svg>
            <span
              v-if="!item.src"
              class="absolute bottom-0.5 right-1 font-mono text-[8px] text-ink-400 tracking-tight"
            >
              QR
            </span>
          </div>

          <!-- 名称与描述 -->
          <div class="flex-1 min-w-0">
            <div class="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-400">
              {{ item.enName }}
            </div>
            <div class="mt-1 text-sm font-medium text-ink-50">
              {{ item.zhName }}
            </div>
            <div class="mt-1 text-[11px] text-ink-300 leading-snug line-clamp-2">
              {{ item.tagline }}
            </div>
          </div>
        </div>
      </div>

      <!-- 底部小提示 -->
      <p class="mt-8 text-center text-xs text-ink-300 leading-relaxed">
        截图扫码，或在微信 / 抖音 / 小红书
        搜索"<span class="text-ink-100">道可乾元</span>"
      </p>
    </div>
  </section>
</template>
