<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api, type Resource, type ResourceType, FetchError } from '@/api/server'
import { MAX_FILE_SIZE_MB, formatSizeLimit } from '@/constants/upload'

const items = ref<Resource[]>([])
const loading = ref(false)
const errorMsg = ref('')
const filterType = ref<ResourceType | ''>('')
const keyword = ref('')
const showDialog = ref(false)
const editing = ref<Resource | null>(null)
const submitting = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const TYPE_OPTIONS: { v: ResourceType; zh: string; en: string }[] = [
  { v: 'insight', zh: '洞察', en: 'INSIGHT' },
  { v: 'prompt', zh: '提示词', en: 'PROMPT' },
  { v: 'skill', zh: '技能', en: 'SKILL' },
  { v: 'workflow', zh: '工作流', en: 'WORKFLOW' },
  { v: 'playbook', zh: '行动手册', en: 'PLAYBOOK' },
  { v: 'whitepaper', zh: '白皮书', en: 'WHITEPAPER' },
  { v: 'framework', zh: '框架', en: 'FRAMEWORK' },
  { v: 'checklist', zh: '清单', en: 'CHECKLIST' },
  { v: 'research', zh: '研究', en: 'RESEARCH' },
]

async function load() {
  loading.value = true
  try {
    const result = await api.adminListResources({
      type: filterType.value || undefined,
      keyword: keyword.value || undefined,
      pageSize: 100,
    })
    items.value = result.items
  } catch (e: any) {
    errorMsg.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)

function openCreate() {
  editing.value = {
    id: '',
    slug: '',
    type: 'insight',
    title: '',
    subtitle: '',
    summary: '',
    publishedAt: new Date().toISOString(),
    tags: [],
    audience: [],
    industry: [],
    viewCount: 0,
    downloadCount: 0,
    isFeatured: false,
    sortOrder: 0,
  } as Resource
  showDialog.value = true
}

function openEdit(r: Resource) {
  editing.value = JSON.parse(JSON.stringify(r))
  showDialog.value = true
}

async function submit() {
  if (!editing.value) return
  submitting.value = true
  errorMsg.value = ''
  try {
    const form = new FormData()
    const e = editing.value!
    form.append('slug', e.slug)
    form.append('type', e.type)
    form.append('title', e.title)
    if (e.subtitle) form.append('subtitle', e.subtitle)
    form.append('summary', e.summary)
    if (e.author) form.append('author', e.author)
    form.append('tags', JSON.stringify(e.tags ?? []))
    form.append('audience', JSON.stringify(e.audience ?? []))
    form.append('industry', JSON.stringify(e.industry ?? []))
    if (e.pages) form.append('pages', String(e.pages))
    form.append('isFeatured', String(!!e.isFeatured))
    form.append('sortOrder', String(e.sortOrder ?? 0))
    if (e.fileName) form.append('fileName', e.fileName)
    if (e.fileSize) form.append('fileSize', e.fileSize)

    // 文件（前端先校验大小，避免上传被后端拒浪费带宽）
    const selectedFile = fileInput.value?.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        errorMsg.value = `文件超过 ${formatSizeLimit(MAX_FILE_SIZE_MB)} 上限，请压缩后再上传`
        submitting.value = false
        return
      }
      form.append('file', selectedFile)
    }

    if (e.id) {
      await api.adminUpdateResource(e.id, form)
    } else {
      await api.adminCreateResource(form)
    }

    showDialog.value = false
    editing.value = null
    await load()
  } catch (e: any) {
    if (e instanceof FetchError) {
      errorMsg.value = `${e.message}${e.details ? '：' + JSON.stringify(e.details) : ''}`
    } else {
      errorMsg.value = e.message || '保存失败'
    }
  } finally {
    submitting.value = false
  }
}

async function remove(r: Resource) {
  if (!confirm(`确定删除「${r.title}」？`)) return
  try {
    await api.adminDeleteResource(r.id)
    await load()
  } catch (e: any) {
    alert(e.message || '删除失败')
  }
}

const typeBadge = (type: string) => {
  return TYPE_OPTIONS.find(t => t.v === type) || { zh: type, en: type.toUpperCase() }
}
</script>

<template>
  <div class="min-h-screen bg-ink-950 pt-24 pb-30">
    <div class="container-wide">

      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <RouterLink to="/admin" class="text-xs text-ink-200 hover:text-gold-300">
            ← 控制台
          </RouterLink>
          <h1 class="mt-2 text-3xl font-display font-medium text-ink-50">资料管理</h1>
          <p class="mt-2 text-sm text-ink-200">白皮书 / Skill / Prompt / 工作流 / Playbook</p>
        </div>
        <button
          type="button"
          class="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-medium text-ink-950 hover:bg-gold-400 transition-all"
          @click="openCreate"
        >
          + 新建资源
        </button>
      </div>

      <!-- 筛选 -->
      <div class="mb-6 flex flex-wrap gap-3">
        <input
          v-model="keyword"
          type="text"
          placeholder="搜索标题/摘要…"
          class="rounded-lg border border-ink-700 bg-ink-900 px-4 py-2 text-sm text-ink-50 focus:border-gold-500 focus:outline-none"
          @keyup.enter="load"
        />
        <select
          v-model="filterType"
          class="rounded-lg border border-ink-700 bg-ink-900 px-4 py-2 text-sm text-ink-50 focus:border-gold-500 focus:outline-none"
          @change="load"
        >
          <option value="">全部类型</option>
          <option v-for="t in TYPE_OPTIONS" :key="t.v" :value="t.v">
            {{ t.zh }} ({{ t.en }})
          </option>
        </select>
        <button
          type="button"
          class="rounded-lg border border-gold-700/40 bg-gold-500/5 px-4 py-2 text-sm text-gold-300 hover:bg-gold-500/10"
          @click="load"
        >
          搜索
        </button>
      </div>

      <!-- 列表 -->
      <div v-if="loading" class="py-12 text-center text-sm text-ink-200">加载中…</div>
      <div v-else-if="errorMsg" class="py-12 text-center text-sm text-red-400">{{ errorMsg }}</div>
      <div v-else-if="items.length === 0" class="py-12 text-center text-sm text-ink-200">
        暂无数据
      </div>

      <div v-else class="rounded-xl border border-ink-700 bg-ink-900 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-ink-950 text-sm text-ink-200">
            <tr>
              <th class="px-4 py-3 text-left">标题</th>
              <th class="px-4 py-3 text-left">类型</th>
              <th class="px-4 py-3 text-left">大小/页数</th>
              <th class="px-4 py-3 text-left">下载量</th>
              <th class="px-4 py-3 text-left">精选</th>
              <th class="px-4 py-3 text-left">发布日期</th>
              <th class="px-4 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in items"
              :key="r.id"
              class="border-t border-ink-800 hover:bg-ink-950/50"
            >
              <td class="px-4 py-3">
                <div class="text-ink-50">{{ r.title }}</div>
                <div class="text-xs text-ink-200 mt-1">/{{ r.slug }}</div>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center rounded-md border border-gold-500/40 bg-gold-500/10 px-2 py-0.5 text-xs text-gold-200">
                  {{ typeBadge(r.type).zh }}
                </span>
              </td>
              <td class="px-4 py-3 text-xs text-ink-200">{{ r.fileSize || `${r.pages ?? 0} 页` }}</td>
              <td class="px-4 py-3 text-xs text-ink-200">{{ r.downloadCount }}</td>
              <td class="px-4 py-3">
                <span v-if="r.isFeatured" class="text-xs text-gold-300">★ 精选</span>
                <span v-else class="text-xs text-ink-300">—</span>
              </td>
              <td class="px-4 py-3 text-xs text-ink-200">{{ r.publishedAt.split('T')[0] }}</td>
              <td class="px-4 py-3 text-right">
                <button
                  type="button"
                  class="text-xs text-gold-400 hover:text-gold-300 mr-3"
                  @click="openEdit(r)"
                >
                  编辑
                </button>
                <button
                  type="button"
                  class="text-xs text-red-400 hover:text-red-300"
                  @click="remove(r)"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

      <!-- 弹层: 分组 + 中文说明 + 加大字号 -->
      <div
        v-if="showDialog && editing"
        class="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 backdrop-blur-sm p-4"
        @click.self="showDialog = false"
      >
        <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-ink-700 bg-ink-900 p-8">
          <h2 class="text-2xl font-medium text-ink-50">
            {{ editing.id ? '编辑资源' : '新建资源' }}
          </h2>
          <p class="mt-2 text-base text-ink-200">
            填写资料文件的标题、摘要和类型，可上传 PDF / Word 文档 / Markdown / 压缩包供用户下载。
          </p>

          <div class="mt-6 space-y-7">

            <!-- 分组 1：基础信息 -->
            <div>
              <h3 class="text-base font-semibold text-gold-300">一、基础信息</h3>
              <p class="mt-1 text-sm text-ink-200">设定资料的 URL 路径与所属类型</p>

              <div class="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label class="text-base text-ink-100">URL 路径（Slug） <span class="text-red-400">*</span></label>
                  <p class="mt-0.5 text-xs text-ink-300">用于网址 /ai-org-evolution，只用英文小写和短横线</p>
                  <input
                    v-model="editing.slug"
                    type="text"
                    placeholder="例如: ai-org-evolution"
                    class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label class="text-base text-ink-100">资料类型 <span class="text-red-400">*</span></label>
                  <p class="mt-0.5 text-xs text-ink-300">决定首页资源库的归类</p>
                  <select
                    v-model="editing.type"
                    class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none"
                  >
                    <option v-for="t in TYPE_OPTIONS" :key="t.v" :value="t.v">
                      {{ t.zh }}（{{ t.en }}）
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 分组 2：展示信息 -->
            <div>
              <h3 class="text-base font-semibold text-gold-300">二、展示信息</h3>
              <p class="mt-1 text-sm text-ink-200">用户在资源库里看到的标题与简介</p>

              <div class="mt-4">
                <label class="text-base text-ink-100">标题 <span class="text-red-400">*</span></label>
                <p class="mt-0.5 text-xs text-ink-300">一句话点明这份资料解决什么问题</p>
                <input
                  v-model="editing.title"
                  type="text"
                  placeholder="例如: 企业 AI 组织进化白皮书"
                  class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div class="mt-4">
                <label class="text-base text-ink-100">副标题</label>
                <p class="mt-0.5 text-xs text-ink-300">可选，对标题的补充说明</p>
                <input
                  v-model="editing.subtitle"
                  type="text"
                  class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div class="mt-4">
                <label class="text-base text-ink-100">摘要 <span class="text-red-400">*</span></label>
                <p class="mt-0.5 text-xs text-ink-300">2-3 句话描述内容亮点，会显示在列表卡片上</p>
                <textarea
                  v-model="editing.summary"
                  rows="3"
                  class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none"
                ></textarea>
              </div>
            </div>

            <!-- 分组 3：作者与页数 -->
            <div>
              <h3 class="text-base font-semibold text-gold-300">三、作者与篇幅</h3>

              <div class="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label class="text-base text-ink-100">作者</label>
                  <p class="mt-0.5 text-xs text-ink-300">可选，填写笔名或团队名</p>
                  <input
                    v-model="editing.author"
                    type="text"
                    class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label class="text-base text-ink-100">页数</label>
                  <p class="mt-0.5 text-xs text-ink-300">可选，用于 PDF/Word 文档显示</p>
                  <input
                    v-model.number="editing.pages"
                    type="number"
                    class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <!-- 分组 4：标签与文件 -->
            <div>
              <h3 class="text-base font-semibold text-gold-300">四、标签与文件</h3>

              <div class="mt-4">
                <label class="text-base text-ink-100">标签</label>
                <p class="mt-0.5 text-xs text-ink-300">用中文顿号、或英文逗号分隔，例如：白皮书、组织、趋势</p>
                <input
                  :value="editing.tags?.join('、')"
                  type="text"
                  placeholder="白皮书、组织、趋势"
                  class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none"
                  @input="(e: any) => editing!.tags = e.target.value.split(/[、,]/).map((s: string) => s.trim()).filter(Boolean)"
                />
              </div>

              <div class="mt-4">
                <label class="text-base text-ink-100">文件上传</label>
                <p class="mt-0.5 text-xs text-ink-300">支持 PDF、Word 文档（DOC/DOCX）、Markdown、ZIP 压缩包，单个文件 ≤ {{ formatSizeLimit(MAX_FILE_SIZE_MB) }}</p>
                <input
                  ref="fileInput"
                  type="file"
                  accept=".pdf,.doc,.docx,.md,.zip"
                  class="mt-2 w-full text-base text-ink-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gold-500/10 file:text-gold-300 hover:file:bg-gold-500/20"
                />
                <div v-if="editing.fileUrl" class="mt-2 text-sm text-ink-200">
                  当前文件: <a :href="editing.fileUrl" target="_blank" class="text-gold-400 underline">{{ editing.fileName || editing.fileUrl }}</a>
                </div>
              </div>
            </div>

            <!-- 分组 5：发布设置 -->
            <div>
              <h3 class="text-base font-semibold text-gold-300">五、发布设置</h3>

              <div class="mt-4 flex flex-wrap items-center gap-8">
                <label class="flex items-center gap-2 text-base text-ink-100">
                  <input
                    v-model="editing.isFeatured"
                    type="checkbox"
                    class="h-4 w-4 rounded border-ink-700 bg-ink-950 text-gold-500 focus:ring-gold-500"
                  />
                  设为精选（首页置顶展示）
                </label>
                <div class="flex items-center gap-2">
                  <label class="text-base text-ink-100">排序值</label>
                  <input
                    v-model.number="editing.sortOrder"
                    type="number"
                    class="w-24 rounded-lg border border-ink-700 bg-ink-950 px-3 py-2 text-base text-ink-50"
                  />
                </div>
              </div>
            </div>

            <div v-if="errorMsg" class="text-base text-red-400">
              ⚠ {{ errorMsg }}
            </div>
          </div>

          <div class="mt-8 flex justify-end gap-3">
            <button
              type="button"
              class="rounded-lg border border-ink-700 bg-ink-950 px-5 py-2.5 text-base text-ink-100 hover:border-ink-600"
              @click="showDialog = false"
            >
              取消
            </button>
            <button
              type="button"
              :disabled="submitting"
              class="rounded-lg bg-gold-500 px-5 py-2.5 text-base font-medium text-ink-950 hover:bg-gold-400 disabled:opacity-50"
              @click="submit"
            >
              {{ submitting ? '保存中…' : '保存' }}
            </button>
          </div>
        </div>
      </div>

  </div>
</template>