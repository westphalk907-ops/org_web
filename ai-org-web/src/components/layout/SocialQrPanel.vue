<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { SOCIAL_QR_LIST, type SocialQrItem } from '@/data/socialQr'

defineProps<{
  /** 紧凑模式：在右侧吸顶时使用（只显示缩略图+名称） */
  compact?: boolean
}>()

/** 占位时的 SVG 二维码样式点阵（装饰用，不真实可扫） */
function dotsPattern(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  const dots: { x: number; y: number }[] = []
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 12; c++) {
      h = (h * 1103515245 + 12345) | 0
      if ((h >>> 16 & 0xff) > 160) {
        dots.push({ x: c, y: r })
      }
    }
  }
  return dots
}

/* ============================================================
   点击放大（Lightbox）
   ============================================================ */
const lightboxItem = ref<SocialQrItem | null>(null)

function openLightbox(item: SocialQrItem) {
  // 没有真实图片时不弹（避免点开 SVG 占位）
  if (!item.src) return
  lightboxItem.value = item
}

function closeLightbox() {
  lightboxItem.value = null
}

// Esc 关闭 + 背景滚动锁定
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && lightboxItem.value) closeLightbox()
}

watch(lightboxItem, (val) => {
  if (typeof document === 'undefined') return
  if (val) {
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeydown)
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', onKeydown)
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', onKeydown)
  }
})
</script>

<template>
  <!-- 默认面板：完整版 -->
  <aside v-if="!compact" class="space-y-4">
    <div class="flex items-center gap-3">
      <span class="inline-block h-px w-6 bg-gold-500" />
      <span class="font-mono text-[10px] uppercase tracking-[0.35em] text-gold-400">
        Follow Us
      </span>
    </div>
    <h3 class="font-display text-lg font-medium text-ink-50">
      <span class="text-gradient-gold">关注</span> 智链
    </h3>
    <p class="text-xs text-ink-200 leading-relaxed">
      多一个入口，多一种方式看到我们。
    </p>

    <!-- 三个二维码卡片 -->
    <div class="space-y-3 pt-2">
      <div
        v-for="item in SOCIAL_QR_LIST"
        :key="item.id"
        class="group rounded-xl border border-ink-700/60 bg-ink-900/60 p-3 transition-colors hover:border-gold-700/40"
      >
        <div class="flex items-center gap-3">
          <!-- 二维码 / 占位（可点击放大） -->
          <button
            type="button"
            :disabled="!item.src"
            :aria-label="item.src ? `放大查看 ${item.zhName} 二维码` : `${item.zhName} 二维码未上传`"
            class="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border border-ink-700 bg-[#0a0a0a] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 disabled:cursor-default"
            :class="item.src ? 'cursor-zoom-in hover:border-gold-500/70 transition-colors' : ''"
            @click="openLightbox(item)"
          >
            <img
              v-if="item.src"
              :src="item.src"
              :alt="`${item.zhName} 二维码`"
              class="h-full w-full object-contain"
              loading="lazy"
            />
            <!-- 占位 SVG 点阵 -->
            <svg
              v-else
              viewBox="0 0 12 12"
              class="absolute inset-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)]"
              :style="{ color: item.accent, opacity: 0.55 }"
            >
              <rect x="0" y="0" width="3" height="3" fill="currentColor" />
              <rect x="0.5" y="0.5" width="2" height="2" fill="#0a0a0a" />
              <rect x="1" y="1" width="1" height="1" fill="currentColor" />
              <rect x="9" y="0" width="3" height="3" fill="currentColor" />
              <rect x="9.5" y="0.5" width="2" height="2" fill="#0a0a0a" />
              <rect x="10" y="1" width="1" height="1" fill="currentColor" />
              <rect x="0" y="9" width="3" height="3" fill="currentColor" />
              <rect x="0.5" y="9.5" width="2" height="2" fill="#0a0a0a" />
              <rect x="1" y="10" width="1" height="1" fill="currentColor" />
              <rect
                v-for="(dot, i) in dotsPattern(item.id)"
                :key="i"
                :x="dot.x"
                :y="dot.y"
                width="1"
                height="1"
                fill="currentColor"
              />
            </svg>
            <span
              v-if="!item.src"
              class="absolute bottom-0.5 right-1 font-mono text-[8px] text-ink-400 tracking-tight"
            >
              QR
            </span>
            <!-- hover 提示：放大图标 -->
            <span
              v-if="item.src"
              class="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100"
              aria-hidden="true"
            >
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zM10 11h4M11 10v4" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 3h4M3 3v4M21 3h-4M21 3v4M3 21h4M3 21v-4M21 21h-4M21 21v-4" />
              </svg>
            </span>
          </button>

          <!-- 名称与描述 -->
          <div class="flex-1 min-w-0">
            <div class="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-400">
              {{ item.enName }}
            </div>
            <div class="mt-1 text-sm font-medium text-ink-50">
              {{ item.zhName }}
            </div>
            <div class="mt-1 text-[11px] text-ink-300 leading-snug line-clamp-2">
              {{ item.tagline }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部提示 -->
    <p class="pt-1 text-[10px] text-ink-300 leading-relaxed">
      点击二维码放大，或在对应平台搜索上方账号名
    </p>
  </aside>

  <!-- 紧凑模式：右侧吸顶用 -->
  <div v-else class="space-y-3">
    <button
      v-for="item in SOCIAL_QR_LIST"
      :key="item.id"
      type="button"
      :disabled="!item.src"
      class="group block w-full rounded-lg border border-ink-700/60 bg-ink-900/60 p-2 transition-colors hover:border-gold-700/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 disabled:cursor-default disabled:hover:border-ink-700/60"
      :class="item.src ? 'cursor-zoom-in' : ''"
      :aria-label="item.src ? `放大查看 ${item.zhName}` : `${item.zhName} 未上传`"
      @click="openLightbox(item)"
    >
      <div
        class="relative h-12 w-12 rounded overflow-hidden border border-ink-700 mx-auto bg-[#0a0a0a]"
      >
        <img
          v-if="item.src"
          :src="item.src"
          :alt="item.zhName"
          class="h-full w-full object-contain"
        />
        <svg
          v-else
          viewBox="0 0 12 12"
          class="absolute inset-0.5 h-[calc(100%-0.25rem)] w-[calc(100%-0.25rem)]"
          :style="{ color: item.accent, opacity: 0.6 }"
        >
          <rect x="0" y="0" width="3" height="3" fill="currentColor" />
          <rect x="0.5" y="0.5" width="2" height="2" fill="#0a0a0a" />
          <rect x="1" y="1" width="1" height="1" fill="currentColor" />
          <rect x="9" y="0" width="3" height="3" fill="currentColor" />
          <rect x="9.5" y="0.5" width="2" height="2" fill="#0a0a0a" />
          <rect x="10" y="1" width="1" height="1" fill="currentColor" />
          <rect x="0" y="9" width="3" height="3" fill="currentColor" />
          <rect x="0.5" y="9.5" width="2" height="2" fill="#0a0a0a" />
          <rect x="1" y="10" width="1" height="1" fill="currentColor" />
        </svg>
      </div>
      <div class="mt-1.5 text-center">
        <div class="font-mono text-[9px] uppercase tracking-wider text-gold-400">
          {{ item.id === 'public' ? 'WX' : item.id === 'douyin' ? '抖音' : '小红书' }}
        </div>
      </div>
    </button>
  </div>

  <!-- ============================================================
       Lightbox 弹层
       ============================================================ -->
  <Teleport to="body">
    <Transition name="qr-lightbox">
      <div
        v-if="lightboxItem"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        @click.self="closeLightbox"
      >
        <!-- 背景蒙层 -->
        <div class="absolute inset-0 bg-black/85 backdrop-blur-sm" />

        <!-- 内容卡 -->
        <div
          class="relative z-10 flex max-w-[90vw] flex-col items-center gap-4 rounded-2xl border border-gold-500/30 bg-ink-900/95 p-6 shadow-2xl"
          @click.stop
        >
          <!-- 顶部：账号名 + 关闭按钮 -->
          <div class="flex w-full items-center justify-between gap-4">
            <div>
              <div class="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-400">
                {{ lightboxItem.enName }}
              </div>
              <div class="mt-0.5 font-display text-lg font-medium text-ink-50">
                {{ lightboxItem.zhName }}
              </div>
            </div>
            <button
              type="button"
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink-700 text-ink-200 transition-colors hover:border-gold-500 hover:text-gold-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
              aria-label="关闭"
              @click="closeLightbox"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </button>
          </div>

          <!-- 大图 -->
          <div
            class="relative h-[60vmin] w-[60vmin] max-h-[480px] max-w-[480px] rounded-xl border border-ink-700 bg-white p-4"
          >
            <img
              :src="lightboxItem.src"
              :alt="`${lightboxItem.zhName} 二维码`"
              class="h-full w-full object-contain"
            />
          </div>

          <!-- 底部提示 -->
          <div class="text-center">
            <p class="text-xs text-ink-200">
              长按图片识别二维码 / 用对应 App「扫一扫」
            </p>
            <p class="mt-1 font-mono text-[10px] text-ink-400">
              按 Esc 或点击空白处关闭
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Lightbox 过渡动画 */
.qr-lightbox-enter-active,
.qr-lightbox-leave-active {
  transition: opacity 0.22s ease;
}
.qr-lightbox-enter-active > div:last-child,
.qr-lightbox-leave-active > div:last-child {
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease;
}
.qr-lightbox-enter-from,
.qr-lightbox-leave-to {
  opacity: 0;
}
.qr-lightbox-enter-from > div:last-child,
.qr-lightbox-leave-to > div:last-child {
  opacity: 0;
  transform: scale(0.92);
}

/* hover 时二维码上的放大图标平滑显隐 */
.group:hover img {
  transition: filter 0.2s ease;
}
</style>
