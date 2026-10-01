<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api, type Resource } from '@/api/server'
import { downloadResource, downloadCta } from '@/utils/download'

const route = useRoute()
const item = ref<Resource | null>(null)
const loading = ref(false)
const notFound = ref(false)

async function load() {
  const slug = String(route.params.slug ?? '')
  if (!slug) {
    notFound.value = true
    return
  }
  loading.value = true
  notFound.value = false
  try {
    item.value = await api.getResource(slug)
  } catch (e: any) {
    if (e.code === 'NOT_FOUND') notFound.value = true
    else console.error(e)
  } finally {
    loading.value = false
  }
}

watch(() => route.params.slug, load, { immediate: true })

const downloading = ref(false)
const downloadError = ref('')

async function handleDownload() {
  if (!item.value) return
  downloading.value = true
  downloadError.value = ''
  try {
    await downloadResource({
      ...item.value,
      downloadUrl: item.value.fileUrl,
    } as any)
  } catch (e) {
    downloadError.value = e instanceof Error ? e.message : '下载失败'
  } finally {
    downloading.value = false
  }
}

const TYPE_LABEL: Record<string, { zh: string; en: string }> = {
  insight: { zh: '洞察', en: 'INSIGHT' },
  research: { zh: '研究', en: 'RESEARCH' },
  framework: { zh: '框架', en: 'FRAMEWORK' },
  playbook: { zh: 'Playbook', en: 'PLAYBOOK' },
  checklist: { zh: '检查清单', en: 'CHECKLIST' },
  whitepaper: { zh: '白皮书', en: 'WHITEPAPER' },
  prompt: { zh: '提示词', en: 'PROMPT' },
  skill: { zh: '技能', en: 'SKILL' },
  workflow: { zh: '工作流', en: 'WORKFLOW' },
  case: { zh: '案例', en: 'CASE' },
  tool: { zh: '工具', en: 'TOOL' }
}

function formatDate(d?: string) {
  if (!d) return ''
  return d.split('T')[0]?.split('-').join('.') || ''
}
</script>

<template>
  <article v-if="item" class="py-20">
    <div class="container-reading">
      <!-- 类目角标 -->
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center rounded-md border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-sm font-medium text-gold-200">
          {{ TYPE_LABEL[item.type]?.zh || item.type }}
        </span>
        <span class="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-400">
          {{ TYPE_LABEL[item.type]?.en || item.type.toUpperCase() }}
        </span>
      </div>

      <!-- 标题：中文大字 + 英文小字 -->
      <h1 class="mt-5 font-display font-medium text-ink-50 text-balance leading-tight">
        <span class="block text-display-md">{{ item.title }}</span>
        <span v-if="item.subtitle" class="mt-2 block text-sm font-mono uppercase tracking-[0.25em] text-ink-200">
          {{ item.subtitle }}
        </span>
      </h1>

      <!-- 元信息 -->
      <div class="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-ink-200">
        <span v-if="item.publishedAt">发布 · {{ formatDate(item.publishedAt) }}</span>
        <span v-if="item.author">作者 · {{ item.author }}</span>
        <span v-if="item.pages">{{ item.pages }} 页</span>
        <span v-if="item.fileSize">{{ item.fileSize }}</span>
      </div>

      <!-- 摘要 -->
      <p class="mt-8 text-base text-ink-200 leading-relaxed">
        {{ item.summary }}
      </p>

      <!-- 下载 / 查看 操作面板 -->
      <div class="mt-12 rounded-2xl border border-ink-700 bg-ink-900 p-8">
        <div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div class="section-eyebrow">立即下载 / 查看</div>
            <div class="mt-2 text-sm text-ink-200">
              <span v-if="item.fileType === 'pdf'">PDF 文件 · {{ item.fileSize }} · 打开后可保存到本地</span>
              <span v-else-if="item.fileType === 'md'">Markdown 文件 · {{ item.fileSize }} · 适合粘贴到 Notion / Obsidian</span>
              <span v-else-if="item.fileType === 'link'">在线查看</span>
              <span v-else-if="item.fileType === 'notion'">Notion 文档</span>
              <span v-else>{{ item.fileName }}</span>
            </div>
            <div v-if="downloadError" class="mt-3 text-sm text-red-400">{{ downloadError }}</div>
          </div>

          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full border border-gold-500 bg-gold-500/10 px-6 py-3 text-sm font-medium text-gold-200 transition-all hover:bg-gold-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="downloading"
            @click="handleDownload"
          >
            <span>{{ downloading ? '下载中…' : downloadCta(item) }}</span>
          </button>
        </div>

        <!-- 文件预览（md 类型内联预览） -->
        <div v-if="item.fileType === 'md'" class="mt-8 border-t border-ink-800 pt-6">
          <div class="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-200">PREVIEW</div>
          <p class="mt-3 text-xs text-ink-200 leading-relaxed">
            文件为 Markdown 格式，下载后可用 Notion / Obsidian / VS Code 打开编辑。
          </p>
        </div>

        <!-- link 类型：跳转说明 -->
        <div v-else-if="item.fileType === 'link'" class="mt-8 border-t border-ink-800 pt-6">
          <div class="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-200">PREVIEW</div>
          <p class="mt-3 text-xs text-ink-200 leading-relaxed">
            本资源为在线内容，点击「查看 →」直接打开。
          </p>
        </div>
      </div>
    </div>
  </article>

  <!-- 404 -->
  <article v-else class="py-20">
    <div class="container-reading text-center">
      <div class="section-eyebrow">Resources · 404</div>
      <h1 class="mt-4 text-display-md font-display font-medium text-ink-50">资源不存在</h1>
      <p class="mt-4 text-base text-ink-200">可能链接已过期，请回到资源频道重新选择。</p>
      <RouterLink
        to="/resources"
        class="mt-8 inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/5 px-6 py-3 text-sm text-gold-300 transition-all hover:border-gold-400 hover:bg-gold-500/10"
      >
        <span>回到资源频道</span>
        <span>→</span>
      </RouterLink>
    </div>
  </article>
</template>
