/**
 * 文章 API 服务层（兼容旧文件）
 * -----------------------------------------------------------------------------
 * 旧版本：使用 MOCK_DATA（已弃用）
 * 新版本：所有请求走真实后端 /api/contents
 *
 * 推荐直接 import { useArticles, type ArticleItem } from '@/composables/useArticles'
 * 或 import { api, type Content } from '@/api/server'
 *
 * 本文件保留 CATEGORY_LABEL 给 ArticleCard 组件继续使用。
 */
import type { Content } from '@/api/server'

/** 向后兼容：ArticleItem = Content（结构相同） */
export type ArticleItem = Content

/** category → 展示标签 */
export const CATEGORY_LABEL: Record<ArticleItem['category'], string> = {
  trend: 'TREND',
  point_of_view: 'POINT OF VIEW',
  field_note: 'FIELD NOTE',
  insight: 'INSIGHT',
  research: 'RESEARCH',
  whitepaper: 'WHITEPAPER',
  playbook: 'PLAYBOOK',
  framework: 'FRAMEWORK',
}
