<script setup lang="ts">
const STEPS = [
  { code: '01', title: '场景盘点', desc: '通过工作坊识别所有潜在 AI 场景，评估价值与可行性。' },
  { code: '02', title: '优先级排序', desc: '基于 ROI 与可行性，对场景进行优先级排序。' },
  { code: '03', title: '工作流原型', desc: '针对 Top 3 场景，设计 AI 工作流原型。' },
  { code: '04', title: '落地陪跑', desc: '4 周落地陪跑，确保从原型到生产的顺利转化。' }
]
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-ink-950 pt-20 pb-16">
      <div class="container-wide relative">
        <div class="max-w-3xl">
          <div class="section-eyebrow">AI Work Lab</div>
          <h1 class="mt-4 text-display-md font-display font-medium text-balance">
            场景共创 ×<br />
            <span class="text-gradient-gold">工作流落地</span>
          </h1>
          <p class="mt-6 text-base text-ink-200 leading-relaxed max-w-2xl">
            用 4 周时间，把 AI 从想法变成可衡量的业务成果。
          </p>
        </div>
      </div>
    </section>

    <section class="py-30">
      <div class="container-wide">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="s in STEPS"
            :key="s.code"
            class="card-base p-6"
          >
            <div class="font-mono text-xs text-gold-400">{{ s.code }}</div>
            <h3 class="mt-3 text-lg font-medium text-ink-50">{{ s.title }}</h3>
            <p class="mt-3 text-sm text-ink-200 leading-relaxed">{{ s.desc }}</p>
          </div>
        </div>

        <div class="mt-16 text-center">
          <BaseButton to="/contact" variant="primary" size="lg">预约 Work Lab 启动会</BaseButton>
        </div>
      </div>
    </section>
  </div>
</template>
