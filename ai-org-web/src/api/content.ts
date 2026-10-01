import { request } from './request'
import type { ContentItem, ContentListParams, ContentListResult } from '@/types/content'

export type { ContentItem, ContentListParams, ContentListResult }

export const contentApi = {
  list(params: ContentListParams = {}) {
    return request<ContentListResult>({
      url: '/content',
      method: 'GET',
      params
    })
  },

  get(slug: string) {
    return request<ContentItem & { content: string; cta?: string }>({
      url: `/content/${slug}`,
      method: 'GET'
    })
  },

  related(id: string) {
    return request<ContentItem[]>({
      url: `/content/${id}/related`,
      method: 'GET'
    })
  }
}
