<script setup lang="ts">
import { useReveal } from '@/composables/useScroll'
import SubPageHero from '@/components/layout/SubPageHero.vue'
const { observe } = useReveal()

const SERVICES = [
  {
    code: '01',
    title: 'AI Academy',
    desc: '面向 CEO / HR / 业务负责人的系统化培训，从认知到方法到落地。',
    points: ['高管 AI 战略工作坊', 'HR AI 培训师认证', '业务负责人 AI 实战课', '员工 AI 基础训练'],
    href: '/act/academy'
  },
  {
    code: '02',
    title: 'AI Work Lab',
    desc: '场景共创与工作流设计，识别高价值场景并落地。',
    points: ['场景识别与排序', 'AI 工作流原型设计', '4 周落地陪跑', 'ROI 评估与汇报'],
    href: '/act/work-lab'
  },
  {
    code: '03',
    title: 'AI Organization Consulting',
    desc: '组织变革与治理，从战略到组织架构的全面重构。',
    points: ['AI 战略共创', '组织架构重设计', '治理与流程机制', '变革管理与培训'],
    href: '/act/consulting'
  }
]
</script>

<template>
  <div>
    <SubPageHero
      eyebrow="Act · 行动"
      subtitle="培训、项目、咨询，覆盖 AI 组织变革的全场景。"
    >
      <template #title>
        从知道到做到，<br />
        <span class="text-gradient-gold">3 类专业服务</span>
      </template>
    </SubPageHero>

    <section class="py-30">
      <div class="container-wide">
        <div class="space-y-6">
          <RouterLink
            v-for="(s, i) in SERVICES"
            :key="s.code"
            :to="s.href"
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal group grid grid-cols-1 gap-8 rounded-2xl border border-ink-700 bg-ink-900 p-10 transition-all hover:border-gold-700/50 hover:shadow-card-hover lg:grid-cols-12"
            :style="{ transitionDelay: `${i * 100}ms` }"
          >
            <div class="lg:col-span-4">
              <div class="font-mono text-xs text-ink-200">{{ s.code }}</div>
              <h3 class="mt-3 text-3xl font-display font-medium text-ink-50 group-hover:text-gold-300 transition-colors">
                {{ s.title }}
              </h3>
              <p class="mt-4 text-base text-ink-200 leading-relaxed">
                {{ s.desc }}
              </p>
            </div>
            <div class="lg:col-span-7 lg:col-start-6">
              <ul class="space-y-3">
                <li v-for="p in s.points" :key="p" class="flex items-center gap-3 text-sm text-ink-100">
                  <span class="text-gold-400">✓</span>
                  {{ p }}
                </li>
              </ul>
              <div class="mt-6 flex items-center gap-2 text-sm text-gold-400">
                了解详情
                <span class="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
