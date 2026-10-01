<script setup lang="ts">
/**
 * MarkdownEditor - 文章正文编辑器
 *
 * 能力：
 * 1. 工具栏：H1/H2/H3 / 粗体 / 斜体 / 链接 / 代码 / 引用 / 列表 / 表格 / 图片上传
 * 2. 拖拽图片到编辑器 → 自动上传 → 在光标处插入 `![alt](url)`
 * 3. 在编辑器内粘贴图片 → 自动上传 → 在光标处插入
 * 4. 行号 + 字数统计
 *
 * Props:
 *   modelValue: Markdown 文本（v-model）
 *   placeholder
 *   rows: 高度（默认 18）
 */
import { computed, nextTick, ref } from 'vue'
import { api, withApiBase, FetchError } from '@/api/server'
import { MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB, formatSizeLimit } from '@/constants/upload'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    rows?: number
  }>(),
  {
    modelValue: '',
    placeholder: '在这里写正文…支持 GFM Markdown 语法',
    rows: 18,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const uploading = ref(false)
const errorMsg = ref('')
const dragging = ref(false)

const wordCount = computed(() => {
  const t = props.modelValue || ''
  // 中文按字符算，英文按词算
  const cn = (t.match(/[\u4e00-\u9fa5]/g) || []).length
  const en = (t.match(/[a-zA-Z]+/g) || []).length
  return cn + en
})

function update(v: string) {
  emit('update:modelValue', v)
}

// =====================================================================
// 工具栏操作
// =====================================================================

/** 包裹选中文本（在光标处插入新文本） */
function wrapSelection(prefix: string, suffix: string = prefix, placeholder: string = '') {
  const ta = textareaRef.value
  if (!ta) return
  const start = ta.selectionStart
  const end = ta.selectionEnd
  const before = props.modelValue.slice(0, start)
  const sel = props.modelValue.slice(start, end)
  const after = props.modelValue.slice(end)
  const inner = sel || placeholder
  const next = before + prefix + inner + suffix + after
  update(next)
  nextTick(() => {
    ta.focus()
    const pos = before.length + prefix.length + inner.length
    ta.setSelectionRange(pos, pos)
  })
}

/** 在光标所在行行首加 prefix（用于标题、列表） */
function prependLine(prefix: string) {
  const ta = textareaRef.value
  if (!ta) return
  const start = ta.selectionStart
  // 找到当前行的行首
  const before = props.modelValue.slice(0, start)
  const lineStart = before.lastIndexOf('\n') + 1
  const after = props.modelValue.slice(lineStart)
  const next = props.modelValue.slice(0, lineStart) + prefix + after
  update(next)
  nextTick(() => {
    ta.focus()
    const pos = start + prefix.length
    ta.setSelectionRange(pos, pos)
  })
}

/** 在光标处插入文本（光标定位到末尾） */
function insertAtCursor(text: string, cursorOffset?: number) {
  const ta = textareaRef.value
  if (!ta) {
    update(props.modelValue + text)
    return
  }
  const start = ta.selectionStart
  const end = ta.selectionEnd
  const before = props.modelValue.slice(0, start)
  const sel = props.modelValue.slice(start, end)
  const after = props.modelValue.slice(end)
  const next = before + text + sel + after
  update(next)
  nextTick(() => {
    ta.focus()
    const pos = before.length + (cursorOffset ?? text.length)
    ta.setSelectionRange(pos, pos)
  })
}

function insertBold() { wrapSelection('**', '**', '加粗文字') }
function insertItalic() { wrapSelection('*', '*', '斜体文字') }
function insertStrike() { wrapSelection('~~', '~~', '删除线') }
function insertCode() { wrapSelection('`', '`', 'code') }
function insertCodeBlock() {
  const ta = textareaRef.value
  if (!ta) return
  const sel = props.modelValue.slice(ta.selectionStart, ta.selectionEnd) || 'code here'
  insertAtCursor(`\n\`\`\`\n${sel}\n\`\`\`\n`, sel.length + 8)
}
function insertLink() {
  const ta = textareaRef.value
  const sel = ta ? props.modelValue.slice(ta.selectionStart, ta.selectionEnd) : ''
  const text = sel || '链接文字'
  wrapSelection('[', '](https://)', text)
}
function insertH1() { prependLine('# ') }
function insertH2() { prependLine('## ') }
function insertH3() { prependLine('### ') }
function insertQuote() { prependLine('> ') }
function insertUl() { prependLine('- ') }
function insertOl() { prependLine('1. ') }
function insertTable() {
  insertAtCursor(
    '\n| 列 1 | 列 2 | 列 3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |\n| 内容 | 内容 | 内容 |\n'
  )
}
function insertHr() {
  insertAtCursor('\n---\n')
}

// =====================================================================
// 图片上传（工具栏按钮 / 拖拽 / 粘贴 共用）
// ====================================================================

const fileInput = ref<HTMLInputElement | null>(null)

function pickImage() {
  fileInput.value?.click()
}

async function uploadAndInsert(file: File) {
  if (!file.type.startsWith('image/')) {
    errorMsg.value = '请选择图片文件'
    return
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    errorMsg.value = `图片不能超过 ${formatSizeLimit(MAX_IMAGE_SIZE_MB)}`
    return
  }
  errorMsg.value = ''
  uploading.value = true
  try {
    const result = await api.uploadImage(file)
    // 用文件名（去后缀）作为 alt
    const alt = (file.name.replace(/\.[^.]+$/, '') || '图片').slice(0, 60)
    // 拼成完整 URL（前后端在不同源时需要绝对地址才能展示）
    const fullUrl = withApiBase(result.url)
    const md = `![${alt}](${fullUrl})`
    insertAtCursor('\n' + md + '\n')
  } catch (e: any) {
    errorMsg.value = e instanceof FetchError ? e.message : (e?.message || '上传失败')
  } finally {
    uploading.value = false
  }
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) uploadAndInsert(file)
  target.value = ''
}

// 拖拽
function onDrop(e: DragEvent) {
  e.preventDefault()
  dragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) uploadAndInsert(file)
}
function onDragOver(e: DragEvent) {
  e.preventDefault()
  dragging.value = true
}
function onDragLeave(e: DragEvent) {
  const related = e.relatedTarget as Node | null
  if (!related || !(e.currentTarget as Node).contains(related)) {
    dragging.value = false
  }
}

// 粘贴
function onPaste(e: ClipboardEvent) {
  const items = e.clipboardData?.items
  if (!items) return
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        e.preventDefault()
        uploadAndInsert(file)
        return
      }
    }
  }
  // 非图片粘贴走默认行为（粘贴 Markdown 文本）
}

// =====================================================================
// 工具栏定义（按钮组）
// =====================================================================

interface ToolBtn {
  icon: string
  title: string
  action: () => void
}

const tbGroups: ToolBtn[][] = [
  [{ icon: '#', title: '一级标题', action: insertH1 }, { icon: '##', title: '二级标题', action: insertH2 }, { icon: '###', title: '三级标题', action: insertH3 }],
  [{ icon: 'B', title: '粗体', action: insertBold }, { icon: 'I', title: '斜体', action: insertItalic }, { icon: 'S̶', title: '删除线', action: insertStrike }],
  [{ icon: '<>', title: '行内代码', action: insertCode }, { icon: '```', title: '代码块', action: insertCodeBlock }],
  [{ icon: '🔗', title: '链接', action: insertLink }, { icon: '🖼', title: '上传并插入图片', action: pickImage }],
  [{ icon: '❝', title: '引用', action: insertQuote }, { icon: '•', title: '无序列表', action: insertUl }, { icon: '1.', title: '有序列表', action: insertOl }],
  [{ icon: '⊞', title: '表格', action: insertTable }, { icon: '—', title: '分割线', action: insertHr }],
]
</script>

<template>
  <div
    class="markdown-editor rounded-lg border border-ink-700 bg-ink-950 overflow-hidden"
    :class="dragging ? 'ring-2 ring-gold-500' : ''"
    @drop="onDrop"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @paste="onPaste"
  >
    <!-- 工具栏 -->
    <div class="flex flex-wrap items-center gap-1 border-b border-ink-700 bg-ink-900 p-2">
      <template v-for="(group, gi) in tbGroups" :key="gi">
        <div class="flex items-center gap-0.5">
          <button
            v-for="(btn, bi) in group"
            :key="bi"
            type="button"
            :title="btn.title"
            class="h-8 min-w-[2rem] rounded px-2 text-xs font-mono text-ink-100 hover:bg-ink-800 hover:text-gold-300"
            @click="btn.action"
          >
            {{ btn.icon }}
          </button>
        </div>
        <span v-if="gi < tbGroups.length - 1" class="mx-1 h-5 w-px bg-ink-700" />
      </template>

      <div class="ml-auto flex items-center gap-2 text-xs text-ink-300">
        <span v-if="uploading" class="text-gold-300">
          <span class="inline-block h-3 w-3 animate-spin rounded-full border border-gold-300 border-t-transparent align-middle mr-1" />
          上传中…
        </span>
        <span>{{ wordCount }} 字</span>
      </div>
    </div>

    <!-- 编辑区 -->
    <textarea
      ref="textareaRef"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      class="block w-full resize-y bg-ink-950 px-4 py-3 font-mono text-sm text-ink-50 placeholder-ink-300 focus:outline-none"
      @input="(e: any) => update(e.target.value)"
    />

    <!-- 错误条 -->
    <div
      v-if="errorMsg"
      class="border-t border-red-500/40 bg-red-500/10 px-4 py-2 text-xs text-red-300"
    >
      ⚠ {{ errorMsg }} <button type="button" class="ml-2 text-red-200 hover:text-white" @click="errorMsg = ''">关闭</button>
    </div>

    <!-- 拖拽提示蒙层 -->
    <div
      v-if="dragging"
      class="pointer-events-none absolute inset-0 flex items-center justify-center bg-gold-500/10 text-sm text-gold-300"
    >
      松开鼠标上传图片
    </div>

    <!-- 隐藏的文件选择 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
      class="hidden"
      @change="onFileChange"
    />
  </div>
</template>

<style scoped>
.markdown-editor {
  position: relative;
}
</style>
