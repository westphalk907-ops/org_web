<script setup lang="ts">
import SubPageHero from '@/components/layout/SubPageHero.vue'

const VALUES = [
  { title: '从意识到行动', desc: '我们不只给认知，更陪跑落地。' },
  { title: '方法论 × 实战', desc: '经过验证的框架，加上真实场景的实战。' },
  { title: '可持续的变革', desc: '建立内部能力，而不是依赖外部顾问。' }
]
</script>

<template>
  <div>
    <SubPageHero
      eyebrow="About · 关于我们"
      subtitle="我们是一家专注于企业 AI 组织变革的咨询机构。帮助企业从工具试点走向 AI 组织，建立人与 AI 协作的新工作方式。"
    >
      <template #title>
        从 AI 使用<br />到 <span class="text-gradient-gold">AI 组织</span>
      </template>
    </SubPageHero>

    <section class="py-16">
      <div class="container-wide">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div v-for="v in VALUES" :key="v.title" class="card-base p-8">
            <h3 class="text-xl font-medium text-ink-50">{{ v.title }}</h3>
            <p class="mt-3 text-sm text-ink-200 leading-relaxed">{{ v.desc }}</p>
          </div>
        </div>

        <div class="mt-16 max-w-3xl">
          <h2 class="text-2xl font-display font-medium text-ink-50">我们的方法</h2>
          <p class="mt-4 text-base text-ink-200 leading-relaxed">
            基于对 500+ 家企业的深入研究，我们提炼出 AI 组织进化的 5 阶段框架：
            认知期 → 探索期 → 构建期 → 规模化期 → AI 组织期。
            我们陪伴企业走完这条路径上的每一步。
          </p>
        </div>

        <div class="mt-12">
          <BaseButton to="/contact" variant="primary" size="lg">开启对话</BaseButton>
        </div>
      </div>
    </section>
  </div>
</template>
