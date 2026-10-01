/**
 * 文章数据 hook（走真实后端 /api/contents）
 * -----------------------------------------------------------------------------
 * 提供：
 *  - articles: 文章列表
 *  - loading: 加载状态
 *  - error: 错误信息
 *  - refresh: 手动刷新函数
 *
 * 后端数据来自 Content 表，过滤条件：
 *  - isPublished = true
 *  - deletedAt = null
 *
 * 用法：
 *   const { articles, loading, error, refresh } = useArticles({ nodeSlug: 'ai-changing-what', limit: 3 })
 */
import { ref, onMounted } from 'vue'
import { api, type Content } from '@/api/server'

// 前端组件里用的 ArticleItem 风格别名（向后兼容）
export type ArticleItem = Content

export interface UseArticlesOptions {
  /** 对应的认知节点 slug，不传则取全量 */
  nodeSlug?: string
  /** 取几条，默认 3 */
  limit?: number
  /** 挂载时自动请求，默认 true */
  immediate?: boolean
}

export function useArticles(options: UseArticlesOptions = {}) {
  const { nodeSlug, limit = 3, immediate = true } = options

  const articles = ref<ArticleItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function refresh() {
    loading.value = true
    error.value = null
    try {
      articles.value = await api.listContents({ nodeSlug, limit })
    } catch (e: any) {
      error.value = e?.message || '加载失败'
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    onMounted(refresh)
  }

  return { articles, loading, error, refresh }
}

// 特殊值 'all' 表示"全部"
export const CATEGORY_ALL = 'all' as const

/**
 * 带筛选的文章列表 hook（用于 /understand/insights 列表页）
 */
export function useArticleList(initialFilter?: ArticleItem['category'] | typeof CATEGORY_ALL) {
  const articles = ref<ArticleItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filter = ref<ArticleItem['category'] | typeof CATEGORY_ALL | undefined>(initialFilter)

  async function load() {
    loading.value = true
    error.value = null
    try {
      const all = await api.listContents({ limit: 100 })
      if (!filter.value || filter.value === CATEGORY_ALL) {
        articles.value = all
      } else {
        articles.value = all.filter((a) => a.category === filter.value)
      }
    } catch (e: any) {
      error.value = e?.message || '加载失败'
    } finally {
      loading.value = false
    }
  }

  function setFilter(f: ArticleItem['category'] | typeof CATEGORY_ALL | undefined) {
    filter.value = f
    load()
  }

  onMounted(load)

  return { articles, loading, error, filter, setFilter, refresh: load }
}
