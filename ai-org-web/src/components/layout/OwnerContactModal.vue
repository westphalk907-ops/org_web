<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api, type OwnerContact } from '@/api/server'

defineEmits<{ close: [] }>()

const owner = ref<OwnerContact | null>(null)
const loading = ref(true)
const copied = ref(false)

onMounted(async () => {
  try {
    owner.value = await api.getOwnerContact()
  } catch {
    owner.value = { wechatId: '', qrcodeUrl: '', intro: '' }
  } finally {
    loading.value = false
  }
})

async function copyWechat() {
  if (!owner.value?.wechatId) return
  try {
    await navigator.clipboard.writeText(owner.value.wechatId)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // 降级方案
    const ta = document.createElement('textarea')
    ta.value = owner.value.wechatId
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 backdrop-blur-sm p-4"
    @click.self="$emit('close')"
  >
    <div class="w-full max-w-md overflow-hidden rounded-2xl border border-ink-700 bg-ink-900 shadow-card-hover">
      <!-- 头部 -->
      <div class="flex items-center justify-between border-b border-ink-800 px-6 py-4">
        <h2 class="text-lg font-display font-medium text-ink-50">加 Owner 微信</h2>
        <button
          type="button"
          class="text-ink-200 hover:text-ink-50"
          aria-label="关闭"
          @click="$emit('close')"
        >×</button>
      </div>

      <div v-if="loading" class="px-6 py-12 text-center text-sm text-ink-200">加载中…</div>
      <div v-else class="px-6 py-8">
        <!-- 二维码 -->
        <div class="mx-auto h-52 w-52 overflow-hidden rounded-xl border border-ink-700 bg-ink-950">
          <img
            v-if="owner?.qrcodeUrl"
            :src="owner.qrcodeUrl"
            alt="Owner 微信二维码"
            class="h-full w-full object-contain"
          />
          <div v-else class="flex h-full items-center justify-center text-xs text-ink-200">
            请在后台配置二维码图片
          </div>
        </div>

        <!-- 微信号 -->
        <div class="mt-6">
          <div class="text-xs text-ink-200">微信号</div>
          <div class="mt-2 flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-950 px-4 py-3">
            <span class="flex-1 font-mono text-base text-ink-50">{{ owner?.wechatId || '—' }}</span>
            <button
              type="button"
              class="rounded border border-gold-700/40 px-3 py-1 text-xs text-gold-400 hover:bg-gold-500/10"
              @click="copyWechat"
            >
              {{ copied ? '已复制 ✓' : '复制' }}
            </button>
          </div>
        </div>

        <!-- 介绍 -->
        <p v-if="owner?.intro" class="mt-5 text-sm leading-relaxed text-ink-200">
          {{ owner.intro }}
        </p>

        <p class="mt-6 text-center text-xs text-ink-200">
          长按 / 截图识别二维码 → 添加好友
        </p>
      </div>
    </div>
  </div>
</template>
