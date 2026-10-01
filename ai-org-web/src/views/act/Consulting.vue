<script setup lang="ts">
const DELIVERABLES = [
  'AI 战略蓝图',
  '组织架构重设计',
  '治理与流程机制',
  'AI 考核体系',
  '变革管理与培训',
  '3-6 月落地路线图'
]
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-ink-950 pt-20 pb-16">
      <div class="container-wide relative">
        <div class="max-w-3xl">
          <div class="section-eyebrow">AI Organization Consulting</div>
          <h1 class="mt-4 text-display-md font-display font-medium text-balance">
            从战略到组织，<br />
            <span class="text-gradient-gold">全面重构 AI 时代的组织</span>
          </h1>
          <p class="mt-6 text-base text-ink-200 leading-relaxed max-w-2xl">
            面向企业的系统性 AI 组织变革咨询。
          </p>
        </div>
      </div>
    </section>

    <section class="py-30">
      <div class="container-wide">
        <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <div class="section-eyebrow">服务范围</div>
            <h2 class="mt-3 text-2xl font-display font-medium text-ink-50">
              我们提供
            </h2>
            <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div
                v-for="d in DELIVERABLES"
                :key="d"
                class="rounded-lg border border-ink-700 bg-ink-900 p-4 text-sm text-ink-100"
              >
                ✓ {{ d }}
              </div>
            </div>
          </div>

          <div>
            <div class="section-eyebrow">合作流程</div>
            <h2 class="mt-3 text-2xl font-display font-medium text-ink-50">
              3 阶段共创
            </h2>
            <div class="mt-6 space-y-4">
              <div class="card-base p-6">
                <div class="font-mono text-xs text-gold-400">阶段 1</div>
                <h3 class="mt-2 text-lg font-medium text-ink-50">诊断与共创（2-4 周）</h3>
                <p class="mt-2 text-sm text-ink-200">现状调研、痛点识别、战略共创、目标对齐</p>
              </div>
              <div class="card-base p-6">
                <div class="font-mono text-xs text-gold-400">阶段 2</div>
                <h3 class="mt-2 text-lg font-medium text-ink-50">设计与试点（4-8 周）</h3>
                <p class="mt-2 text-sm text-ink-200">架构设计、流程设计、试点项目、培训赋能</p>
              </div>
              <div class="card-base p-6">
                <div class="font-mono text-xs text-gold-400">阶段 3</div>
                <h3 class="mt-2 text-lg font-medium text-ink-50">规模化与持续优化（3-6 月）</h3>
                <p class="mt-2 text-sm text-ink-200">规模化推广、持续优化、生态合作</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-16 text-center">
          <BaseButton to="/contact" variant="primary" size="lg">预约战略对话</BaseButton>
        </div>
      </div>
    </section>
  </div>
</template>
