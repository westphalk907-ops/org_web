/**
 * 后端 API 客户端 - 主站前端用
 *
 * 直接通过 fetch 调用后端，不走 axios（更轻）
 */

import { USE_BACKEND } from '@/data/flags'
import { HOME_CONFIG_MOCK } from '@/data/homeConfig'
import { MOCK_DB, findResource, findContent, findCase } from '@/data/apiCatalog'
import { RESOURCES_FULL, findResourceBySlug } from '@/data/resources'
import { MOCK_SCENARIOS, MOCK_OWNER_CONTACT } from '@/data/scenarios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

/** 后端的根 URL（去掉 /api 后缀），用于把 `/uploads/...` 拼成完整 URL */
export const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000').replace(/\/api\/?$/, '')

/**
 * 把后端返回的 `/uploads/...` 相对路径转成绝对 URL
 * - 若已经是 http(s):// 开头，原样返回
 * - 若以 `/` 开头，拼接 API_ORIGIN
 */
export function withApiBase(url: string): string {
  if (!url) return url
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/')) return `${API_ORIGIN}${url}`
  return `${API_ORIGIN}/${url}`
}

/**
 * 模拟后端 /home-config 的行为：
 *  - 不传 keys：返回全量
 *  - 传 keys：只返回指定 key 的子集
 */
function getMockHomeConfigs(keys?: string[]) {
  if (!keys || keys.length === 0) return HOME_CONFIG_MOCK
  const out: Record<string, unknown> = {}
  for (const k of keys) {
    if (k in HOME_CONFIG_MOCK) out[k] = HOME_CONFIG_MOCK[k]
  }
  return out
}

// =====================================================================
// 内部工具
// =====================================================================

export interface ApiSuccess<T> {
  ok: true
  data: T
}
export interface ApiError {
  ok: false
  error: { code: string; message: string; details?: unknown }
}
export type ApiResponse<T> = ApiSuccess<T> | ApiError

export class FetchError extends Error {
  constructor(public code: string, message: string, public details?: unknown) {
    super(message)
    this.name = 'FetchError'
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('admin_token')

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  })

  const json: ApiResponse<T> = await res.json().catch(() => ({
    ok: false,
    error: { code: 'PARSE_ERROR', message: '解析失败' },
  }))

  if (!json.ok) {
    throw new FetchError(json.error.code, json.error.message, json.error.details)
  }

  return json.data
}

// =====================================================================
// 图片压缩（上传前在浏览器内压缩，避免 5-20MB 大图占用带宽）
// =====================================================================

/** 压缩阈值：超过 2MB 才压缩，避免小图被无意义重编码 */
const COMPRESS_THRESHOLD_BYTES = 2 * 1024 * 1024

/** 压缩后目标：最长边 1920px（够用，文件更小） */
const COMPRESS_MAX_SIDE = 1920

/** 压缩质量 */
const COMPRESS_QUALITY = 0.85

/** 允许压缩的格式（不支持的保持原样） */
const COMPRESSIBLE_MIME = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])

/**
 * 把图片按比例缩放到最长边 ≤ maxSide
 */
function drawScaled(img: HTMLImageElement, maxSide: number): HTMLCanvasElement {
  const w = img.naturalWidth
  const h = img.naturalHeight
  const ratio = w > h ? maxSide / w : maxSide / h
  const tw = Math.round(w * ratio)
  const th = Math.round(h * ratio)
  const canvas = document.createElement('canvas')
  canvas.width = tw
  canvas.height = th
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, tw, th)
  return canvas
}

/**
 * 如果图片超过 2MB 且可压缩，用 canvas 缩放 + 重编码压缩
 * - 不可压缩（gif）或小于阈值：原样返回
 * - canvas 不支持时：原样返回（兜底）
 */
export async function compressImageIfNeeded(file: File): Promise<File> {
  if (file.size <= COMPRESS_THRESHOLD_BYTES) return file
  if (!COMPRESSIBLE_MIME.has(file.type)) return file

  try {
    const bitmap = await createImageBitmap(file).catch(() => null)
    let img: HTMLImageElement | null = null
    if (!bitmap) {
      // 退化：用 Image + URL.createObjectURL
      img = new Image()
      const url = URL.createObjectURL(file)
      await new Promise<void>((resolve, reject) => {
        img!.onload = () => resolve()
        img!.onerror = () => reject(new Error('load failed'))
        img!.src = url
      })
      URL.revokeObjectURL(url)
    }

    const canvas = bitmap
      ? drawScaledBitmap(bitmap, COMPRESS_MAX_SIDE)
      : drawScaled(img!, COMPRESS_MAX_SIDE)

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('toBlob failed'))),
        // PNG 保留 png（有透明通道），其他压成 jpeg（更小）
        file.type === 'image/png' ? 'image/png' : 'image/jpeg',
        COMPRESS_QUALITY
      )
    })

    if (blob.size >= file.size) return file // 压缩后没小就不浪费
    const ext = blob.type === 'image/png' ? '.png' : '.jpg'
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + ext, {
      type: blob.type,
      lastModified: Date.now(),
    })
  } catch {
    return file // 任何错误都兜底回原文件
  }
}

function drawScaledBitmap(bitmap: ImageBitmap, maxSide: number): HTMLCanvasElement {
  const w = bitmap.width
  const h = bitmap.height
  const ratio = w > h ? maxSide / w : maxSide / h
  const tw = Math.round(w * ratio)
  const th = Math.round(h * ratio)
  const canvas = document.createElement('canvas')
  canvas.width = tw
  canvas.height = th
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, tw, th)
  bitmap.close?.()
  return canvas
}

// =====================================================================
// 类型（与后端 schema 对齐）
// =====================================================================

export type ResourceType =
  | 'insight' | 'research' | 'framework' | 'playbook' | 'case'
  | 'checklist' | 'tool' | 'prompt' | 'skill' | 'workflow' | 'whitepaper'

export type ContentCategory =
  | 'insight' | 'trend' | 'point_of_view' | 'field_note'
  | 'research' | 'whitepaper' | 'playbook' | 'framework'

/** 文章在前台导航的归属栏目 */
export type NavSection = 'learn' | 'understand' | 'experience'

/** NavSection → 前台访问路径前缀 */
export const NAV_SECTION_PATH: Record<NavSection, string> = {
  learn: '/learn',
  understand: '/understand',
  experience: '/experience',
}

/** NavSection → 中文显示 */
export const NAV_SECTION_LABEL: Record<NavSection, string> = {
  learn: '学习',
  understand: '认知',
  experience: '体验',
}

// 后端 Prisma 是大写枚举，前端用小写（兼容老代码）
const CATEGORY_TO_LOWER: Record<string, ContentCategory> = {
  TREND: 'trend',
  POINT_OF_VIEW: 'point_of_view',
  FIELD_NOTE: 'field_note',
  INSIGHT: 'insight',
  RESEARCH: 'research',
  WHITEPAPER: 'whitepaper',
  PLAYBOOK: 'playbook',
  FRAMEWORK: 'framework',
}

const CATEGORY_TO_UPPER: Record<ContentCategory, string> = {
  trend: 'TREND',
  point_of_view: 'POINT_OF_VIEW',
  field_note: 'FIELD_NOTE',
  insight: 'INSIGHT',
  research: 'RESEARCH',
  whitepaper: 'WHITEPAPER',
  playbook: 'PLAYBOOK',
  framework: 'FRAMEWORK',
}

/** 后端原始 Content → 前端 Content（统一小写、补 ArticleItem 风格字段） */
function transformContent(c: any): Content {
  if (!c) return c
  const ns = (c.navSection || '').toLowerCase()
  return {
    ...c,
    category: CATEGORY_TO_LOWER[c.category] || c.category,
    navSection: (ns === 'understand' || ns === 'experience' || ns === 'learn') ? ns : 'learn',
    date: (c.publishedAt || '').slice(0, 10).replace(/-/g, '.'),
    href: c.sourceUrl || '#',
    nodeSlug: c.nodeSlug || '',
    index: c.index || '',
  }
}

/** 把后端大写枚举值转小写 */
function toLower<T extends string>(s: string | null | undefined): T | '' {
  if (!s) return '' as T
  return (typeof s === 'string' ? s.toLowerCase() : s) as T
}

/** 把后端 AssessmentQuestion 转成前端 shape */
function transformQuestion(q: any): any {
  if (!q) return q
  return {
    ...q,
    dimension: toLower(q.dimension),
  }
}

/** 把后端 Scenario 转成前端 shape（补 publishedAt 字符串、规范化 resourceSlugs） */
function transformScenario(s: any): Scenario {
  if (!s) return s
  return {
    ...s,
    // 后端 PublishedAt 是 Date 对象，模板里只用到 length 等属性，安全起见统一转字符串
    publishedAt:
      s.publishedAt instanceof Date
        ? s.publishedAt.toISOString()
        : (s.publishedAt ?? ''),
    resourceSlugs: Array.isArray(s.resourceSlugs) ? s.resourceSlugs : [],
    tags: Array.isArray(s.tags) ? s.tags : [],
  }
}

export interface Resource {
  id: string
  slug: string
  type: ResourceType
  title: string
  subtitle?: string
  summary: string
  thumbnail?: string
  author?: string
  publishedAt: string
  tags?: string[]
  topic?: string
  audience?: string[]
  industry?: string[]
  fileUrl?: string
  fileType?: 'pdf' | 'md' | 'link' | 'notion' | 'zip'
  fileName?: string
  fileSize?: string
  pages?: number
  cover?: string
  viewCount: number
  downloadCount: number
  isFeatured: boolean
  sortOrder: number
}

export interface Content {
  id: string
  slug: string
  category: ContentCategory
  title: string
  subtitle?: string
  excerpt: string
  cover?: string
  content: string
  contentHtml: string
  author?: string
  publishedAt: string
  readingTime?: number
  tags?: string[]
  relatedIds?: string[]
  sourceUrl?: string
  sourcePlatform?: string
  isPublished: boolean
  viewCount: number
  likeCount: number

  /** 前台导航归属：learn / understand / experience */
  navSection: NavSection

  /** 所属系列 / 子主题（来自 Series / SubTopic 表，可空） */
  seriesId?: string | null
  subTopicId?: string | null
  /** 系列 / 子主题详情（详情接口返回，可空） */
  series?: { id: string; slug: string; title: string } | null
  subTopic?: { id: string; slug: string; name: string } | null

  // ===== ArticleItem 兼容字段（后端 Content 也有对应字段） =====
  index?: string          // 序号如 "01"
  nodeSlug?: string       // 认知节点（老体系，保留兼容）
  date?: string           // 展示用 YYYY.MM.DD
  href?: string           // 公众号原文链接（默认 = sourceUrl）
}

// =====================================================================
// Series 系列 / SubTopic 子主题
// =====================================================================

export interface SubTopic {
  id: string
  slug: string
  name: string
  /** 该子主题下已发布的文章数（仅在 listSeries 列表里返回） */
  count?: number
  /** 后台管理时返回 */
  sortOrder?: number
}

export interface Series {
  id: string
  slug: string
  label: string           // 来自后端的 title（前端用 label 兼容旧字段）
  en?: string
  desc?: string
  cover?: string
  navSection: NavSection
  /** 该系列下已发布的文章数 */
  articles?: number
  /** 该系列下 category=framework 的文章数 */
  frameworks?: number
  topics?: SubTopic[]
}

/** 后台管理用的 Series（更完整，含运营字段） */
export interface AdminSeries {
  id: string
  slug: string
  label: string
  en?: string | null
  desc?: string | null
  cover?: string | null
  navSection: NavSection
  sortOrder: number
  isPublished: boolean
  deletedAt?: string | null
  createdAt: string
  updatedAt: string
  topics: SubTopic[]
  /** 该系列下未软删的文章数（运营参考） */
  contentsCount: number
}

/** 后台创建 / 更新 Series 的 payload */
export interface AdminSeriesUpsertPayload {
  slug: string
  navSection: NavSection
  label: string
  en?: string
  desc?: string
  cover?: string
  sortOrder?: number
  isPublished?: boolean
  /** 子主题列表。整体替换语义：传空数组 = 清空所有子主题 */
  topics?: Array<{
    id?: string
    slug: string
    name: string
    sortOrder?: number
  }>
}

export interface CaseStudy {
  id: string
  slug: string
  company: string
  industry: string
  scale?: string
  title: string
  before: string
  intervention: string
  after: string
  next?: string
  metrics?: Array<{ label: string; value: string }>
  testimonial?: { quote: string; author: string; position: string }
  coverImage?: string
  isPublished: boolean
  publishedAt: string
  sortOrder: number
}

// =====================================================================
// Experience / Assessment 类型
// =====================================================================

export type ExperienceKind = 'INDIVIDUAL' | 'ORGANIZATION' | 'WORKFLOW'

export type Dimension =
  | 'strategy' | 'people' | 'workflow' | 'technology' | 'data' | 'governance' | 'organization'

/** Dimension 小写值 → 中文显示（Assessment 模板用） */
export const DIMENSION_LABEL: Record<Dimension, string> = {
  strategy: '战略',
  people: '人才',
  workflow: '工作流',
  technology: '技术',
  data: '数据',
  governance: '治理',
  organization: '组织',
}

export interface ExperienceStage {
  id: string
  mapId: string
  stage: string                  // "01" ~ "05"
  title: string
  description: string
  characteristics: string[]
  painPoints: string[]
  actions: string[]
  resourceSlugs: string[]
  serviceLinks?: Array<{ label: string; href: string }>
  details?: {
    industry?: string          // 'sales' | 'marketing' | 'hr' | 'service' | 'management'
    traditional?: {
      duration: string
      steps: Array<{ role: string; action: string; duration: string }>
      output: string
    }
    aiEnabled?: {
      duration: string
      steps: Array<{ role: string; action: string; duration: string; aiCapability?: string }>
      output: string
    }
  }
  sortOrder: number
  isActive: boolean
}

export interface ExperienceMap {
  id: string
  kind: ExperienceKind
  slug: string
  title: string
  subtitle?: string
  heroDesc?: string
  isActive: boolean
  sortOrder: number
  stages: ExperienceStage[]
}

export interface AssessmentQuestion {
  id: string
  slug: string
  dimension: Dimension
  text: string
  description?: string
  options: Array<{ score: number; label: string }>
  weight: number
  stage?: string
  sortOrder: number
  isActive: boolean
}

// =====================================================================
// Scenario 类型（体验区场景库）
// =====================================================================

export type ScenarioCategory =
  | 'INDIVIDUAL' | 'TEAM' | 'SALES' | 'MARKETING'
  | 'HR' | 'SERVICE' | 'MANAGEMENT'

export interface Scenario {
  id: string
  slug: string
  category: ScenarioCategory
  title: string
  subtitle?: string
  heroDesc?: string
  icon?: string
  problem: string
  beforeSteps: string[]
  afterSteps: string[]
  prompts: string[]
  resourceSlugs: string[]
  ownerContactEnabled: boolean
  tags: string[]
  isActive: boolean
  sortOrder: number
  publishedAt: string
}

export interface OwnerContact {
  wechatId: string
  qrcodeUrl?: string
  intro?: string
}

// =====================================================================
// API 方法
   // =====================================================================

export const api = {
  // ---- 公开：Resources ----
  listResources(params: { type?: ResourceType; featured?: boolean; limit?: number } = {}) {
    if (!USE_BACKEND) {
      // 合并 MOCK_DB（9 条老 mock）与 RESOURCES_FULL（14 条，含种子资源）
      let list: Resource[] = [
        ...MOCK_DB.resources,
        ...(RESOURCES_FULL as unknown as Resource[]),
      ]
      // 去重（按 slug）
      const seen = new Set<string>()
      list = list.filter((r) => {
        if (seen.has(r.slug)) return false
        seen.add(r.slug)
        return true
      })
      if (params.type) list = list.filter((r) => r.type === params.type)
      if (params.featured !== undefined) list = list.filter((r) => r.isFeatured === params.featured)
      if (params.limit) list = list.slice(0, params.limit)
      return Promise.resolve(list)
    }
    const qs = new URLSearchParams()
    if (params.type) qs.set('type', params.type)
    if (params.featured !== undefined) qs.set('featured', String(params.featured))
    if (params.limit) qs.set('limit', String(params.limit))
    return request<Resource[]>(`/resources?${qs}`)
  },
  getResource(slug: string) {
    if (!USE_BACKEND) {
      // 优先 RESOURCES_FULL（含 ai-organization-maturity-report-2026），
      // 找不到再查 MOCK_DB，向后兼容老数据
      const r =
        findResourceBySlug(slug) ??
        (findResource(slug) as unknown as ReturnType<typeof findResourceBySlug>)
      if (!r) throw new FetchError('NOT_FOUND', `Resource "${slug}" not found`)
      return Promise.resolve(r as unknown as Resource)
    }
    return request<Resource>(`/resources/${slug}`)
  },

  // ---- 公开：Contents ----
  listContents(params: { category?: ContentCategory; navSection?: NavSection; nodeSlug?: string; seriesSlug?: string; subTopicSlug?: string; limit?: number } = {}) {
    if (!USE_BACKEND) {
      let list = [...MOCK_DB.contents]
      if (params.category) list = list.filter((c) => c.category === params.category)
      if (params.navSection) list = list.filter((c) => c.navSection === params.navSection)
      if (params.nodeSlug) list = list.filter((c) => c.nodeSlug === params.nodeSlug)
      if (params.limit) list = list.slice(0, params.limit)
      return Promise.resolve(list as any[]).then((arr) => arr.map(transformContent))
    }
    const qs = new URLSearchParams()
    // 后端 Prisma 枚举是小写（'framework' / 'playbook' / 'whitepaper'...），
    // 直接传小写，不要做 CATEGORY_TO_UPPER 转换
    if (params.category) qs.set('category', params.category)
    if (params.navSection) qs.set('navSection', params.navSection)
    if (params.nodeSlug) qs.set('nodeSlug', params.nodeSlug)
    if (params.seriesSlug) qs.set('seriesSlug', params.seriesSlug)
    if (params.subTopicSlug) qs.set('subTopicSlug', params.subTopicSlug)
    if (params.limit) qs.set('limit', String(params.limit))
    return request<any[]>(`/contents?${qs}`).then((arr) => arr.map(transformContent))
  },
  getContent(slug: string) {
    if (!USE_BACKEND) {
      const c = findContent(slug)
      if (!c) throw new FetchError('NOT_FOUND', `Content "${slug}" not found`)
      return Promise.resolve(c as any).then(transformContent)
    }
    return request<any>(`/contents/${slug}`).then(transformContent)
  },

  // 后台 CRUD（保持原始大写 category）
  adminCreateContent(data: Partial<Content> & { category?: string; navSection?: string }) {
    const payload: any = { ...data }
    if (data.category && (data.category as string) !== data.category?.toUpperCase()) {
      payload.category = CATEGORY_TO_UPPER[data.category as ContentCategory]
    }
    return request<Content>(`/contents/admin`, { method: 'POST', body: JSON.stringify(payload) })
  },
  adminUpdateContent(id: string, data: Partial<Content> & { category?: string; navSection?: string }) {
    const payload: any = { ...data }
    if (data.category && (data.category as string) !== data.category?.toUpperCase()) {
      payload.category = CATEGORY_TO_UPPER[data.category as ContentCategory]
    }
    return request<Content>(`/contents/admin/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  },

  // ---- 公开：Cases ----
  listCases() {
    if (!USE_BACKEND) return Promise.resolve(MOCK_DB.cases)
    return request<CaseStudy[]>(`/cases`)
  },
  getCase(slug: string) {
    if (!USE_BACKEND) {
      const c = findCase(slug)
      if (!c) throw new FetchError('NOT_FOUND', `Case "${slug}" not found`)
      return Promise.resolve(c as unknown as CaseStudy)
    }
    return request<CaseStudy>(`/cases/${slug}`)
  },

  // ---- 公开：Series 系列 ----
  listSeries(params: { navSection?: NavSection } = {}) {
    const qs = new URLSearchParams()
    if (params.navSection) qs.set('navSection', params.navSection)
    return request<Series[]>(`/series?${qs}`)
  },
  getSeries(slug: string) {
    return request<Series>(`/series/${slug}`)
  },

  // ---- 公开：HomeConfig ----
  getHomeConfigs(keys?: string[]) {
    // mock 模式下直接返回本地配置，零网络请求
    if (!USE_BACKEND) {
      return Promise.resolve(getMockHomeConfigs(keys))
    }
    const qs = keys ? `?keys=${keys.join(',')}` : ''
    return request<Record<string, unknown>>(`/home-config${qs}`)
  },

  // ---- 公开：Experience 地图 + 测评 ----
  listExperienceMaps() {
    return request<ExperienceMap[]>(`/experience/maps`)
  },
  getExperienceMap(kind: 'INDIVIDUAL' | 'ORGANIZATION' | 'WORKFLOW') {
    return request<ExperienceMap>(`/experience/maps/${kind}`)
  },
  listAssessmentQuestions() {
    return request<any[]>(`/experience/questions`).then((arr) => arr.map(transformQuestion))
  },

  // ---- 后台：Experience 管理 ----
  adminListMaps(params: { keyword?: string } = {}) {
    const qs = new URLSearchParams()
    if (params.keyword) qs.set('keyword', params.keyword)
    return request<ExperienceMap[]>(`/experience/admin/maps?${qs}`)
  },
  adminGetMap(id: string) {
    return request<ExperienceMap>(`/experience/admin/maps/${id}`)
  },
  adminUpsertMap(data: Partial<ExperienceMap> & { kind?: string; slug?: string; title?: string }) {
    return request<ExperienceMap>(`/experience/admin/maps`, {
      method: 'POST', body: JSON.stringify(data),
    })
  },
  adminUpdateMap(id: string, data: Partial<ExperienceMap> & { kind?: string; slug?: string; title?: string }) {
    return request<ExperienceMap>(`/experience/admin/maps/${id}`, {
      method: 'PUT', body: JSON.stringify(data),
    })
  },
  adminDeleteMap(id: string) {
    return request<{ id: string }>(`/experience/admin/maps/${id}`, { method: 'DELETE' })
  },

  adminUpsertStage(data: Partial<ExperienceStage> & { mapId: string; stage: string; title: string; description: string; characteristics: string[]; painPoints: string[]; actions: string[] }) {
    return request<ExperienceStage>(`/experience/admin/stages`, {
      method: 'POST', body: JSON.stringify(data),
    })
  },
  adminUpdateStage(id: string, data: Partial<ExperienceStage>) {
    return request<ExperienceStage>(`/experience/admin/stages/${id}`, {
      method: 'PUT', body: JSON.stringify(data),
    })
  },
  adminDeleteStage(id: string) {
    return request<{ id: string }>(`/experience/admin/stages/${id}`, { method: 'DELETE' })
  },

  adminListQuestions(params: { dimension?: string; keyword?: string } = {}) {
    const qs = new URLSearchParams()
    if (params.dimension) qs.set('dimension', params.dimension)
    if (params.keyword) qs.set('keyword', params.keyword)
    return request<AssessmentQuestion[]>(`/experience/admin/questions?${qs}`)
  },
  adminUpsertQuestion(data: Partial<AssessmentQuestion> & { slug: string; dimension: string; text: string; options: any[] }) {
    return request<AssessmentQuestion>(`/experience/admin/questions`, {
      method: 'POST', body: JSON.stringify(data),
    })
  },
  adminUpdateQuestion(id: string, data: Partial<AssessmentQuestion>) {
    return request<AssessmentQuestion>(`/experience/admin/questions/${id}`, {
      method: 'PUT', body: JSON.stringify(data),
    })
  },
  adminDeleteQuestion(id: string) {
    return request<{ id: string }>(`/experience/admin/questions/${id}`, { method: 'DELETE' })
  },

  // ---- 后台：Auth ----
  login(username: string, password: string) {
    return request<{ token: string; admin: { id: string; username: string; email: string; role: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ username, password }) }
    )
  },
  me() {
    return request<{ id: string; username: string; email: string; role: string; lastLoginAt: string }>(
      '/auth/me'
    )
  },

  // ---- 后台：Resources 管理 ----
  adminListResources(params: { type?: string; keyword?: string; page?: number; pageSize?: number; featured?: boolean } = {}) {
    const qs = new URLSearchParams()
    if (params.type) qs.set('type', params.type)
    if (params.keyword) qs.set('keyword', params.keyword)
    if (params.page) qs.set('page', String(params.page))
    if (params.pageSize) qs.set('pageSize', String(params.pageSize))
    if (params.featured !== undefined) qs.set('featured', String(params.featured))
    return request<{ items: Resource[]; total: number; page: number; pageSize: number }>(
      `/resources/admin/list?${qs}`
    )
  },
  adminCreateResource(formData: FormData) {
    return request<Resource>(`/resources/admin`, { method: 'POST', body: formData })
  },
  adminUpdateResource(id: string, formData: FormData) {
    return request<Resource>(`/resources/admin/${id}`, { method: 'PUT', body: formData })
  },
  adminDeleteResource(id: string) {
    return request<{ id: string; deletedAt: string }>(`/resources/admin/${id}`, { method: 'DELETE' })
  },

  // ---- 后台：Contents 管理 ----
  adminListContents(params: { category?: string; navSection?: string; keyword?: string; page?: number; pageSize?: number } = {}) {
    const qs = new URLSearchParams()
    if (params.category) qs.set('category', params.category)
    if (params.navSection) qs.set('navSection', params.navSection)
    if (params.keyword) qs.set('keyword', params.keyword)
    if (params.page) qs.set('page', String(params.page))
    if (params.pageSize) qs.set('pageSize', String(params.pageSize))
    return request<{ items: Content[]; total: number; page: number; pageSize: number }>(
      `/contents/admin/list?${qs}`
    )
  },
  adminGetContent(id: string) {
    return request<Content>(`/contents/admin/${id}`)
  },
  adminDeleteContent(id: string) {
    return request<{ id: string; deletedAt: string }>(`/contents/admin/${id}`, { method: 'DELETE' })
  },

  // ---- 后台：Series 系列管理 ----
  /** 后台列出所有系列（含未发布 / 软删） */
  adminListSeries(params: { navSection?: NavSection; keyword?: string } = {}) {
    const qs = new URLSearchParams()
    if (params.navSection) qs.set('navSection', params.navSection)
    if (params.keyword) qs.set('keyword', params.keyword)
    return request<AdminSeries[]>(`/series/admin/list?${qs}`)
  },
  adminGetSeries(id: string) {
    return request<AdminSeries>(`/series/admin/${id}`)
  },
  adminCreateSeries(data: AdminSeriesUpsertPayload) {
    return request<AdminSeries>(`/series/admin`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  adminUpdateSeries(id: string, data: AdminSeriesUpsertPayload) {
    return request<AdminSeries>(`/series/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  adminDeleteSeries(id: string) {
    return request<{ id: string; deletedAt: string }>(`/series/admin/${id}`, {
      method: 'DELETE',
    })
  },

  // ---- 后台：图片上传（文章封面 / 正文配图） ----
  /**
   * 上传图片到服务器，返回可在 Markdown 中直接使用的相对 URL
   * 例：返回 { url: '/uploads/2026/09/abc.png' } → 用 `![alt](/uploads/2026/09/abc.png)`
   * 大文件（>2MB）会先在前端压缩再上传
   */
  async uploadImage(file: File): Promise<{ url: string; filename: string; originalName: string; mimetype: string; size: number; sizeText: string }> {
    const compressed = await compressImageIfNeeded(file)
    const fd = new FormData()
    fd.append('file', compressed)
    const data = await request<{ url: string; filename: string; originalName: string; mimetype: string; size: number; sizeText: string }>(
      `/contents/upload-image`,
      { method: 'POST', body: fd }
    )
    return { ...data, url: withApiBase(data.url) }
  },

  // ---- 后台：Cases 管理 ----
  adminListCases(params: { keyword?: string; page?: number; pageSize?: number } = {}) {
    const qs = new URLSearchParams()
    if (params.keyword) qs.set('keyword', params.keyword)
    if (params.page) qs.set('page', String(params.page))
    if (params.pageSize) qs.set('pageSize', String(params.pageSize))
    return request<{ items: CaseStudy[]; total: number; page: number; pageSize: number }>(
      `/cases/admin/list?${qs}`
    )
  },
  adminGetCase(id: string) {
    return request<CaseStudy>(`/cases/admin/${id}`)
  },
  adminCreateCase(data: Partial<CaseStudy>) {
    return request<CaseStudy>(`/cases/admin`, { method: 'POST', body: JSON.stringify(data) })
  },
  adminUpdateCase(id: string, data: Partial<CaseStudy>) {
    return request<CaseStudy>(`/cases/admin/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },
  adminDeleteCase(id: string) {
    return request<{ id: string; deletedAt: string }>(`/cases/admin/${id}`, { method: 'DELETE' })
  },

  // ---- 后台：HomeConfig 管理 ----
  upsertHomeConfig(key: string, payload: unknown) {
    return request(`/home-config/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ payload }),
    })
  },

  // ---- 公开：Scenarios（体验区场景库） ----
  listScenarios(params: { category?: ScenarioCategory; keyword?: string } = {}) {
    if (!USE_BACKEND) {
      let list: Scenario[] = [...MOCK_SCENARIOS]
      if (params.category) list = list.filter((s: Scenario) => s.category === params.category)
      if (params.keyword) {
        const k = params.keyword.toLowerCase()
        list = list.filter(
          (s: Scenario) =>
            s.title.toLowerCase().includes(k) ||
            (s.subtitle ?? '').toLowerCase().includes(k) ||
            s.problem.toLowerCase().includes(k) ||
            s.tags.some((t: string) => t.toLowerCase().includes(k))
        )
      }
      return Promise.resolve(list)
    }
    const qs = new URLSearchParams()
    if (params.category) qs.set('category', params.category)
    if (params.keyword) qs.set('keyword', params.keyword)
    return request<Scenario[]>(`/scenarios?${qs}`).then((arr) => arr.map(transformScenario))
  },
  getScenario(slug: string) {
    if (!USE_BACKEND) {
      const s: Scenario | undefined = MOCK_SCENARIOS.find((x: Scenario) => x.slug === slug)
      if (!s) throw new FetchError('NOT_FOUND', `Scenario "${slug}" not found`)
      return Promise.resolve(s)
    }
    return request<Scenario>(`/scenarios/${slug}`).then(transformScenario)
  },
  getOwnerContact() {
    if (!USE_BACKEND) return Promise.resolve(MOCK_OWNER_CONTACT)
    return request<OwnerContact>(`/scenarios/owner-contact`)
  },

  // ---- 后台：Scenarios 管理 ----
  adminListScenarios(params: { keyword?: string; category?: string } = {}) {
    const qs = new URLSearchParams()
    if (params.keyword) qs.set('keyword', params.keyword)
    if (params.category) qs.set('category', params.category)
    return request<Scenario[]>(`/admin/scenarios/list?${qs}`)
  },
  adminUpsertScenario(data: Partial<Scenario>) {
    return request<Scenario>(`/admin/scenarios`, {
      method: 'POST', body: JSON.stringify(data),
    })
  },
  adminUpdateScenario(id: string, data: Partial<Scenario>) {
    return request<Scenario>(`/admin/scenarios/${id}`, {
      method: 'PUT', body: JSON.stringify(data),
    })
  },
  adminDeleteScenario(id: string) {
    return request<{ id: string; deletedAt: string }>(`/admin/scenarios/${id}`, { method: 'DELETE' })
  },
  adminGetOwnerContact() {
    return request<OwnerContact>(`/admin/scenarios/owner-contact`)
  },
  adminUpdateOwnerContact(payload: OwnerContact) {
    return request<OwnerContact>(`/admin/scenarios/owner-contact`, {
      method: 'PUT', body: JSON.stringify(payload),
    })
  },
}