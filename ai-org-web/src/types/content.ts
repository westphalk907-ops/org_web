// 全局内容类型定义

export type ContentType =
  | 'insight'
  | 'research'
  | 'framework'
  | 'playbook'
  | 'case'
  | 'checklist'
  | 'tool'
  | 'prompt'
  | 'skill'
  | 'workflow'
  | 'whitepaper'

export type FileType = 'pdf' | 'md' | 'link' | 'notion' | 'zip'

export type Audience =
  | 'ceo'
  | 'hr'
  | 'business'
  | 'it'
  | 'manager'

export type Topic =
  | 'individual'
  | 'workflow'
  | 'team'
  | 'organization'
  | 'governance'

export interface ContentItem {
  id: string
  slug: string
  type: ContentType
  title: string
  subtitle?: string
  summary: string
  thumbnail?: string
  author?: string
  publishedAt: string
  tags?: string[]
  topic?: Topic | string
  audience?: (Audience | string)[]
  industry?: string[]
  relatedServices?: string[]
  downloadUrl?: string

  // ===== 文件下载字段 =====
  fileUrl?: string        // 文件路径（mock 阶段指 /files/*；后端接上后指向签名 URL）
  fileType?: FileType | string  // 文件类型，决定下载/查看/复制策略
  fileName?: string       // 下载时的默认文件名
  fileSize?: string       // "13.4 MB"
  pages?: number          // PDF 页数
  cover?: string          // 详情页封面
}

export interface ContentDetail extends ContentItem {
  content: string  // Markdown
  cta?: {
    label: string
    href: string
  }
}

export interface ContentListParams {
  type?: string
  topic?: string
  audience?: string
  industry?: string
  page?: number
  pageSize?: number
}

export interface ContentListResult {
  list: ContentItem[]
  total: number
  page: number
  pageSize: number
}

export interface AssessmentQuestion {
  id: string
  dimension: 'strategy' | 'people' | 'workflow' | 'technology' | 'data' | 'governance' | 'organization'
  text: string
  options: Array<{
    label: string
    score: number
  }>
}

export interface AssessmentStage {
  code: 'L1' | 'L2' | 'L3' | 'L4' | 'L5'
  name: string
  min: number
  max: number
  description: string
  characteristics: string[]
  nextStep: string
}

export interface AssessmentResult {
  stage: AssessmentStage
  dimensionScores: Record<string, number>
  topGaps: Array<{ dimension: string; score: number; suggestion: string }>
  totalScore: number
  nextStep: string
}

export interface MapNode {
  id: string
  stage: string
  title: string
  description: string
  characteristics: string[]
  painPoints: string[]
  actions: string[]
  resources: Array<{ title: string; href: string; type: string }>
  services: Array<{ title: string; href: string }>
}

export interface WorkflowScenario {
  id: string
  industry: 'sales' | 'marketing' | 'hr' | 'service' | 'management'
  title: string
  description: string
  traditional: {
    duration: string
    steps: Array<{ role: string; action: string; duration: string }>
    output: string
  }
  aiEnabled: {
    duration: string
    steps: Array<{ role: string; action: string; aiCapability?: string; duration: string }>
    output: string
  }
}

export interface CaseStudy {
  id: string
  slug: string
  company: string
  industry: string
  scale: string
  title: string
  before: string
  intervention: string
  after: string
  next: string
  metrics?: Array<{ label: string; value: string }>
  testimonial?: { quote: string; author: string; position: string }
}
