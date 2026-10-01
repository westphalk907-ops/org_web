<script setup lang="ts">
import { useReveal } from '@/composables/useScroll'
const { observe } = useReveal()

const JOURNEY = [
  {
    code: '01',
    title: '认知',
    en: 'Understand',
    desc: '原来这是我的问题',
    content: '趋势、痛点、洞察',
    cta: '了解更多',
    href: '/understand'
  },
  {
    code: '02',
    title: '学习',
    en: 'Learn',
    desc: '原来可以这样解决',
    content: 'Framework、白皮书、案例',
    cta: '查看方法',
    href: '/learn'
  },
  {
    code: '03',
    title: '体验',
    en: 'Experience',
    desc: '原来我的企业是这个状态',
    content: 'Assessment、地图、Demo',
    cta: '开始体验',
    href: '/experience'
  },
  {
    code: '04',
    title: '行动',
    en: 'Act',
    desc: '我知道下一步做什么了',
    content: '培训、项目、咨询',
    cta: '预约 / 下载',
    href: '/act'
  }
]
</script>

<template>
  <section class="relative bg-ink-900 py-30">
    <!-- 装饰 -->
    <div class="pointer-events-none absolute inset-0 bg-grid bg-grid-lg opacity-20" />
    <div class="pointer-events-none absolute -top-40 left-1/3 h-80 w-80 rounded-full bg-gold-500/5 blur-[120px]" />

    <div class="container-wide relative">
      <SectionHeader
        eyebrow="02 · Journey"
        title="你的 AI 组织进化路径"
        description="从意识到行动，我们陪你走完每一步。"
      />

      <div class="relative grid grid-cols-1 gap-6 lg:grid-cols-4">
        <!-- 连接线 -->
        <div class="pointer-events-none absolute left-0 right-0 top-[60px] hidden h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent lg:block" />

        <div
          v-for="(item, i) in JOURNEY"
          :key="item.code"
          :ref="(el) => observe(el as HTMLElement)"
          class="reveal group relative rounded-2xl border border-ink-700/80 bg-ink-950/60 p-8 backdrop-blur transition-all duration-500 hover:border-gold-700/60 hover:-translate-y-1 hover:shadow-card-hover"
          :style="{ transitionDelay: `${i * 100}ms` }"
        >
          <!-- 序号圆点 -->
          <div class="relative mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-gold-700/40 bg-ink-950 group-hover:border-gold-500/80 transition-colors">
            <span class="font-mono text-base font-medium text-gradient-gold">{{ item.code }}</span>
            <!-- 光晕 -->
            <div class="absolute inset-0 -z-10 rounded-full bg-gold-500/0 blur-xl transition-all duration-500 group-hover:bg-gold-500/20" />
          </div>

          <!-- 阶段标题 -->
          <div class="flex items-baseline gap-2">
            <h3 class="text-2xl font-display font-medium text-ink-50">{{ item.title }}</h3>
            <span class="text-xs font-mono uppercase tracking-[0.2em] text-ink-200">{{ item.en }}</span>
          </div>

          <!-- 用户心理 -->
          <p class="mt-3 text-sm italic text-gold-300">"{{ item.desc }}"</p>

          <!-- 内容 -->
          <p class="mt-4 text-sm text-ink-200">{{ item.content }}</p>

          <!-- CTA -->
          <RouterLink
            :to="item.href"
            class="mt-8 inline-flex items-center gap-2 text-sm text-gold-400 transition-colors hover:text-gold-300"
          >
            {{ item.cta }}
            <span class="transition-transform group-hover:translate-x-1">→</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
