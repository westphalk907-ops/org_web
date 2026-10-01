<script setup lang="ts">
import type { ArticleItem } from '@/services/articleApi'
import { CATEGORY_LABEL } from '@/services/articleApi'

defineProps<{ article: ArticleItem }>()
</script>

<template>
  <!-- 序号 -->
  <div class="font-display text-3xl lg:text-4xl font-light text-gold-500 leading-none shrink-0 w-12">
    {{ article.index }}
  </div>

  <!-- 内容 -->
  <div class="flex-1 min-w-0">
    <div class="flex items-center gap-2 flex-wrap">
      <span class="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold">
        {{ CATEGORY_LABEL[article.category] }}
      </span>
      <span class="text-[10px] text-ink-200">·</span>
      <span class="font-mono text-[10px] text-ink-200 tabular-nums">
        {{ article.date }}
      </span>
    </div>
    <h3 class="mt-2 text-base lg:text-lg font-medium text-ink-50 leading-snug group-hover:text-gold-300 transition-colors">
      {{ article.title }}
    </h3>
  </div>

  <!-- 箭头 -->
  <div class="self-center opacity-60 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 shrink-0">
    <svg class="h-4 w-4 text-gold-400" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
</template>
