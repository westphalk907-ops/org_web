<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { api, type Content, type ContentCategory, type NavSection, type Series, type SubTopic, NAV_SECTION_LABEL } from '@/api/server'
import ImageUploader from '@/admin/components/ImageUploader.vue'
import MarkdownEditor from '@/admin/components/MarkdownEditor.vue'

const items = ref<Content[]>([])
const loading = ref(false)
const errorMsg = ref('')
const showDialog = ref(false)
const editing = ref<Content | null>(null)
const submitting = ref(false)

// 列表筛选
const filterNavSection = ref<NavSection | ''>('')
const filterCategory = ref<ContentCategory | ''>('')
const filterKeyword = ref('')

// 系列 / 子主题数据（按 navSection 过滤后缓存）
const allSeries = ref<Series[]>([])
const seriesForCurrentNav = computed<Series[]>(() => {
  const ns = editing.value?.navSection || filterNavSection.value
  if (!ns) return allSeries.value
  return allSeries.value.filter((s) => s.navSection === ns)
})
const subTopicsForSeries = computed<SubTopic[]>(() => {
  if (!editing.value?.seriesId) return []
  const s = allSeries.value.find((x) => x.id === editing.value!.seriesId)
  return s?.topics ?? []
})

// 列表中 id → Series 的快速查找（用于在表格里显示系列名）
const seriesById = computed<Map<string, Series>>(() => {
  const m = new Map<string, Series>()
  for (const s of allSeries.value) m.set(s.id, s)
  return m
})

const CATEGORY_OPTIONS: { v: ContentCategory; zh: string; en: string }[] = [
  { v: 'trend', zh: '趋势', en: 'TREND' },
  { v: 'point_of_view', zh: '观点', en: 'POINT OF VIEW' },
  { v: 'field_note', zh: '实践', en: 'FIELD NOTE' },
  { v: 'insight', zh: '深度洞察', en: 'INSIGHT' },
  { v: 'research', zh: '研究', en: 'RESEARCH' },
  { v: 'whitepaper', zh: '白皮书', en: 'WHITEPAPER' },
  { v: 'playbook', zh: '行动手册', en: 'PLAYBOOK' },
  { v: 'framework', zh: '框架', en: 'FRAMEWORK' },
]

const NAV_OPTIONS: { v: NavSection; label: string; path: string }[] = [
  { v: 'learn', label: '学习 · /learn', path: '/learn' },
  { v: 'understand', label: '认知 · /understand', path: '/understand' },
  { v: 'experience', label: '体验 · /experience', path: '/experience' },
]

/** 根据 navSection 计算前台预览链接 */
function previewHref(c: Content): string {
  const ns = c.navSection || 'learn'
  return `${NAV_PATH[ns as NavSection] || '/learn'}/${c.slug}`
}

const NAV_PATH: Record<NavSection, string> = {
  learn: '/learn',
  understand: '/understand',
  experience: '/experience',
}

async function load() {
  loading.value = true
  try {
    const params: any = { pageSize: 100 }
    if (filterNavSection.value) params.navSection = filterNavSection.value
    if (filterCategory.value) params.category = filterCategory.value
    if (filterKeyword.value.trim()) params.keyword = filterKeyword.value.trim()
    const result = await api.adminListContents(params)
    items.value = result.items
  } catch (e: any) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}

/** 加载所有系列（含子主题）。一次拿全量，前端按 navSection 过滤。 */
async function loadAllSeries() {
  try {
    allSeries.value = await api.listSeries()
  } catch (e: any) {
    // 系列加载失败不应该阻塞主列表；仅记录
    console.warn('[Articles] 加载系列失败:', e?.message ?? e)
  }
}

onMounted(() => {
  load()
  loadAllSeries()
})
watch([filterNavSection, filterCategory, filterKeyword], () => {
  load()
})

// 切换栏目时，清空已选的系列/子主题（因为新栏目下当前系列不可用）
watch(() => editing.value?.navSection, (newNs, oldNs) => {
  if (!editing.value) return
  if (newNs && newNs !== oldNs) {
    editing.value.seriesId = null
    editing.value.subTopicId = null
  }
})

// 切换系列时，清空已选的子主题（因为子主题列表变了）
watch(() => editing.value?.seriesId, (newSid) => {
  if (!editing.value) return
  if (newSid && editing.value.subTopicId) {
    const valid = subTopicsForSeries.value.some((st) => st.id === editing.value!.subTopicId)
    if (!valid) editing.value.subTopicId = null
  }
})

function openCreate() {
  editing.value = {
    id: '',
    slug: '',
    category: 'trend',
    title: '',
    excerpt: '',
    content: '',
    publishedAt: new Date().toISOString(),
    isPublished: false,
    navSection: filterNavSection.value || 'learn',
    seriesId: null,
    subTopicId: null,
    tags: [],
    viewCount: 0,
    likeCount: 0,
    contentHtml: '',
  } as Content
  showDialog.value = true
}

function openEdit(c: Content) {
  const copy = JSON.parse(JSON.stringify(c)) as Content
  if (!copy.navSection) copy.navSection = 'learn'
  // 老数据可能没 seriesId/subTopicId 字段，补上
  if (copy.seriesId === undefined) copy.seriesId = null
  if (copy.subTopicId === undefined) copy.subTopicId = null
  editing.value = copy
  showDialog.value = true
}

async function save() {
  if (!editing.value) return
  submitting.value = true
  try {
    const e = editing.value
    const payload: Partial<Content> = {
      slug: e.slug,
      // 后端 zod enum 严格小写；万一上游传了大写做一次归一化，避免 422
      category: (e.category as string)?.toLowerCase() as Content['category'],
      navSection: e.navSection || 'learn',
      title: e.title,
      subtitle: e.subtitle,
      excerpt: e.excerpt,
      cover: e.cover,
      content: e.content,
      author: e.author,
      tags: e.tags,
      sourceUrl: e.sourceUrl,
      sourcePlatform: e.sourcePlatform,
      isPublished: e.isPublished,
      // 后端 zod 接收 seriesId/subTopicId 为可空 string，null 也可
      seriesId: e.seriesId ?? null,
      subTopicId: e.subTopicId ?? null,
    }
    if (e.id) {
      await api.adminUpdateContent(e.id, payload)
    } else {
      await api.adminCreateContent(payload)
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

async function remove(c: Content) {
  if (!confirm(`确定删除「${c.title}」？`)) return
  try {
    await api.adminDeleteContent(c.id)
    await load()
  } catch (e: any) {
    alert(e.message)
  }
}

async function togglePublish(c: Content) {
  c.isPublished = !c.isPublished
  await api.adminUpdateContent(c.id, { isPublished: c.isPublished })
  await load()
}

const totalLabel = computed(() => {
  const total = items.value.length
  if (total === 0) return '没有文章'
  if (filterNavSection.value) return `${total} 篇「${NAV_SECTION_LABEL[filterNavSection.value]}」文章`
  return `共 ${total} 篇`
})
</script>

<template>
  <div class="min-h-screen bg-ink-950 pt-24 pb-30">
    <div class="container-wide">

      <div class="flex items-center justify-between mb-8">
        <div>
          <RouterLink to="/admin" class="text-xs text-ink-200 hover:text-gold-300">← 控制台</RouterLink>
          <h1 class="mt-2 text-3xl font-display font-medium text-ink-50">文章管理</h1>
          <p class="mt-2 text-sm text-ink-200">统一管理「学习 / 认知 / 体验」三个栏目下的全部文章</p>
        </div>
        <button
          type="button"
          class="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-medium text-ink-950 hover:bg-gold-400"
          @click="openCreate"
        >
          + 新建文章
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
        <div>
          <label class="text-xs text-ink-200">文章分类</label>
          <select v-model="filterCategory" class="mt-1 block w-44 rounded-lg border border-ink-700 bg-ink-950 px-3 py-2 text-sm text-ink-50">
            <option value="">全部分类</option>
            <option v-for="c in CATEGORY_OPTIONS" :key="c.v" :value="c.v">{{ c.zh }}</option>
          </select>
        </div>
        <div class="flex-1 min-w-[200px]">
          <label class="text-xs text-ink-200">关键词</label>
          <input v-model="filterKeyword" type="text" placeholder="搜索标题或摘要" class="mt-1 block w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2 text-sm text-ink-50" />
        </div>
        <div class="text-xs text-ink-200">{{ totalLabel }}</div>
      </div>

      <div v-if="loading" class="py-12 text-center text-sm text-ink-200">加载中…</div>

      <div v-else-if="items.length === 0" class="py-16 text-center text-sm text-ink-200">
        当前筛选下没有文章。
        <span class="block mt-2 text-xs text-ink-300">
          试试切换栏目归属 / 分类 / 清空关键词。
        </span>
      </div>

      <div v-else class="rounded-xl border border-ink-700 bg-ink-900 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-ink-950 text-sm text-ink-200">
            <tr>
              <th class="px-4 py-3 text-left">标题</th>
              <th class="px-4 py-3 text-left">栏目</th>
              <th class="px-4 py-3 text-left">分类</th>
              <th class="px-4 py-3 text-left">系列</th>
              <th class="px-4 py-3 text-left">作者</th>
              <th class="px-4 py-3 text-left">状态</th>
              <th class="px-4 py-3 text-left">发布日期</th>
              <th class="px-4 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in items" :key="c.id" class="border-t border-ink-800">
              <td class="px-4 py-3">
                <div class="text-ink-50">{{ c.title }}</div>
                <div class="text-xs text-ink-200 mt-1">/{{ c.slug }} · {{ c.readingTime }} 分钟</div>
              </td>
              <td class="px-4 py-3">
                <span class="rounded px-2 py-0.5 text-xs font-mono"
                  :class="{
                    'bg-gold-500/15 text-gold-300': c.navSection === 'learn',
                    'bg-blue-500/15 text-blue-300': c.navSection === 'understand',
                    'bg-emerald-500/15 text-emerald-300': c.navSection === 'experience',
                  }"
                >
                  {{ NAV_SECTION_LABEL[(c.navSection as NavSection) || 'learn'] }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="text-xs text-ink-100">{{ c.category }}</span>
              </td>
              <td class="px-4 py-3">
                <span v-if="c.seriesId && seriesById.get(c.seriesId)" class="rounded px-2 py-0.5 text-xs bg-ink-800 text-ink-100">
                  {{ seriesById.get(c.seriesId)!.label }}
                </span>
                <span v-else class="text-xs text-ink-300">—</span>
              </td>
              <td class="px-4 py-3 text-xs text-ink-200">{{ c.author || '—' }}</td>
              <td class="px-4 py-3">
                <button
                  type="button"
                  class="text-xs px-2 py-1 rounded"
                  :class="c.isPublished ? 'bg-green-500/20 text-green-300' : 'bg-ink-800 text-ink-200'"
                  @click="togglePublish(c)"
                >
                  {{ c.isPublished ? '已发布' : '草稿' }}
                </button>
              </td>
              <td class="px-4 py-3 text-xs text-ink-200">{{ c.publishedAt.split('T')[0] }}</td>
              <td class="px-4 py-3 text-right">
                <a
                  v-if="c.slug"
                  :href="previewHref(c)"
                  target="_blank"
                  rel="noopener"
                  class="text-xs text-ink-100 hover:text-gold-300 mr-3"
                >预览</a>
                <button class="text-xs text-gold-400 hover:text-gold-300 mr-3" @click="openEdit(c)">编辑</button>
                <button class="text-xs text-red-400 hover:text-red-300" @click="remove(c)">删除</button>
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
          {{ editing.id ? '编辑文章' : '新建文章' }}
        </h2>
        <p class="mt-2 text-base text-ink-200">
          填写说明见下方分组。「栏目归属」决定文章在哪个前台门户可以访问。
        </p>

        <div class="mt-6 space-y-7">

          <!-- 分组 1：基础信息 -->
          <div>
            <h3 class="text-base font-semibold text-gold-300">一、基础信息</h3>
            <p class="mt-1 text-sm text-ink-200">设置文章归类与访问路径</p>

            <div class="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label class="text-base text-ink-100">栏目归属 <span class="text-red-400">*</span></label>
                <p class="mt-0.5 text-xs text-ink-300">决定前台从哪个门户可访问（决定详情页 URL）</p>
                <select v-model="editing.navSection" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none">
                  <option v-for="n in NAV_OPTIONS" :key="n.v" :value="n.v">{{ n.label }}</option>
                </select>
              </div>
              <div>
                <label class="text-base text-ink-100">文章分类 <span class="text-red-400">*</span></label>
                <p class="mt-0.5 text-xs text-ink-300">决定卡片上的徽章（趋势 / 观点 / 框架…）</p>
                <select v-model="editing.category" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none">
                  <option v-for="c in CATEGORY_OPTIONS" :key="c.v" :value="c.v">{{ c.zh }}（{{ c.en }}）</option>
                </select>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label class="text-base text-ink-100">所属系列</label>
                <p class="mt-0.5 text-xs text-ink-300">仅显示当前栏目下的系列；留空表示不归类</p>
                <select
                  v-model="editing.seriesId"
                  class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none"
                  :disabled="!editing.navSection"
                >
                  <option :value="null">— 不归类 —</option>
                  <option v-for="s in seriesForCurrentNav" :key="s.id" :value="s.id">{{ s.label }}</option>
                </select>
              </div>
              <div>
                <label class="text-base text-ink-100">子主题</label>
                <p class="mt-0.5 text-xs text-ink-300">仅在选了系列后可选项</p>
                <select
                  v-model="editing.subTopicId"
                  class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none disabled:opacity-50"
                  :disabled="!editing.seriesId || subTopicsForSeries.length === 0"
                >
                  <option :value="null">— 不选 —</option>
                  <option v-for="st in subTopicsForSeries" :key="st.id" :value="st.id">
                    {{ st.name }}{{ st.count !== undefined ? `（${st.count} 篇）` : '' }}
                  </option>
                </select>
              </div>
            </div>

            <div class="mt-4">
              <label class="text-base text-ink-100">URL 路径（Slug） <span class="text-red-400">*</span></label>
              <p class="mt-0.5 text-xs text-ink-300">
                前台访问链接：
                <code class="text-gold-300">{{ previewHref(editing) }}</code>
              </p>
              <input v-model="editing.slug" type="text" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none" />
            </div>
          </div>

          <!-- 分组 2：标题与摘要 -->
          <div>
            <h3 class="text-base font-semibold text-gold-300">二、标题与摘要</h3>
            <p class="mt-1 text-sm text-ink-200">用户第一眼看到的内容</p>

            <div class="mt-4">
              <label class="text-base text-ink-100">标题 <span class="text-red-400">*</span></label>
              <p class="mt-0.5 text-xs text-ink-300">建议 20 字以内，简洁有冲击力</p>
              <input v-model="editing.title" type="text" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none" />
            </div>

            <div class="mt-4">
              <label class="text-base text-ink-100">副标题</label>
              <p class="mt-0.5 text-xs text-ink-300">可选，英文版标题</p>
              <input v-model="editing.subtitle" type="text" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none" />
            </div>

            <div class="mt-4">
              <label class="text-base text-ink-100">摘要 <span class="text-red-400">*</span></label>
              <p class="mt-0.5 text-xs text-ink-300">1-2 句话点题，会显示在列表卡片和详情页顶部</p>
              <textarea v-model="editing.excerpt" rows="2" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none"></textarea>
            </div>
          </div>

          <!-- 分组 2.5：封面图 -->
          <div>
            <h3 class="text-base font-semibold text-gold-300">二·五、封面图</h3>
            <p class="mt-1 text-sm text-ink-200">
              支持点击 / 拖拽 / 粘贴；超过 2MB 自动压缩。建议 16:9 的横向图（结构框架图最合适）。
            </p>
            <div class="mt-4">
              <ImageUploader
                v-model="editing.cover"
                :aspect="'16/9'"
                placeholder="点击 / 拖拽 / 粘贴封面图"
              />
            </div>
          </div>

          <!-- 分组 3：正文 -->
          <div>
            <h3 class="text-base font-semibold text-gold-300">三、正文内容</h3>
            <p class="mt-1 text-sm text-ink-200">
              支持 GFM Markdown 语法。<span class="text-gold-300">工具栏 🖼 按钮 / 拖拽图片 / 粘贴图片</span> 都会自动上传并插入到光标位置。
            </p>

            <div class="mt-4">
              <label class="text-base text-ink-100">正文（Markdown） <span class="text-red-400">*</span></label>
              <p class="mt-0.5 text-xs text-ink-300">
                支持标题 # / 列表 - / 引用 > / 表格 / 代码块 / 加粗 **文字** / 链接 [文字](url) / 图片 ![](url) 等
              </p>
              <div class="mt-2">
                <MarkdownEditor
                  v-model="editing.content"
                  :rows="18"
                />
              </div>
            </div>
          </div>

          <!-- 分组 4：来源信息 -->
          <div>
            <h3 class="text-base font-semibold text-gold-300">四、来源信息</h3>
            <p class="mt-1 text-sm text-ink-200">转载文章时填写，用于标注出处</p>

            <div class="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label class="text-base text-ink-100">作者</label>
                <p class="mt-0.5 text-xs text-ink-300">可选，笔名或真名</p>
                <input v-model="editing.author" type="text" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none" />
              </div>
              <div>
                <label class="text-base text-ink-100">原文链接</label>
                <p class="mt-0.5 text-xs text-ink-300">例如：https://mp.weixin.qq.com/...</p>
                <input v-model="editing.sourceUrl" type="text" placeholder="https://..." class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none" />
              </div>
            </div>
          </div>

          <!-- 分组 5：标签与发布 -->
          <div>
            <h3 class="text-base font-semibold text-gold-300">五、标签与发布</h3>

            <div class="mt-4">
              <label class="text-base text-ink-100">标签</label>
              <p class="mt-0.5 text-xs text-ink-300">用中文顿号、或英文逗号分隔，例如：AI、组织、趋势</p>
              <input
                :value="editing.tags?.join('、')"
                type="text"
                placeholder="AI、组织、趋势"
                class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none"
                @input="(e: any) => editing!.tags = e.target.value.split(/[、,]/).map((s: string) => s.trim()).filter(Boolean)"
              />
            </div>

            <label class="mt-4 flex items-center gap-2 text-base text-ink-100">
              <input v-model="editing.isPublished" type="checkbox" class="h-4 w-4 rounded border-ink-700 bg-ink-950 text-gold-500 focus:ring-gold-500" />
              立即发布（未勾选则保存为草稿）
            </label>
          </div>

          <div v-if="errorMsg" class="text-base text-red-400">⚠ {{ errorMsg }}</div>
        </div>

        <div class="mt-8 flex justify-between gap-3">
          <a
            v-if="editing.slug"
            :href="previewHref(editing)"
            target="_blank"
            rel="noopener"
            class="rounded-lg border border-ink-700 bg-ink-950 px-5 py-2.5 text-base text-ink-100 hover:border-gold-500 hover:text-gold-300"
          >↗ 预览当前文章</a>
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
