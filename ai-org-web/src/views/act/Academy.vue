<script setup lang="ts">
import { useReveal } from '@/composables/useScroll'
const { observe } = useReveal()

const PROGRAMS = [
  { title: 'CEO AI 战略工作坊', duration: '1 天', audience: 'CEO / 高管', desc: '从战略视角理解 AI 组织变革，建立企业 AI 路线图。' },
  { title: 'HR AI 培训师认证', duration: '3 天', audience: 'HR / L&D', desc: '成为企业 AI 培训负责人，建立内部 AI 人才培养体系。' },
  { title: '业务负责人 AI 实战课', duration: '4 周', audience: '业务负责人', desc: '从场景识别到工作流设计，掌握 AI 落地全流程。' },
  { title: '员工 AI 基础训练', duration: '2 周', audience: '全员', desc: 'Prompt 基础、工作流入门、工具熟练度训练。' },
  { title: 'Manager AI 训练营', duration: '3 周', audience: '中层管理者', desc: '管理 AI 化团队、推动团队 AI 转型。' },
  { title: 'AI 战略顾问认证', duration: '8 周', audience: '咨询顾问', desc: '成为企业 AI 组织变革的认证顾问。' }
]
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-ink-950 pt-20 pb-16">
      <div class="container-wide relative">
        <div class="max-w-3xl">
          <div :ref="(el) => observe(el as HTMLElement)" class="reveal section-eyebrow">AI Academy</div>
          <h1 :ref="(el) => observe(el as HTMLElement)" class="reveal mt-4 text-display-md font-display font-medium text-balance" style="transition-delay: 0.1s">
            系统化的<br />
            <span class="text-gradient-gold">AI 人才培养体系</span>
          </h1>
          <p :ref="(el) => observe(el as HTMLElement)" class="reveal mt-6 text-base text-ink-200 leading-relaxed max-w-2xl" style="transition-delay: 0.2s">
            从高管到员工，覆盖企业 AI 能力建设的全角色。
          </p>
        </div>
      </div>
    </section>

    <section class="py-30">
      <div class="container-wide">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <RouterLink
            v-for="(p, i) in PROGRAMS"
            :key="p.title"
            to="/contact"
            :ref="(el) => observe(el as HTMLElement)"
            class="reveal group card-base p-6"
            :style="{ transitionDelay: `${i * 60}ms` }"
          >
            <div class="flex items-center justify-between">
              <span class="tag-gold">{{ p.duration }}</span>
              <span class="text-xs font-mono text-ink-200">{{ p.audience }}</span>
            </div>
            <h3 class="mt-4 text-lg font-medium text-ink-50 group-hover:text-gold-300 transition-colors">
              {{ p.title }}
            </h3>
            <p class="mt-3 text-sm text-ink-200 leading-relaxed">{{ p.desc }}</p>
            <div class="mt-6 flex items-center gap-2 text-sm text-gold-400">
              咨询报名 →
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
