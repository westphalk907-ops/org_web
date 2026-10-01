<script setup lang="ts">
import { ref } from 'vue'
import SubPageSocialSlot from '@/components/layout/SubPageSocialSlot.vue'
import { copyText } from '@/utils/helpers'

interface ContactChannel {
  id: string
  icon: string
  title: string
  subtitle: string
  primary: string
  description: string
  responseTime: string
}

const channels: ContactChannel[] = [
  {
    id: 'email',
    icon: '✉',
    title: '邮件',
    subtitle: 'EMAIL',
    primary: 'westphalk907@gmail.com',
    description: '适合：深度咨询、合作提案、白皮书申请',
    responseTime: '48 小时内回复'
  },
  {
    id: 'wechat',
    icon: '💬',
    title: '微信',
    subtitle: 'WECHAT',
    primary: 'Do-core',
    description: '适合：快速问答、加入行业交流群',
    responseTime: '工作日 1 小时内'
  },
  {
    id: 'social',
    icon: '◐',
    title: '公众号 / 抖音 / 小红书',
    subtitle: 'SOCIAL',
    primary: '「AI时代组织进化论/道可乾元/Do Core」',
    description: '适合：持续学习、行业洞察、案例拆解',
    responseTime: '每日更新'
  }
]

// 复制状态：'success' | 'fail' | null
const copiedId = ref<string | null>(null)
const toast = ref<{ show: boolean; text: string; tone: 'success' | 'fail' }>({
  show: false,
  text: '',
  tone: 'success'
})
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(text: string, tone: 'success' | 'fail') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, text, tone }
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 2400)
}

async function copy(channel: ContactChannel) {
  const ok = await copyText(channel.primary)
  if (ok) {
    copiedId.value = channel.id
    setTimeout(() => {
      if (copiedId.value === channel.id) copiedId.value = null
    }, 2000)
    showToast(`已复制：${channel.primary}`, 'success')
  } else {
    showToast('复制失败，请手动长按选择文本复制', 'fail')
  }
}

function openMail() {
  const subject = encodeURIComponent('咨询 AI 组织')
  const body = encodeURIComponent('你好，我想咨询：\n\n')
  window.location.href = `mailto:${channels[0].primary}?subject=${subject}&body=${body}`
}
</script>

<template>
  <article class="py-30">
    <div class="container-wide">
      <div class="grid grid-cols-1 gap-16 lg:grid-cols-12">
        <!-- 左侧：标题 + 引导 -->
        <div class="lg:col-span-5">
          <div class="section-eyebrow">Contact · 联系我们</div>
          <h1 class="mt-4 text-display-md font-display font-medium text-balance">
            找到你的<br />
            <span class="text-gradient-gold">AI 组织下一步</span>
          </h1>
          <p class="mt-6 text-base text-ink-200 leading-relaxed">
            选一种你喜欢的方式，主动添加我们。<br />
            我们不是"留资表单"，是一个真实的人。
          </p>

          <!-- 推荐方式 -->
          <div class="mt-12 space-y-4 text-sm">
            <div class="flex items-start gap-3">
              <span class="text-gold-400">→</span>
              <div>
                <span class="text-ink-100">企业诊断与战略对话</span>
                <span class="ml-2 text-xs text-ink-200">推荐：邮件</span>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <span class="text-gold-400">→</span>
              <div>
                <span class="text-ink-100">培训方案咨询</span>
                <span class="ml-2 text-xs text-ink-200">推荐：微信</span>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <span class="text-gold-400">→</span>
              <div>
                <span class="text-ink-100">Work Lab 项目合作</span>
                <span class="ml-2 text-xs text-ink-200">推荐：邮件附方案</span>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <span class="text-gold-400">→</span>
              <div>
                <span class="text-ink-100">媒体与活动合作</span>
                <span class="ml-2 text-xs text-ink-200">推荐：公众号后台</span>
              </div>
            </div>
          </div>

          <!-- 二维码 -->
          <div class="mt-12">
            <SubPageSocialSlot />
          </div>
        </div>

        <!-- 右侧：3 张联系方式卡片 -->
        <div class="lg:col-span-7">
          <div class="space-y-4">

            <!-- 顶部说明 -->
            <div class="rounded-2xl border border-gold-700/30 bg-gold-500/5 p-4 text-xs text-ink-200">
              <span class="text-gold-400">ⓘ</span>
              <span class="ml-2">
                我们<strong class="text-ink-100">不收集任何表单信息</strong>。下方是三种联系方式，请主动添加——所有沟通在你常用的 IM 里完成。
              </span>
            </div>

            <div
              v-for="ch in channels"
              :key="ch.id"
              class="group rounded-2xl border border-ink-700 bg-ink-900 p-6 lg:p-8 transition-all hover:border-gold-700/50"
            >
              <div class="flex items-start justify-between gap-6">
                <div class="flex-1">
                  <div class="flex items-baseline gap-3">
                    <span class="text-2xl">{{ ch.icon }}</span>
                    <h3 class="text-xl font-display font-medium text-ink-50">{{ ch.title }}</h3>
                    <span class="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-400">
                      {{ ch.subtitle }}
                    </span>
                  </div>
                  <p class="mt-2 text-sm text-ink-200 leading-relaxed">
                    {{ ch.description }}
                  </p>
                  <div class="mt-3 text-xs text-ink-200">
                    <span class="text-gold-400">●</span>
                    <span class="ml-1">{{ ch.responseTime }}</span>
                  </div>
                </div>
              </div>

              <!-- 联系方式展示 -->
              <div class="mt-6 flex items-center justify-between gap-4 rounded-lg border border-ink-800 bg-ink-950 px-4 py-3">
                <code class="font-mono text-base text-ink-50">{{ ch.primary }}</code>
                <button
                  type="button"
                  class="shrink-0 rounded-md border border-gold-500/40 bg-gold-500/10 px-3 py-1.5 text-xs font-medium text-gold-300 transition-all hover:bg-gold-500/20"
                  @click="copy(ch)"
                >
                  {{ copiedId === ch.id ? '✓ 已复制' : '复制' }}
                </button>
              </div>

              <!-- 操作行 -->
              <div class="mt-4 flex items-center gap-3 flex-wrap">
                <button
                  v-if="ch.id === 'email'"
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full border border-gold-500 bg-gold-500/10 px-5 py-2.5 text-sm font-medium text-gold-200 transition-all hover:bg-gold-500/20"
                  @click="openMail"
                >
                  打开邮箱 →
                </button>
                <button
                  v-else
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/5 px-5 py-2.5 text-sm text-gold-300 transition-all hover:border-gold-400 hover:bg-gold-500/10"
                  @click="copy(ch)"
                >
                  复制后到 {{ ch.title }} 添加 →
                </button>
                <span class="text-xs text-ink-200">
                  添加时备注：<code class="text-ink-100">{{ ch.id === 'email' ? '主题' : '来源渠道' }}</code>
                </span>
              </div>
            </div>

            <!-- 兜底说明 -->
            <div class="mt-6 rounded-lg border border-ink-800 bg-ink-950/50 p-4 text-xs text-ink-200 leading-relaxed">
              <div class="text-ink-100 font-medium mb-1">📌 为什么没有表单？</div>
              我们坚持<strong class="text-ink-50">数据最小化</strong>原则——
              你不需要填表，我们也不需要建库。沟通在你熟悉的应用里进行，沟通记录由你的 IM 保管。
              如需删除对话历史，直接在你的客户端操作即可。
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- 全局复制反馈 Toast -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-8 left-1/2 z-50 -translate-x-1/2"
      >
        <div
          class="flex items-center gap-3 rounded-full border px-5 py-3 shadow-2xl backdrop-blur"
          :class="toast.tone === 'success'
            ? 'border-gold-500/50 bg-ink-900/95 text-gold-200'
            : 'border-red-500/50 bg-ink-900/95 text-red-300'"
        >
          <span
            class="flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold"
            :class="toast.tone === 'success'
              ? 'bg-gold-500/20 text-gold-300'
              : 'bg-red-500/20 text-red-300'"
          >
            {{ toast.tone === 'success' ? '✓' : '!' }}
          </span>
          <span class="text-sm font-medium">{{ toast.text }}</span>
        </div>
      </div>
    </Transition>
  </article>
</template>

<style scoped>
/* Toast 进出动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translate(-50%, 16px);
}

.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 16px);
}

/* 复制按钮按下反馈 */
button:active:not(:disabled) {
  transform: scale(0.97);
}
</style>