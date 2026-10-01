<script setup lang="ts">
/**
 * ImageUploader - 图片上传组件
 *
 * 能力：
 * 1. 点击 / 拖拽 / 粘贴 三种方式上传
 * 2. 上传前自动压缩（>2MB）
 * 3. 上传中显示进度
 * 4. 已上传图片预览 + 替换 / 删除
 *
 * Props:
 *   modelValue: 当前图片 URL（v-model）
 *   placeholder: 占位文案
 *   aspect: 宽高比，例如 '16/9' / '4/3' / '1/1'
 *
 * Emits:
 *   update:modelValue
 */
import { computed, ref } from 'vue'
import { api, withApiBase, FetchError } from '@/api/server'
import { MAX_IMAGE_SIZE_BYTES, formatSizeLimit, MAX_IMAGE_SIZE_MB } from '@/constants/upload'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    aspect?: string
  }>(),
  {
    modelValue: '',
    placeholder: '点击 / 拖拽 / 粘贴图片到此处',
    aspect: '16/9',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const uploading = ref(false)
const errorMsg = ref('')

/** 用于预览的完整 URL（后端返回的是 /uploads/...） */
const previewUrl = computed(() => (props.modelValue ? withApiBase(props.modelValue) : ''))

function pick() {
  fileInput.value?.click()
}

async function handleFile(file: File) {
  if (!file) return
  if (!file.type.startsWith('image/')) {
    errorMsg.value = '请选择图片文件'
    return
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    errorMsg.value = `图片不能超过 ${formatSizeLimit(MAX_IMAGE_SIZE_MB)}（请先用 AI 工具导出更小尺寸）`
    return
  }
  errorMsg.value = ''
  uploading.value = true
  try {
    const result = await api.uploadImage(file)
    emit('update:modelValue', result.url)
  } catch (e: any) {
    errorMsg.value = e instanceof FetchError ? e.message : (e?.message || '上传失败')
  } finally {
    uploading.value = false
  }
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) handleFile(file)
  target.value = '' // 重置以便下次能选同一个文件
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  dragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) handleFile(file)
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  dragging.value = true
}

function onDragLeave(e: DragEvent) {
  // 只有真正离开容器才取消（防抖）
  const related = e.relatedTarget as Node | null
  if (!related || !(e.currentTarget as Node).contains(related)) {
    dragging.value = false
  }
}

function onPaste(e: ClipboardEvent) {
  const items = e.clipboardData?.items
  if (!items) return
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        e.preventDefault()
        handleFile(file)
        return
      }
    }
  }
}

function clear() {
  emit('update:modelValue', '')
  errorMsg.value = ''
}
</script>

<template>
  <div
    class="image-uploader group relative rounded-lg border-2 border-dashed transition-all cursor-pointer overflow-hidden"
    :class="[
      dragging ? 'border-gold-500 bg-gold-500/10' : 'border-ink-700 bg-ink-950',
      uploading ? 'pointer-events-none opacity-60' : 'hover:border-gold-500/60',
    ]"
    :style="{ aspectRatio: aspect }"
    tabindex="0"
    @click="pick"
    @keydown.enter="pick"
    @keydown.space.prevent="pick"
    @drop="onDrop"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @paste="onPaste"
  >
    <input
      ref="fileInput"
      type="file"
      accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
      class="hidden"
      @change="onFileChange"
    />

    <!-- 有图：预览 + 悬浮操作 -->
    <template v-if="previewUrl">
      <img
        :src="previewUrl"
        class="absolute inset-0 h-full w-full object-cover"
        alt="封面预览"
      />
      <div class="absolute inset-0 flex items-center justify-center gap-2 bg-ink-950/0 group-hover:bg-ink-950/70 transition-colors">
        <button
          type="button"
          class="rounded-lg bg-gold-500 px-3 py-1.5 text-xs font-medium text-ink-950 opacity-0 group-hover:opacity-100 transition-opacity"
          @click.stop="pick"
        >
          替换
        </button>
        <button
          type="button"
          class="rounded-lg border border-red-400/60 bg-ink-950/80 px-3 py-1.5 text-xs text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
          @click.stop="clear"
        >
          删除
        </button>
      </div>
    </template>

    <!-- 无图：占位 -->
    <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-ink-200 select-none">
      <div v-if="uploading" class="text-sm text-gold-300">上传中…</div>
      <template v-else>
        <svg class="h-8 w-8 mb-2 text-ink-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5m0 0L7.5 12M12 7.5v9" />
        </svg>
        <div class="text-sm">{{ placeholder }}</div>
        <div class="mt-1 text-xs text-ink-300">PNG / JPG / WebP · 最大 {{ formatSizeLimit(MAX_IMAGE_SIZE_MB) }}</div>
      </template>
    </div>

    <!-- 错误提示 -->
    <div
      v-if="errorMsg"
      class="absolute bottom-2 left-2 right-2 rounded bg-red-500/90 px-2 py-1 text-xs text-white"
    >
      ⚠ {{ errorMsg }}
    </div>

    <!-- 上传中蒙层 -->
    <div v-if="uploading" class="absolute inset-0 flex items-center justify-center bg-ink-950/50">
      <div class="flex flex-col items-center gap-2">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
        <span class="text-xs text-ink-100">上传中…</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-uploader:focus {
  outline: 2px solid theme('colors.gold.500');
  outline-offset: 2px;
}
</style>
