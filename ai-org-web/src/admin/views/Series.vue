<script setup lang="ts">
/**
 * 后台 · 系列管理 / Series
 * --------------------------------------------------------------------------
 *  Step 6：替代 prisma seed 脚本，让运营用 UI 增删改系列 + 子主题
 *
 *  - 数据源：GET /api/series/admin/list
 *  - 创建：POST /api/series/admin
 *  - 编辑：PUT  /api/series/admin/:id
 *  - 删除：DELETE /api/series/admin/:id（有未删文章会被后端拒绝）
 *  - 子主题：整体替换语义（传空数组 = 清空）
 */
import { computed, onMounted, ref } from 'vue'
import { api, type AdminSeries, type AdminSeriesUpsertPayload, type NavSection, NAV_SECTION_LABEL } from '@/api/server'

const items = ref<AdminSeries[]>([])
const loading = ref(false)
const errorMsg = ref('')
const showDialog = ref(false)
const editing = ref<AdminSeries | null>(null)
const submitting = ref(false)

// 列表筛选
const filterNavSection = ref<NavSection | ''>('')
const filterKeyword = ref('')

const NAV_OPTIONS: { v: NavSection; label: string; path: string }[] = [
  { v: 'learn', label: '学习 · /learn', path: '/learn' },
  { v: 'understand', label: '认知 · /understand', path: '/understand' },
  { v: 'experience', label: '体验 · /experience', path: '/experience' },
]

/** 加载列表 */
async function load() {
  loading.value = true
  errorMsg.value = ''
  try {
    const params: { navSection?: NavSection; keyword?: string } = {}
    if (filterNavSection.value) params.navSection = filterNavSection.value
    if (filterKeyword.value.trim()) params.keyword = filterKeyword.value.trim()
    items.value = await api.adminListSeries(params)
  } catch (e: any) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(load)

/** 进入编辑模式 */
function openCreate() {
  editing.value = {
    id: '',
    slug: '',
    label: '',
    en: '',
    desc: '',
    navSection: filterNavSection.value || 'understand',
    sortOrder: 0,
    isPublished: true,
    topics: [],
    contentsCount: 0,
    createdAt: '',
    updatedAt: '',
  } as AdminSeries
  showDialog.value = true
}

function openEdit(s: AdminSeries) {
  // 深拷贝避免改表单时影响列表显示
  editing.value = JSON.parse(JSON.stringify(s)) as AdminSeries
  showDialog.value = true
}

async function save() {
  if (!editing.value) return
  submitting.value = true
  errorMsg.value = ''
  try {
    const e = editing.value
    const payload: AdminSeriesUpsertPayload = {
      slug: e.slug,
      navSection: e.navSection,
      label: e.label,
      en: e.en || '',
      desc: e.desc || '',
      cover: e.cover || '',
      sortOrder: e.sortOrder ?? 0,
      isPublished: e.isPublished ?? true,
      topics: (e.topics ?? []).map((t, i) => ({
        id: t.id || undefined,
        slug: t.slug,
        name: t.name,
        sortOrder: t.sortOrder ?? i,
      })),
    }
    if (e.id) {
      await api.adminUpdateSeries(e.id, payload)
    } else {
      await api.adminCreateSeries(payload)
    }
    showDialog.value = false
    editing.value = null
    await load()
  } catch (e: any) {
    errorMsg.value = e.message
  } finally {
    submitting.value = false
  }
}

async function remove(s: AdminSeries) {
  const c = s.contentsCount ?? 0
  if (c > 0) {
    alert(`该系列下还有 ${c} 篇文章未删除，无法删除。请先去「文章管理」清理。`)
    return
  }
  if (!confirm(`确定删除「${s.label}」？`)) return
  try {
    await api.adminDeleteSeries(s.id)
    await load()
  } catch (e: any) {
    alert(e.message)
  }
}

async function togglePublish(s: AdminSeries) {
  try {
    await api.adminUpdateSeries(s.id, {
      slug: s.slug,
      navSection: s.navSection,
      label: s.label,
      en: s.en ?? '',
      desc: s.desc ?? '',
      cover: s.cover || '',
      sortOrder: s.sortOrder,
      isPublished: !s.isPublished,
      topics: (s.topics ?? []).map((t, i) => ({
        id: t.id, slug: t.slug, name: t.name, sortOrder: t.sortOrder ?? i,
      })),
    })
    await load()
  } catch (e: any) {
    alert(e.message)
  }
}

/** 前台预览链接 */
function previewHref(s: { slug: string; navSection: NavSection }): string {
  if (s.navSection === 'understand') return `/understand/series/${s.slug}`
  return `/${s.navSection}`
}

// 子主题 UI 操作
function addTopic() {
  if (!editing.value) return
  if (!editing.value.topics) editing.value.topics = []
  editing.value.topics.push({
    id: '',
    slug: '',
    name: '',
    sortOrder: editing.value.topics.length,
  })
}
function removeTopic(i: number) {
  if (!editing.value?.topics) return
  editing.value.topics.splice(i, 1)
}
function moveTopic(i: number, dir: -1 | 1) {
  if (!editing.value?.topics) return
  const arr = editing.value.topics
  const j = i + dir
  if (j < 0 || j >= arr.length) return
  const tmp = arr[i]
  arr[i] = arr[j]
  arr[j] = tmp
  // 重排 sortOrder
  arr.forEach((t, k) => { t.sortOrder = k })
}

const totalLabel = computed(() => {
  const total = items.value.length
  if (total === 0) return '没有系列'
  if (filterNavSection.value) return `${total} 个「${NAV_SECTION_LABEL[filterNavSection.value]}」系列`
  return `共 ${total} 个`
})
</script>

<template>
  <div class="min-h-screen bg-ink-950 pt-24 pb-30">
    <div class="container-wide">

      <div class="flex items-center justify-between mb-8">
        <div>
          <RouterLink to="/admin" class="text-xs text-ink-200 hover:text-gold-300">← 控制台</RouterLink>
          <h1 class="mt-2 text-3xl font-display font-medium text-ink-50">系列管理</h1>
          <p class="mt-2 text-sm text-ink-200">管理「学习 / 认知 / 体验」三大栏目下的系列与子主题</p>
        </div>
        <button
          type="button"
          class="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-medium text-ink-950 hover:bg-gold-400"
          @click="openCreate"
        >
          + 新建系列
        </button>
      </div>

      <!-- 筛选栏 -->
      <div class="mb-6 flex flex-wrap items-end gap-4 rounded-xl border border-ink-700 bg-ink-900 p-4">
        <div>
          <label class="text-xs text-ink-200">栏目归属</label>
          <select v-model="filterNavSection" class="mt-1 block w-48 rounded-lg border border-ink-700 bg-ink-950 px-3 py-2 text-sm text-ink-50">
            <option value="">全部栏目</option>
            <option v-for="n in NAV_OPTIONS" :key="n.v" :value="n.v">{{ n.label }}</option>
          </select>
        </div>
        <div class="flex-1 min-w-[200px]">
          <label class="text-xs text-ink-200">关键词</label>
          <input v-model="filterKeyword" type="text" placeholder="搜索标题 / slug / 英文名" class="mt-1 block w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2 text-sm text-ink-50" />
        </div>
        <button type="button" class="rounded-lg border border-ink-700 bg-ink-950 px-4 py-2 text-sm text-ink-100 hover:border-gold-500 hover:text-gold-300" @click="load">应用筛选</button>
        <div class="text-xs text-ink-200">{{ totalLabel }}</div>
      </div>

      <div v-if="loading" class="py-12 text-center text-sm text-ink-200">加载中…</div>

      <div v-else-if="items.length === 0" class="py-16 text-center text-sm text-ink-200">
        当前筛选下没有系列。
        <span class="block mt-2 text-xs text-ink-300">
          试试切换栏目归属 / 清空关键词 / 新建一个系列。
        </span>
      </div>

      <div v-else class="rounded-xl border border-ink-700 bg-ink-900 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-ink-950 text-sm text-ink-200">
            <tr>
              <th class="px-4 py-3 text-left">标题 / Slug</th>
              <th class="px-4 py-3 text-left">栏目</th>
              <th class="px-4 py-3 text-left">子主题</th>
              <th class="px-4 py-3 text-left">文章数</th>
              <th class="px-4 py-3 text-left">排序</th>
              <th class="px-4 py-3 text-left">状态</th>
              <th class="px-4 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in items" :key="s.id" class="border-t border-ink-800">
              <td class="px-4 py-3">
                <div class="text-ink-50">{{ s.label }}</div>
                <div class="text-xs text-ink-200 mt-1">/{{ s.slug }}<span v-if="s.en"> · {{ s.en }}</span></div>
              </td>
              <td class="px-4 py-3">
                <span class="rounded px-2 py-0.5 text-xs font-mono"
                  :class="{
                    'bg-gold-500/15 text-gold-300': s.navSection === 'learn',
                    'bg-blue-500/15 text-blue-300': s.navSection === 'understand',
                    'bg-emerald-500/15 text-emerald-300': s.navSection === 'experience',
                  }"
                >
                  {{ NAV_SECTION_LABEL[s.navSection] }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div v-if="s.topics.length === 0" class="text-xs text-ink-300">—</div>
                <div v-else class="flex flex-wrap gap-1 max-w-xs">
                  <span v-for="t in s.topics" :key="t.id" class="rounded bg-ink-800 px-1.5 py-0.5 text-[10px] text-ink-100">
                    {{ t.name }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 text-xs">
                <span class="text-ink-50 font-mono">{{ s.contentsCount }}</span>
                <span class="text-ink-300 ml-1">篇</span>
              </td>
              <td class="px-4 py-3 text-xs text-ink-200 font-mono">{{ s.sortOrder }}</td>
              <td class="px-4 py-3">
                <button
                  type="button"
                  class="text-xs px-2 py-1 rounded"
                  :class="s.isPublished ? 'bg-green-500/20 text-green-300' : 'bg-ink-800 text-ink-200'"
                  @click="togglePublish(s)"
                >
                  {{ s.isPublished ? '已发布' : '草稿' }}
                </button>
                <span v-if="s.deletedAt" class="ml-2 text-[10px] text-red-400">已软删</span>
              </td>
              <td class="px-4 py-3 text-right">
                <a
                  v-if="s.isPublished"
                  :href="previewHref(s)"
                  target="_blank"
                  rel="noopener"
                  class="text-xs text-ink-100 hover:text-gold-300 mr-3"
                >预览</a>
                <button class="text-xs text-gold-400 hover:text-gold-300 mr-3" @click="openEdit(s)">编辑</button>
                <button
                  class="text-xs text-red-400 hover:text-red-300"
                  :class="{ 'opacity-50 cursor-not-allowed': s.contentsCount > 0 }"
                  :disabled="s.contentsCount > 0"
                  :title="s.contentsCount > 0 ? `还有 ${s.contentsCount} 篇文章未删` : ''"
                  @click="remove(s)"
                >删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 编辑弹层 -->
    <div
      v-if="showDialog && editing"
      class="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 backdrop-blur-sm p-4"
      @click.self="showDialog = false"
    >
      <div class="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-ink-700 bg-ink-900 p-8">
        <h2 class="text-2xl font-medium text-ink-50">
          {{ editing.id ? '编辑系列' : '新建系列' }}
        </h2>
        <p class="mt-2 text-base text-ink-200">
          「系列」是一组相关认知/内容的容器。子主题是系列下的二级分类，运营可在此处增删。
        </p>

        <div class="mt-6 space-y-7">

          <!-- 分组 1：基础信息 -->
          <div>
            <h3 class="text-base font-semibold text-gold-300">一、基础信息</h3>

            <div class="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label class="text-base text-ink-100">栏目归属 <span class="text-red-400">*</span></label>
                <select v-model="editing.navSection" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none">
                  <option v-for="n in NAV_OPTIONS" :key="n.v" :value="n.v">{{ n.label }}</option>
                </select>
              </div>
              <div>
                <label class="text-base text-ink-100">URL 路径（Slug） <span class="text-red-400">*</span></label>
                <p class="mt-0.5 text-xs text-ink-300">
                  前台预览：
                  <code class="text-gold-300">{{ previewHref(editing) }}</code>
                </p>
                <input v-model="editing.slug" type="text" placeholder="ai-changing-what" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none" />
              </div>
            </div>

            <div class="mt-4">
              <label class="text-base text-ink-100">系列标题（中文） <span class="text-red-400">*</span></label>
              <input v-model="editing.label" type="text" placeholder="AI 正在改变什么" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none" />
            </div>

            <div class="mt-4">
              <label class="text-base text-ink-100">英文 / 副标题</label>
              <input v-model="editing.en" type="text" placeholder="AI Changing What" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none" />
            </div>

            <div class="mt-4">
              <label class="text-base text-ink-100">系列描述</label>
              <p class="mt-0.5 text-xs text-ink-300">会显示在前台专题页顶部</p>
              <textarea v-model="editing.desc" rows="2" placeholder="一句话或一段话说明这个系列是关于什么的" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none"></textarea>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label class="text-base text-ink-100">排序权重</label>
                <p class="mt-0.5 text-xs text-ink-300">数字越小越靠前</p>
                <input v-model.number="editing.sortOrder" type="number" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none" />
              </div>
              <div class="flex items-end">
                <label class="flex items-center gap-2 text-base text-ink-100">
                  <input v-model="editing.isPublished" type="checkbox" class="h-4 w-4 rounded border-ink-700 bg-ink-950 text-gold-500 focus:ring-gold-500" />
                  立即发布（未勾选则为草稿）
                </label>
              </div>
            </div>
          </div>

          <!-- 分组 2：子主题 -->
          <div>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-base font-semibold text-gold-300">二、子主题</h3>
                <p class="mt-1 text-sm text-ink-200">系列下的二级分类。整体替换语义：保存时会以这里的内容为准</p>
              </div>
              <button
                type="button"
                class="rounded-lg border border-gold-700/40 bg-gold-500/5 px-3 py-1.5 text-sm text-gold-300 hover:border-gold-500 hover:bg-gold-500/10"
                @click="addTopic"
              >
                + 添加子主题
              </button>
            </div>

            <div v-if="!editing.topics || editing.topics.length === 0" class="mt-4 rounded-lg border border-dashed border-ink-700 p-6 text-center text-sm text-ink-300">
              还没有子主题。可以加几个试试。
            </div>

            <div v-else class="mt-4 space-y-3">
              <div
                v-for="(t, i) in editing.topics"
                :key="i"
                class="rounded-lg border border-ink-700 bg-ink-950 p-4"
              >
                <div class="flex items-center justify-between mb-3">
                  <span class="font-mono text-xs text-ink-200">子主题 #{{ i + 1 }}</span>
                  <div class="flex items-center gap-1">
                    <button type="button" class="rounded p-1 text-xs text-ink-200 hover:text-gold-300" @click="moveTopic(i, -1)" :disabled="i === 0">↑</button>
                    <button type="button" class="rounded p-1 text-xs text-ink-200 hover:text-gold-300" @click="moveTopic(i, 1)" :disabled="i === editing!.topics!.length - 1">↓</button>
                    <button type="button" class="rounded p-1 text-xs text-red-400 hover:text-red-300" @click="removeTopic(i)">✕</button>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-xs text-ink-200">Slug</label>
                    <input v-model="t.slug" type="text" placeholder="tech-evolution" class="mt-1 w-full rounded border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-ink-50 focus:border-gold-500 focus:outline-none" />
                  </div>
                  <div>
                    <label class="text-xs text-ink-200">中文名</label>
                    <input v-model="t.name" type="text" placeholder="技术演进" class="mt-1 w-full rounded border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-ink-50 focus:border-gold-500 focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="errorMsg" class="text-base text-red-400">⚠ {{ errorMsg }}</div>
        </div>

        <div class="mt-8 flex justify-between gap-3">
          <a
            v-if="editing.id && editing.isPublished"
            :href="previewHref(editing)"
            target="_blank"
            rel="noopener"
            class="rounded-lg border border-ink-700 bg-ink-950 px-5 py-2.5 text-base text-ink-100 hover:border-gold-500 hover:text-gold-300"
          >↗ 前台预览</a>
          <span v-else></span>
          <div class="flex gap-3">
            <button type="button" class="rounded-lg border border-ink-700 bg-ink-950 px-5 py-2.5 text-base text-ink-100 hover:border-ink-600" @click="showDialog = false">取消</button>
            <button type="button" :disabled="submitting" class="rounded-lg bg-gold-500 px-5 py-2.5 text-base font-medium text-ink-950 hover:bg-gold-400 disabled:opacity-50" @click="save">
              {{ submitting ? '保存中…' : '保存' }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>