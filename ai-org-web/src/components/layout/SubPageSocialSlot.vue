<script setup lang="ts">
/**
 * 子页面侧栏占位
 * 子页面在右侧 Hero 区域或正文右侧挂上 <SubPageSocialSlot />
 * 即可预留 公众号 / 抖音 / 小红书 三个二维码位置
 */
import { SOCIAL_QR_LIST } from '@/data/socialQr'
</script>

<template>
  <!-- 公众号 / 抖音 / 小红书 三个二维码卡片 -->
  <div class="space-y-3">
    <div
      v-for="item in SOCIAL_QR_LIST"
      :key="item.id"
      class="rounded-xl border border-ink-700/60 bg-ink-900/60 p-4"
    >
      <div class="flex items-start gap-3">
        <!-- 二维码 / 占位 -->
        <div
          class="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border border-ink-700 bg-[#0a0a0a]"
        >
          <img
            v-if="item.src"
            :src="item.src"
            :alt="`${item.zhName} 二维码`"
            class="h-full w-full object-contain"
            loading="lazy"
          />
          <!-- 占位 SVG（模拟二维码点阵） -->
          <svg
            v-else
            viewBox="0 0 12 12"
            class="absolute inset-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)]"
            :style="{ color: item.accent, opacity: 0.55 }"
          >
            <!-- 三个角的定位点 -->
            <rect x="0" y="0" width="3" height="3" fill="currentColor" />
            <rect x="0.5" y="0.5" width="2" height="2" fill="#0a0a0a" />
            <rect x="1" y="1" width="1" height="1" fill="currentColor" />
            <rect x="9" y="0" width="3" height="3" fill="currentColor" />
            <rect x="9.5" y="0.5" width="2" height="2" fill="#0a0a0a" />
            <rect x="10" y="1" width="1" height="1" fill="currentColor" />
            <rect x="0" y="9" width="3" height="3" fill="currentColor" />
            <rect x="0.5" y="9.5" width="2" height="2" fill="#0a0a0a" />
            <rect x="1" y="10" width="1" height="1" fill="currentColor" />
            <!-- 中间模拟点阵 -->
            <rect x="4" y="3" width="1" height="1" fill="currentColor" />
            <rect x="6" y="3" width="1" height="1" fill="currentColor" />
            <rect x="7" y="4" width="1" height="1" fill="currentColor" />
            <rect x="4" y="6" width="1" height="1" fill="currentColor" />
            <rect x="5" y="7" width="1" height="1" fill="currentColor" />
            <rect x="7" y="6" width="1" height="1" fill="currentColor" />
            <rect x="9" y="7" width="1" height="1" fill="currentColor" />
            <rect x="4" y="9" width="1" height="1" fill="currentColor" />
            <rect x="6" y="9" width="1" height="1" fill="currentColor" />
            <rect x="9" y="9" width="1" height="1" fill="currentColor" />
            <rect x="10" y="10" width="1" height="1" fill="currentColor" />
          </svg>
          <!-- 占位标签 -->
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
          <div class="mt-1 text-[11px] text-ink-300 leading-snug">
            {{ item.tagline }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
