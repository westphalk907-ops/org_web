# 认知 / 学习 / 体验 三大栏目优化方案

> 本文档面向「运营 + 开发」共同阅读。
> 记录三大栏目（`/understand`、`/learn`、`/experience`）当前的痛点、目标优化方向，以及完整可落地的改动清单。

---

## 一、当前痛点诊断

### 痛点 1：路由层级混乱

`src/router/routes.ts` 里有大量 redirect 跳转：

```
/understand/trends          → /understand/insights?category=trend
/understand/research        → /understand/insights?category=research
/learn/frameworks           → /resources?type=framework
/learn/playbooks            → /resources?type=playbook
/learn/whitepapers          → /resources?type=whitepaper
```

但 `learn/Index.vue` 本身又拉了 `navSection: learn` 的 Content 文章列表，而 Resources 是另一套完全不同的数据模型（白皮书 PDF / Skill / Prompt / Workflow 模板）。这意味着：

- 同一个"框架"概念，可能同时存在于 learn（Content）和 resources（Resource）两套地方，互相不通用。
- 用户进 `/learn/frameworks` 跳过去后看到的是 PDF 下载页，与"学习"的认知定位断裂。

### 痛点 2：栏目语义重叠

| 字段 | learn | understand | experience |
|---|---|---|---|
| 可挂载的 category | 全 8 种 | 全 8 种 | 全 8 种 |
| 前台 URL | `/learn/{slug}` | `/understand/{slug}` | `/experience/{slug}` |

`category`（trend / framework / playbook …）和 `navSection`（learn / understand / experience）是**两个正交维度**，但运营在后台填文章时，无法直观判断"这篇文章到底是'框架'还是'学习'"。同样的 framework 文章，可能既出现在 /learn 又出现在 /understand。

### 痛点 3：认知地图的子主题数字是死的

`src/data/insightMap.ts` 里：

```ts
{
  slug: 'ai-changing-what',
  label: 'AI 正在改变什么',
  topics: [
    { name: '技术演进', count: 12 },
    { name: 'Agent 形态', count: 8 },
    { name: '模型能力', count: 6 },
    { name: '产业趋势', count: 14 }
  ],
  articles: 40
}
```

`count` 和 `articles` 全部是**手填的静态数字**。无论数据库里实际有多少篇文章，前台永远显示 `12 / 8 / 6 / 14 / 40`——这是欺骗用户的"假数据"。

### 痛点 4：系列专题页拿不到正确数据

`Series.vue` 调用 `api.listContents({ nodeSlug: 'ai-changing-org' })`，但需要每篇文章上填 `nodeSlug = 'ai-changing-org'`。这个字段在后台 `Articles.vue` 里**根本没有表单输入框**，运营根本填不进去。

### 痛点 5：详情页没有"系列内推荐"

详情页底部没有"本系列其他文章"，无法引导用户在同系列内继续阅读，导致跳出率高。

---

## 二、优化目标（按优先级）

| # | 目标 | 优先级 | 影响 |
|---|---|---|---|
| 1 | 新增 Series / SubTopic 数据库表与外键 | P0 | 解决痛点 3、4 |
| 2 | 后台文章表单增加系列和子主题下拉框 | P0 | 让运营能正确挂载 |
| 3 | 认知地图数据动态化（读真实数据库） | P0 | 解决痛点 3 |
| 4 | `/learn` 子页改造为 Content 模式 | P1 | 解决痛点 1 |
| 5 | 详情页底部增加"系列内其他文章" | P1 | 解决痛点 5 |
| 6 | 体验栏目文章列表增加分类筛选 | P2 | 体验优化 |
| 7 | 学习栏目按系列组织（可选） | P3 | 远期 |

---

## 三、完整改动清单

### 改动 1：数据库 schema 升级

**文件**：`ai-org-server/prisma/schema.prisma`

新增两个模型 `Series` / `SubTopic`，并给 `Content` 加两个外键：

```prisma
// =====================================================================
// 系列 Series（认知地图节点 / 学习模块）
// 一个 Series 属于一个 navSection（栏目），有自己的 slug / title / desc / cover
// =====================================================================
model Series {
  id          String      @id @default(cuid())
  slug        String      @unique                  // ai-changing-what
  navSection  NavSection                          // learn / understand / experience
  title       String                              // AI 正在改变什么
  en          String?                             // AI Changing What
  desc        String?     @db.Text
  cover       String?
  sortOrder   Int         @default(0)
  isPublished Boolean     @default(true)

  subTopics   SubTopic[]
  contents    Content[]

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  deletedAt   DateTime?

  @@index([navSection, isPublished, deletedAt, sortOrder])
}

// =====================================================================
// 子主题 SubTopic（二级认知主题）
// 每个 SubTopic 属于一个 Series
// 例如 Series=ai-changing-what 下：技术演进 / Agent 形态 / 模型能力 / 产业趋势
// 注：(seriesId, slug) 组合唯一，确保同一系列下不重复
// =====================================================================
model SubTopic {
  id        String   @id @default(cuid())
  seriesId  String
  series    Series   @relation(fields: [seriesId], references: [id], onDelete: Cascade)

  slug      String                            // tech-evolution（同一系列内唯一）
  name      String                            // 技术演进
  sortOrder Int      @default(0)

  contents  Content[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // 业务唯一约束：同一 Series 下 slug 不能重复
  @@unique([seriesId, slug])
  @@index([seriesId, sortOrder])
}

// =====================================================================
// Content 模型追加字段（保留原有 nodeSlug 一段时间，兼容老数据）
// =====================================================================
model Content {
  // ... 现有所有字段保留 ...

  // === 新增：系列与子主题外键 ===
  seriesId    String?
  series      Series?  @relation(fields: [seriesId], references: [id], onDelete: SetNull)

  subTopicId  String?
  subTopic    SubTopic? @relation(fields: [subTopicId], references: [id], onDelete: SetNull)

  @@index([seriesId, subTopicId])
}
```

执行迁移：

```bash
cd ai-org-server
npx prisma migrate dev --name add_series_subtopic
```

**注意**：迁移完成后 Prisma Client 会重新生成，所有引用 `Content` 的 TypeScript 代码需要重启开发服务器才能识别新的 `seriesId` / `subTopicId` 字段。

---

### 改动 2：后端新增 Series API

**新增文件**：`ai-org-server/src/routes/series.routes.ts`

> ⚠️ 命名规范：项目已有的路由文件都用 `.routes.ts` 后缀（如 `content.routes.ts`），新建文件请保持一致。

```typescript
import { Router } from 'express'
import { prisma } from '../prisma'
import { ok, fail } from '../utils/response.js'

const router = Router()

/** 公开：按 navSection 列出所有 Series（含子主题和文章数） */
router.get('/', async (req, res, next) => {
  try {
    const { navSection } = req.query
    const where: any = { isPublished: true, deletedAt: null }
    if (navSection) where.navSection = String(navSection)

    const series = await prisma.series.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        subTopics: {
          orderBy: { sortOrder: 'asc' },
          include: {
            _count: { select: { contents: { where: { isPublished: true, deletedAt: null } } } }
          }
        },
        _count: { select: { contents: { where: { isPublished: true, deletedAt: null } } } }
      }
    })

    const result = series.map(s => ({
      id: s.id,
      slug: s.slug,
      label: s.title,
      en: s.en || '',
      desc: s.desc || '',
      cover: s.cover,
      navSection: s.navSection,
      articles: s._count.contents,
      frameworks: 0, // TODO: 后续统计 category=framework 的数量
      topics: s.subTopics.map(st => ({
        id: st.id,
        slug: st.slug,
        name: st.name,
        count: st._count.contents,
      }))
    }))

    res.json(ok(result))
  } catch (e) {
    next(e)
  }
})

/** 公开：单个系列详情（含子主题） */
router.get('/:slug', async (req, res, next) => {
  try {
    const slug = String(req.params.slug)
    const s = await prisma.series.findFirst({
      where: { slug, isPublished: true, deletedAt: null },
      include: {
        subTopics: { orderBy: { sortOrder: 'asc' } }
      }
    })
    if (!s) return res.status(404).json(fail('NOT_FOUND', '系列不存在'))
    res.json(ok(s))
  } catch (e) {
    next(e)
  }
})

export default router
```

**修改**：`ai-org-server/src/app.ts`，在"业务路由"区域注册：

```typescript
import seriesRoutes from './routes/series.routes.js'

// 紧挨着 contentRoutes 注册
app.use('/api/series', seriesRoutes)
```

**修改**：`ai-org-server/src/services/content.service.ts`，让 `listPublic` 支持 `seriesSlug` / `subTopicSlug` 筛选：

```typescript
// 在 listPublic 函数的 where 条件里追加
if (params.seriesSlug) {
  where.series = { slug: params.seriesSlug }
}
if (params.subTopicSlug) {
  where.subTopic = { slug: params.subTopicSlug }
}
```

**修改**：`ai-org-server/src/routes/content.routes.ts`，把这两个参数传给 service：

```typescript
router.get('/', async (req, res, next) => {
  try {
    const items = await contentService.listPublic({
      category: req.query.category as string | undefined,
      navSection: req.query.navSection as string | undefined,
      nodeSlug: req.query.nodeSlug as string | undefined,
      seriesSlug: req.query.seriesSlug as string | undefined,        // 新增
      subTopicSlug: req.query.subTopicSlug as string | undefined,    // 新增
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    })
    res.json(ok(items))
  } catch (e) { next(e) }
})
```

**修改 zod schema**：在 `content.routes.ts` 的 `CreateSchema` / `UpdateSchema` 加上新字段：

```typescript
const CreateSchema = z.object({
  // ... 现有字段 ...
  seriesId: z.string().optional().nullable(),
  subTopicId: z.string().optional().nullable(),
})

const UpdateSchema = CreateSchema.partial()
```

并把这两个字段透传到 `contentService.create` / `update`：

---

### 改动 3：种子数据（推荐）

**修改**：`ai-org-server/prisma/seed.ts`（或新建 `seed-series.ts`）

初始化三大系列与子主题，方便前台立即看到效果：

```typescript
const seriesData = [
  {
    slug: 'ai-changing-what',
    navSection: 'understand',
    title: 'AI 正在改变什么',
    en: 'AI Changing What',
    desc: '趋势 / 技术 / Agent / AI Evolution',
    sortOrder: 1,
    subTopics: [
      { slug: 'tech-evolution',   name: '技术演进',   sortOrder: 1 },
      { slug: 'agent-form',       name: 'Agent 形态', sortOrder: 2 },
      { slug: 'model-capability', name: '模型能力',   sortOrder: 3 },
      { slug: 'industry-trend',   name: '产业趋势',   sortOrder: 4 }
    ]
  },
  {
    slug: 'ai-changing-work',
    navSection: 'understand',
    title: 'AI 正在改变工作什么',
    en: 'AI Changing Work',
    desc: 'Individual / Work / Workflow',
    sortOrder: 2,
    subTopics: [
      { slug: 'individual',  name: '个人能力', sortOrder: 1 },
      { slug: 'function',    name: '职能岗位', sortOrder: 2 },
      { slug: 'work-style',  name: '工作方式', sortOrder: 3 },
      { slug: 'workflow',    name: '流程重构', sortOrder: 4 }
    ]
  },
  {
    slug: 'ai-changing-organization',
    navSection: 'understand',
    title: 'AI 为什么必须改变组织',
    en: 'AI Changing Organization',
    desc: 'Team / Management / Organization',
    sortOrder: 3,
    subTopics: [
      { slug: 'team-collab',  name: '团队协作', sortOrder: 1 },
      { slug: 'management',   name: '管理机制', sortOrder: 2 },
      { slug: 'org-design',   name: '组织设计', sortOrder: 3 },
      { slug: 'governance',   name: '治理与战略', sortOrder: 4 }
    ]
  }
]
```

---

### 改动 4：前端 API 客户端

**修改**：`ai-org-web/src/api/server.ts`，新增 Series API：

```typescript
export interface SeriesNode {
  id: string
  slug: string
  label: string
  en: string
  desc: string
  cover?: string
  navSection: NavSection
  articles: number
  frameworks: number
  topics: Array<{ id: string; slug: string; name: string; count: number }>
}

// 在 api 对象内新增
listSeries(params: { navSection?: NavSection } = {}) {
  if (!USE_BACKEND) {
    // mock 模式从静态数据返回（保留兼容）
    return Promise.resolve(
      COGNITION_PATH
        .filter(n => !params.navSection || params.navSection === 'understand')
        .map(n => ({
          id: n.slug,
          slug: n.slug,
          label: n.label,
          en: n.en,
          desc: n.desc,
          navSection: 'understand' as NavSection,
          articles: n.articles ?? 0,
          frameworks: n.frameworks ?? 0,
          topics: n.topics.map((t, i) => ({
            id: `${n.slug}-${i}`,
            slug: t.name,
            name: t.name,
            count: t.count ?? 0
          }))
        }))
    )
  }
  const qs = new URLSearchParams()
  if (params.navSection) qs.set('navSection', params.navSection)
  return request<SeriesNode[]>(`/series?${qs}`)
},

getSeries(slug: string) {
  if (!USE_BACKEND) {
    const n = COGNITION_PATH.find(c => c.slug === slug)
    return Promise.resolve(n as any)
  }
  return request<SeriesNode>(`/series/${slug}`)
},
```

---

### 改动 5：后台表单增加系列与子主题

**修改**：`ai-org-web/src/admin/views/Articles.vue`

#### 5.1 在 `<script setup>` 中新增：

```typescript
// 全部 Series + 子主题（启动时一次性加载）
const allSeries = ref<SeriesNode[]>([])
const allSubTopics = ref<Array<{ id: string; seriesId: string; slug: string; name: string }>>([])

// 当前编辑可用的 Series（按 navSection 过滤）
const availableSeries = computed(() => {
  const ns = editing.value?.navSection || 'learn'
  return allSeries.value.filter(s => s.navSection === ns)
})

// 当前选中 Series 下的 SubTopic
const availableSubTopics = computed(() => {
  const sid = editing.value?.seriesId
  if (!sid) return []
  return allSubTopics.value.filter(st => st.seriesId === sid)
})

async function loadSeriesAndTopics() {
  try {
    const list = await api.listSeries({})
    allSeries.value = list
    allSubTopics.value = list.flatMap(s =>
      s.topics.map(t => ({ id: t.id, seriesId: s.id, slug: t.slug, name: t.name }))
    )
  } catch (e: any) {
    console.error('加载系列失败', e)
  }
}

onMounted(() => {
  loadSeriesAndTopics()
  load()
})
```

#### 5.2 在编辑弹窗"基础信息"分组中追加两个下拉框：

```vue
<!-- 紧跟「栏目归属」「文章分类」之后 -->
<div class="mt-4 grid grid-cols-2 gap-4">
  <div>
    <label class="text-base text-ink-100">所属系列</label>
    <p class="mt-0.5 text-xs text-ink-300">选填。把文章归到认知地图的某个系列专题下</p>
    <select
      v-model="editing.seriesId"
      class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none"
    >
      <option :value="null">— 不属于任何系列 —</option>
      <option v-for="s in availableSeries" :key="s.id" :value="s.id">
        {{ s.label }}
      </option>
    </select>
  </div>

  <div>
    <label class="text-base text-ink-100">子主题</label>
    <p class="mt-0.5 text-xs text-ink-300">选填。决定文章显示在系列的哪个子标签下</p>
    <select
      v-model="editing.subTopicId"
      :disabled="!editing.seriesId"
      class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50 focus:border-gold-500 focus:outline-none disabled:opacity-50"
    >
      <option :value="null">— 不归子主题 —</option>
      <option v-for="st in availableSubTopics" :key="st.id" :value="st.id">
        {{ st.name }}
      </option>
    </select>
  </div>
</div>
```

#### 5.3 `save()` 函数 payload 增加字段：

```typescript
const payload: Partial<Content> = {
  slug: e.slug,
  category: e.category,
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
  // 新增
  seriesId: e.seriesId || null,
  subTopicId: e.subTopicId || null,
}
```

---

### 改动 6：认知地图数据动态化

**修改**：`ai-org-web/src/components/insight/CognitionPathSection.vue`

```typescript
// 把 load() 改成读真实 Series
async function load() {
  loading.value = true
  try {
    nodes.value = await api.listSeries({ navSection: 'understand' })
  } catch (e: any) {
    loadError.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}
```

模板不需要改动（数据 shape 兼容）。

---

### 改动 7：Series 专题页用外键查询

**修改**：`ai-org-web/src/views/understand/Series.vue`

```typescript
async function load() {
  loading.value = true
  error.value = null
  articles.value = []
  activeTopic.value = 'all'

  try {
    // 直接通过 seriesSlug 查询（不再用 nodeSlug 字符串匹配）
    const all = await api.listContents({ seriesSlug: slug.value, limit: 100 })
    articles.value = all
    // 同时拉节点信息（topics / count 是真实数据）
    node.value = await api.getSeries(slug.value) as any
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

// 子主题筛选：用 subTopicSlug 精确过滤
const filteredArticles = computed(() => {
  if (activeTopic.value === 'all') return articles.value
  const targetTopic = node.value?.topics?.find(
    (t: any) => t.slug === activeTopic.value || t.name === activeTopic.value
  )
  if (!targetTopic) return articles.value
  return articles.value.filter(a => a.subTopicId === targetTopic.id)
})
```

子主题 tab 上的 `count` 直接读取后端真实数量：

```vue
<button
  v-for="t in node.topics"
  :key="t.slug"
  type="button"
  class="rounded-full border px-4 py-1.5 transition-all"
  :class="activeTopic === t.slug || activeTopic === t.name ? '...' : '...'"
  @click="activeTopic = t.slug"
>
  <span class="font-medium">{{ t.name }}</span>
  <span class="ml-2 font-mono text-[10px] tabular-nums opacity-70">
    {{ t.count }}
  </span>
</button>
```

---

### 改动 8：/learn 子页改造（去 Resources 化）

**修改**：`ai-org-web/src/router/routes.ts`

```typescript
// 改造前（redirect 到 resources）
// { path: '/learn/frameworks', redirect: '/resources?type=framework' }

// 改造后（用 Content）
{
  path: '/learn/frameworks',
  name: 'learn.frameworks',
  component: () => import('@/views/learn/Index.vue'),
  meta: { title: '框架 · Learn' }
},
{
  path: '/learn/playbooks',
  name: 'learn.playbooks',
  component: () => import('@/views/learn/Index.vue'),
  meta: { title: '行动手册 · Learn' }
},
{
  path: '/learn/whitepapers',
  name: 'learn.whitepapers',
  component: () => import('@/views/learn/Index.vue'),
  meta: { title: '白皮书 · Learn' }
},
```

**修改**：`ai-org-web/src/views/learn/Index.vue`

```typescript
import { useRoute } from 'vue-router'
const route = useRoute()

// 顶部导航增加"全部"
const SUBNAV = [
  { label: '全部',      href: '/learn' },
  { label: '框架',      href: '/learn/frameworks' },
  { label: '行动手册',  href: '/learn/playbooks' },
  { label: '白皮书',    href: '/learn/whitepapers' }
]

async function load() {
  const params: any = { navSection: 'learn', limit: 60 }

  // 根据 URL 自动筛选
  const path = route.path
  if (path.endsWith('/frameworks'))   params.category = 'framework'
  else if (path.endsWith('/playbooks'))   params.category = 'playbook'
  else if (path.endsWith('/whitepapers')) params.category = 'whitepaper'

  const list = await api.listContents(params)
  items.value = list
    .filter(c => c.isPublished)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
}

watch(() => route.path, load)
onMounted(load)
```

---

### 改动 9：体验栏目增加文章分类筛选

**修改**：`ai-org-web/src/views/experience/Index.vue`

```typescript
const articleCategoryFilter = ref<string>('all')

const ARTICLE_CATEGORY_TABS = [
  { v: 'all',        zh: '全部' },
  { v: 'field_note', zh: '实践' },
  { v: 'framework',  zh: '框架' },
  { v: 'playbook',   zh: '手册' }
]

const filteredArticles = computed(() => {
  if (articleCategoryFilter.value === 'all') return articles.value
  return articles.value.filter(c => c.category === articleCategoryFilter.value)
})
```

```vue
<!-- 文章列表上方加一行 tab -->
<div class="mb-6 flex flex-wrap gap-2">
  <button
    v-for="cat in ARTICLE_CATEGORY_TABS"
    :key="cat.v"
    type="button"
    class="rounded-full border px-3 py-1 text-xs"
    :class="articleCategoryFilter === cat.v
      ? 'border-gold-500 bg-gold-500/10 text-gold-300'
      : 'border-ink-700 bg-ink-900 text-ink-100 hover:border-gold-700/40'"
    @click="articleCategoryFilter = cat.v"
  >
    {{ cat.zh }}
  </button>
</div>

<!-- 然后遍历 filteredArticles 替代 articles -->
```

---

### 改动 10：详情页底部增加系列内推荐

**修改**：`ai-org-web/src/views/understand/Detail.vue`、`learn/Detail.vue`

```typescript
const relatedInSeries = ref<Content[]>([])

async function loadRelated() {
  if (!article.value?.seriesId) return
  try {
    const all = await api.listContents({
      seriesSlug: article.value.seriesSlug || article.value.seriesId,
      limit: 6
    })
    relatedInSeries.value = all.filter(c => c.id !== article.value!.id).slice(0, 5)
  } catch (e) {
    console.error(e)
  }
}

// 在 load() 末尾调用 loadRelated()
```

```vue
<section v-if="relatedInSeries.length" class="mt-20 border-t border-ink-800 pt-12">
  <div class="container-reading">
    <div class="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-500 mb-4">
      本系列其他文章
    </div>
    <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
      <RouterLink
        v-for="r in relatedInSeries"
        :key="r.id"
        :to="`/${article.navSection}/${r.slug}`"
        class="rounded-lg border border-ink-700/60 bg-ink-900/40 p-4 hover:border-gold-500/40 transition-colors"
      >
        <div class="text-xs text-ink-200">{{ r.category }}</div>
        <h4 class="mt-1 text-sm text-ink-50 line-clamp-2">{{ r.title }}</h4>
      </RouterLink>
    </div>
  </div>
</section>
```

---

## 四、改动文件清单（按工作量排序）

| # | 文件 | 类型 | 改动量 | 必要性 |
|---|---|---|---|---|
| 1 | `ai-org-server/prisma/schema.prisma` | 修改 | +60 行 | 必须 |
| 2 | `ai-org-server/src/routes/series.routes.ts` | 新建 | ~80 行 | 必须 |
| 3 | `ai-org-server/src/routes/content.routes.ts` | 修改 | +15 行（zod schema + query 透传） | 必须 |
| 4 | `ai-org-server/src/services/content.service.ts` | 修改 | +10 行（where 条件加 seriesSlug / subTopicSlug） | 必须 |
| 5 | `ai-org-server/src/app.ts` | 修改 | +2 行（注册 series 路由） | 必须 |
| 6 | `ai-org-server/prisma/seed.ts` | 修改 | +50 行 | 推荐 |
| 7 | `ai-org-web/src/api/server.ts` | 修改 | +40 行 | 必须 |
| 8 | `ai-org-web/src/admin/views/Articles.vue` | 修改 | +80 行 | 必须 |
| 9 | `ai-org-web/src/components/insight/CognitionPathSection.vue` | 修改 | 改 10 行 | 必须 |
| 10 | `ai-org-web/src/views/understand/Series.vue` | 修改 | 改 30 行 | 必须 |
| 11 | `ai-org-web/src/router/routes.ts` | 修改 | 改 10 行 | 必须 |
| 12 | `ai-org-web/src/views/learn/Index.vue` | 修改 | 改 30 行 | 必须 |
| 13 | `ai-org-web/src/views/experience/Index.vue` | 修改 | 改 25 行 | 推荐 |
| 14 | `ai-org-web/src/views/understand/Detail.vue` | 修改 | 改 30 行 | 推荐 |
| 15 | `ai-org-web/src/views/learn/Detail.vue` | 修改 | 同上 | 推荐 |

**总计**：约 250 行新代码 + 100 行修改，分布在 15 个文件里。

---

## 五、改完后的效果

### 5.1 认知地图（首页）

进入 `/understand` 看到 3 张卡片：

> **AI 正在改变什么**
> 趋势 / 技术 / Agent / AI Evolution
> - 技术演进     3 篇
> - Agent 形态   5 篇
> - 模型能力     2 篇
> - 产业趋势     8 篇
> 文章 18 · 框架 4

这些数字是**数据库真实统计**，不再是写死的假数据。

### 5.2 后台管理

新建文章 → 选"栏目归属=认知"：

```
栏目归属    ：认知
文章分类    ：趋势
URL 路径    ：agent-trend-2026
所属系列    ：AI 正在改变什么   ← 新增下拉框
子主题      ：Agent 形态        ← 新增下拉框（选了系列才出现）
标题        ：Agent 正在进入企业...
```

### 5.3 路由清晰化

```
/understand/series/:slug     → 系列专题（用 seriesId 外键查）
/understand/insights?type=pov → 认知资产筛选
/learn?category=framework     → 学习栏目下的框架文章
/learn?category=playbook      → 学习栏目下的行动手册
```

### 5.4 详情页关联推荐

任何文章详情页底部都会显示"本系列其他文章"，**降低跳出率、提升系列内流转**。

---

## 六、实施建议

**分 3 步走**，每一步独立可用、不会破坏现有功能：

### Step 1：数据库 + 后端（约 30 分钟）

1. 改 `schema.prisma`，跑 `npx prisma migrate dev --name add_series_subtopic`
2. 新建 `routes/series.routes.ts`，在 `app.ts` 注册 `app.use('/api/series', seriesRoutes)`
3. 改 `services/content.service.ts` 的 `listPublic` 加 `seriesSlug` / `subTopicSlug` 条件；改 `routes/content.routes.ts` 把这两个 query 透传，并在 zod `CreateSchema` / `UpdateSchema` 加 `seriesId` / `subTopicId`
4. （推荐）跑 seed 把 3 个系列 + 12 个子主题初始化进去

**验收**：用 curl 调 `GET /api/series?navSection=understand` 能返回 3 个节点，每个节点带子主题和真实数量。

### Step 2：后台（约 20 分钟）

1. 改 `Articles.vue` 加 `seriesId` / `subTopicId` 两个下拉框
2. `save()` 的 payload 增加两个字段
3. 后台新建一篇文章，选中系列和子主题，保存

**验收**：数据库里这篇文章的 `seriesId` / `subTopicId` 正确写入。

### Step 3：前台（约 40 分钟）

1. 改 `CognitionPathSection.vue` 读 `/api/series`
2. 改 `Series.vue` 用 `seriesSlug` 查询
3. 改 `learn/Index.vue` 支持 `/learn/frameworks` 等子路径
4. 改 `experience/Index.vue` 加文章分类筛选
5. 改三个 `Detail.vue` 加"系列内推荐"

**验收**：

- `/understand` 卡片数字真实
- `/understand/series/ai-changing-what` 子主题 tab 数字真实
- `/learn/frameworks` 显示 Content 文章列表
- 详情页底部有"本系列其他文章"

---

## 七、回滚方案

如果上线后发现问题：

1. **数据库回滚**：`npx prisma migrate rollback`（drop 新增的 `Series` / `SubTopic` 表与 `Content` 上的外键）
2. **代码回滚**：用 git revert 撤回对应 commit
3. **保留旧 `nodeSlug` 字段**：本方案没有删除旧 `Content.nodeSlug` 字段，老数据可继续工作

---

## 八、后续可拓展（P2/P3）

1. **Series 后台管理**：新增 `ai-org-server/src/routes/series.routes.ts` 的 admin CRUD 路由，并在 `ai-org-web/src/admin/views/` 加 `Series.vue`，挂到 `ai-org-web/src/admin/routes.ts` 的路由表里（`{ path: '/admin/series', component: () => import('./views/Series.vue') }`）。让运营可以自行创建新系列、子主题（目前需要直接改 seed 或跑 SQL）。
2. **学习栏目按系列组织**：`/learn` 下挂 `ai-maturity` / `ai-workflow-canvas` 等系列，类似 `/understand/series/:slug`
3. **跨栏目引用**：在 `Content` 上加 `relatedSeriesIds: String[]`，支持一篇文章属于多个系列
4. **首页 Hero 读 Series**：首页展示的"FORGE 的判断"也可改成从数据库读
5. **数据看板**：在后台 `/admin/dashboard` 显示每个系列的文章数、阅读量趋势

---

## 九、关键路径核对表

> 本节是开发时的"避坑清单"，记录所有容易写错的路径和命名。

### 9.1 后端路由路径

| 资源 | 路由文件 | 注册路径（app.ts） | 公开接口 |
|---|---|---|---|
| 内容 | `routes/content.routes.ts` | `/api/contents` | `GET /api/contents` |
| 系列（本方案新增） | `routes/series.routes.ts` | `/api/series` | `GET /api/series` |
| 资料 | `routes/resource.routes.ts` | `/api/resources` | `GET /api/resources` |
| 案例 | `routes/case.routes.ts` | `/api/cases` | `GET /api/cases` |
| 体验 | `routes/experience.routes.ts` | `/api/experience` | `GET /api/experience/...` |
| 场景 | `routes/scenario.routes.ts` | `/api` | `GET /api/scenarios` |
| 首页配置 | `routes/homeConfig.routes.ts` | `/api/home-config` | `GET /api/home-config` |

**注意**：所有路由都是**复数**（`contents` / `resources` / `series`）。

### 9.2 前端 API 调用路径

前端 `BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'`，已经包含 `/api` 前缀，所以 `api.listContents(...)` 实际请求的是 `http://localhost:4000/api/contents`。

新增 series API 时，前端调用形式：

```typescript
request<SeriesNode[]>(`/series?${qs}`)        // 最终 URL: /api/series
request<SeriesNode>(`/series/${slug}`)          // 最终 URL: /api/series/xxx
```

### 9.3 文件命名规范

- 路由文件：`xxx.routes.ts`（注意 `.routes.ts` 后缀，不是 `.ts`）
- 服务层：`xxx.service.ts`（如 `content.service.ts`）
- 前端视图：`Xxx.vue` 或目录形式（如 `understand/Series.vue`）
- Prisma 模型：`PascalCase` 单数（如 `model Content`，不是 `model Contents`）

### 9.4 Content 模型新字段命名

| 字段 | 类型 | 说明 |
|---|---|---|
| `seriesId` | `String?` | 关联到 `Series.id`，`onDelete: SetNull`（删 series 不影响 content） |
| `subTopicId` | `String?` | 关联到 `SubTopic.id`，`onDelete: SetNull` |
| `nodeSlug`（保留） | `String?` | 老字段，新数据可不再使用，但保留以便兼容历史数据 |

---

**文档版本**：v1.1  
**最后更新**：2026-09-30  
**作者**：Cursor  
**关联文档**：`DEVELOPMENT.md`、`CONTENT-OPS.md`、`AI组织解决方案网站_建设方案.md`
