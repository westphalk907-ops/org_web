<script setup lang="ts">
/**
 * SubPageHero · 子页面 Hero 通用模板
 * -----------------------------------------------------------------------------
 * 解决：所有子页面 Hero 区都同时预留二维码位置
 *  - 左侧：标题区（eyebrow + 主标 slot + 副标）
 *  - 右侧：公众号 / 抖音 / 小红书 三个二维码（占位）
 */
import { useReveal } from '@/composables/useScroll'
import SubPageSocialSlot from './SubPageSocialSlot.vue'

defineProps<{
  /** eyebrow 顶导小字 */
  eyebrow: string
  /** 副标题 */
  subtitle: string
}>()

const { observe } = useReveal()
</script>

<template>
  <section class="relative overflow-hidden bg-ink-950 pt-20 pb-16">
    <!-- 装饰底纹 -->
    <div class="pointer-events-none absolute inset-0 bg-grid bg-grid-lg opacity-30" />

    <div class="container-wide relative">
      <div class="grid items-start gap-12 lg:grid-cols-12">
        <!-- 左：标题区 -->
        <div class="lg:col-span-8">
          <div :ref="(el) => observe(el as HTMLElement)" class="reveal section-eyebrow">
            {{ eyebrow }}
          </div>
          <h1
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal mt-4 text-display-lg font-display font-medium text-balance"
            style="transition-delay: 0.1s"
          >
            <slot name="title" />
          </h1>
          <p
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal mt-6 text-lg text-ink-200 leading-relaxed max-w-2xl"
            style="transition-delay: 0.2s"
          >
            {{ subtitle }}
          </p>
        </div>

        <!-- 右：二维码占位 -->
        <aside class="lg:col-span-4">
          <SubPageSocialSlot />
        </aside>
      </div>
    </div>
  </section>
</template>
