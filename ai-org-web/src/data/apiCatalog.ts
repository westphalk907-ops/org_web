/**
 * API Mock Catalog
 * -----------------------------------------------------------------------------
 * 当 USE_BACKEND = false 时，所有公开读接口都从这里取数据。
 * 字段 shape 必须和后端 Prisma 模型保持一致（前端 transform 仍然生效）。
 */
import type { Resource } from '@/api/server'

// ============================================================================
// Resources / 资料库
// ============================================================================

const RES: Resource[] = [
  {
    id: 'r1', slug: 'ai-org-blueprint',
    type: 'framework',
    title: 'AI 组织进化蓝图',
    subtitle: 'AI Org Evolution Blueprint',
    summary: '从 AI 个体到 AI 组织的五阶进化框架与诊断清单。',
    publishedAt: '2025-09-10',
    author: 'FORGE 研究组',
    tags: ['组织变革', 'AI 战略'],
    topic: 'AI Organization',
    audience: ['CEO', 'CHRO'],
    fileUrl: '/mock/blueprint.pdf',
    fileType: 'pdf', fileName: 'ai-org-blueprint.pdf', fileSize: '2.4 MB',
    pages: 28, viewCount: 1234, downloadCount: 256,
    isFeatured: true, sortOrder: 1
  },
  {
    id: 'r2', slug: 'workflow-redesign-playbook',
    type: 'playbook',
    title: '工作流重设计 Playbook',
    subtitle: 'Workflow Redesign Playbook',
    summary: '把传统流程拆解为 AI 协作流的 12 步行动手册。',
    publishedAt: '2025-09-05', author: 'FORGE 工作流组',
    tags: ['Workflow', 'Playbook'],
    fileUrl: '/mock/workflow.pdf',
    fileType: 'pdf', fileName: 'workflow.pdf', fileSize: '1.8 MB',
    pages: 22, viewCount: 980, downloadCount: 178,
    isFeatured: true, sortOrder: 2
  },
  {
    id: 'r3', slug: 'prompt-engineering-whitepaper',
    type: 'whitepaper',
    title: '企业级 Prompt 工程白皮书',
    subtitle: 'Enterprise Prompt Engineering',
    summary: '从模板、链路到评估体系：企业级 Prompt 工程方法论。',
    publishedAt: '2025-08-20', author: 'FORGE 内容组',
    tags: ['Prompt', 'Engineering'],
    fileUrl: '/mock/prompt.pdf',
    fileType: 'pdf', fileName: 'prompt.pdf', fileSize: '3.1 MB',
    pages: 36, viewCount: 2102, downloadCount: 412,
    isFeatured: true, sortOrder: 3
  },
  {
    id: 'r4', slug: 'change-management-checklist',
    type: 'checklist',
    title: 'AI 变革管理 Checklist',
    subtitle: 'Change Management Checklist',
    summary: '高管启动 AI 变革前的 50 项检查清单。',
    publishedAt: '2025-08-12', author: 'FORGE 变革组',
    tags: ['变革管理'],
    fileUrl: '/mock/checklist.pdf',
    fileType: 'pdf', fileName: 'checklist.pdf', fileSize: '0.9 MB',
    pages: 12, viewCount: 765, downloadCount: 142,
    isFeatured: true, sortOrder: 4
  },
  {
    id: 'r5', slug: 'sales-workflow-prompt',
    type: 'prompt',
    title: '销售线索评分 Prompt 集',
    subtitle: 'Sales Lead Scoring Prompts',
    summary: '12 个经过实战验证的销售场景 Prompt。',
    publishedAt: '2025-07-30', author: 'FORGE 销售组',
    tags: ['Sales', 'Prompt'],
    fileUrl: '/mock/sales-prompts.md',
    fileType: 'md', fileName: 'sales.md', fileSize: '24 KB',
    viewCount: 543, downloadCount: 98,
    isFeatured: false, sortOrder: 5
  },
  {
    id: 'r6', slug: 'meeting-summarizer-skill',
    type: 'skill',
    title: '会议结构化纪要 Skill',
    subtitle: 'Meeting Summarizer Skill',
    summary: '把任意会议录音转成可执行的纪要 + 待办。',
    publishedAt: '2025-07-18', author: 'FORGE 工作流组',
    tags: ['Meeting', 'Skill'],
    fileUrl: '/mock/skill.md',
    fileType: 'md', fileName: 'skill.md', fileSize: '18 KB',
    viewCount: 412, downloadCount: 73,
    isFeatured: false, sortOrder: 6
  },
  {
    id: 'r7', slug: 'weekly-report-workflow',
    type: 'workflow',
    title: '周报自动化 Workflow',
    subtitle: 'Weekly Report Automation',
    summary: '接入数据源自动生成结构化周报的完整工作流。',
    publishedAt: '2025-07-05', author: 'FORGE 工作流组',
    tags: ['Automation', 'Workflow'],
    fileUrl: '/mock/workflow.json',
    fileType: 'link', fileName: 'workflow.json', fileSize: '12 KB',
    viewCount: 312, downloadCount: 56,
    isFeatured: false, sortOrder: 7
  },
  {
    id: 'r8', slug: 'ai-trends-research-2025',
    type: 'research',
    title: '2025 AI 组织变革研究',
    subtitle: '2025 AI Org Trends',
    summary: '走访 40+ 企业的 AI 落地一手研究。',
    publishedAt: '2025-06-20', author: 'FORGE 研究组',
    tags: ['Research', 'Trend'],
    fileUrl: '/mock/research.pdf',
    fileType: 'pdf', fileName: 'research.pdf', fileSize: '4.6 MB',
    pages: 52, viewCount: 1872, downloadCount: 308,
    isFeatured: false, sortOrder: 8
  },
  {
    id: 'r9', slug: 'hr-ai-insight',
    type: 'insight',
    title: 'HR 如何与 AI 共事',
    subtitle: 'HR × AI Insight',
    summary: 'HR 部门 AI 化路径与岗位重构观察。',
    publishedAt: '2025-06-10', author: 'FORGE HR 组',
    tags: ['HR', 'Insight'],
    fileUrl: '/mock/hr.md',
    fileType: 'md', fileName: 'hr.md', fileSize: '16 KB',
    viewCount: 256, downloadCount: 41,
    isFeatured: false, sortOrder: 9
  },
]

// ============================================================================
// Contents / 文章（认知页等用）
// ============================================================================

export interface MockContent extends ContentItemRaw {
  // 继承后端原始字段，调用方会用 transformContent 转成前端 Content
}

interface ContentItemRaw {
  id: string
  slug: string
  category: any
  title: string
  subtitle?: string
  excerpt: string
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
  index?: string
  nodeSlug?: string
  navSection?: 'learn' | 'understand' | 'experience'
}

const CONTENT: MockContent[] = [
  // --- 系列 1 · AI Changing What ---
  {
    id: 'c1', slug: 'agent-is-new-org',
    category: 'insight',
    title: 'Agent 是新组织',
    subtitle: 'Agent Is The New Org',
    excerpt: '当 Agent 数量与能力超过人类，组织设计的范式必须重写。本文给出三条重写原则：从流程到剧本、从层级到网格、从管理到编排。',
    content: '当 Agent 数量与能力超过人类，组织设计的范式必须重写。本文给出三条重写原则。',
    contentHtml: '<p>当 Agent 数量与能力超过人类，组织设计的范式必须重写。本文给出三条重写原则。</p>',
    author: 'FORGE 主笔', publishedAt: '2025-09-20', readingTime: 8,
    tags: ['Agent', 'Organization'],
    isPublished: true, viewCount: 3450, likeCount: 218,
    index: '01', nodeSlug: 'ai-changing-what'
  },
  {
    id: 'c5', slug: 'agent-capability-evolution',
    category: 'trend',
    title: 'Agent 能力的三次跃迁',
    subtitle: 'Three Leaps of Agent Capability',
    excerpt: '从单步工具到多步推理，再到自主编排——Agent 能力沿着三条隐含曲线持续往上走。',
    content: '本文梳理 Agent 能力的三次跃迁及对应的时间窗口。',
    contentHtml: '<p>本文梳理 Agent 能力的三次跃迁及对应的时间窗口。</p>',
    author: 'FORGE 研究组', publishedAt: '2025-09-10', readingTime: 9,
    tags: ['Agent', 'Capability'],
    isPublished: true, viewCount: 2680, likeCount: 172,
    index: '02', nodeSlug: 'ai-changing-what'
  },
  {
    id: 'c6', slug: 'model-frontier-2025',
    category: 'trend',
    title: '2025 模型前沿：推理、上下文与工具',
    subtitle: 'Model Frontier 2025',
    excerpt: '推理深度、上下文长度、工具调用稳定性，是今年模型竞争的三条主线。',
    content: '本文盘点 2025 年模型能力的三条主线。',
    contentHtml: '<p>本文盘点 2025 年模型能力的三条主线。</p>',
    author: 'FORGE 研究组', publishedAt: '2025-08-22', readingTime: 11,
    tags: ['Model', 'Trend'],
    isPublished: true, viewCount: 3120, likeCount: 198,
    index: '03', nodeSlug: 'ai-changing-what'
  },
  {
    id: 'c7', slug: 'multi-agent-orchestration',
    category: 'insight',
    title: '多 Agent 编排：让 10 个 Agent 像 1 个团队',
    subtitle: 'Multi-Agent Orchestration',
    excerpt: '多 Agent 不是把任务拆给更多人，而是要重新设计协作协议与失败兜底。',
    content: '本文给出多 Agent 编排的三种典型模式。',
    contentHtml: '<p>本文给出多 Agent 编排的三种典型模式。</p>',
    author: 'FORGE 主笔', publishedAt: '2025-08-05', readingTime: 10,
    tags: ['Agent', 'Orchestration'],
    isPublished: true, viewCount: 1840, likeCount: 124,
    index: '04', nodeSlug: 'ai-changing-what'
  },
  {
    id: 'c8', slug: 'industry-ai-adoption-wave',
    category: 'trend',
    title: '行业 AI 落地的三个波浪',
    subtitle: 'Three Waves of Industry AI Adoption',
    excerpt: '客服 → 营销 → 研发 → 制造——每一波浪潮都比上一波更难，但回报也更高。',
    content: '本文梳理行业 AI 落地的三个波浪及其临界点。',
    contentHtml: '<p>本文梳理行业 AI 落地的三个波浪及其临界点。</p>',
    author: 'FORGE 研究组', publishedAt: '2025-07-18', readingTime: 12,
    tags: ['Industry', 'Adoption'],
    isPublished: true, viewCount: 2210, likeCount: 156,
    index: '05', nodeSlug: 'ai-changing-what'
  },

  // --- 系列 2 · AI Changing Work ---
  {
    id: 'c2', slug: 'workflow-first-strategy',
    category: 'point_of_view',
    title: '先重设计 Workflow，再谈 AI 战略',
    subtitle: 'Workflow First, Strategy Second',
    excerpt: '没有 Workflow 重设计的 AI 战略，都是空想。我们给出 80/20 分配原则与 12 步行动手册。',
    content: '本文主张企业应该把 80% 注意力放在 Workflow 重设计上。',
    contentHtml: '<p>本文主张企业应该把 80% 注意力放在 Workflow 重设计上。</p>',
    author: 'FORGE 主笔', publishedAt: '2025-09-12', readingTime: 6,
    tags: ['Workflow', 'Strategy'],
    isPublished: true, viewCount: 2780, likeCount: 184,
    index: '01', nodeSlug: 'ai-changing-work'
  },
  {
    id: 'c9', slug: 'individual-ai-fluency',
    category: 'point_of_view',
    title: 'AI 时代个人的能力地图',
    subtitle: 'Individual AI Fluency Map',
    excerpt: '会用 prompt 不等于 AI 能力。我们整理了从工具到判断的 5 个层级。',
    content: '本文给出 AI 时代个人能力地图。',
    contentHtml: '<p>本文给出 AI 时代个人能力地图。</p>',
    author: 'FORGE 主笔', publishedAt: '2025-09-02', readingTime: 7,
    tags: ['Individual', 'Capability'],
    isPublished: true, viewCount: 1940, likeCount: 138,
    index: '02', nodeSlug: 'ai-changing-work'
  },
  {
    id: 'c10', slug: 'workflow-12-steps',
    category: 'framework',
    title: '工作流重设计 12 步',
    subtitle: 'Workflow Redesign 12 Steps',
    excerpt: '从识别高价值场景，到小步试跑、再到组织嵌入——一套可复用的 12 步流程。',
    content: '本文给出工作流重设计的 12 步流程。',
    contentHtml: '<p>本文给出工作流重设计的 12 步流程。</p>',
    author: 'FORGE 工作流组', publishedAt: '2025-08-18', readingTime: 14,
    tags: ['Workflow', 'Framework'],
    isPublished: true, viewCount: 3050, likeCount: 222,
    index: '03', nodeSlug: 'ai-changing-work'
  },
  {
    id: 'c11', slug: 'function-job-reshape',
    category: 'insight',
    title: '职能岗位的重塑：从执行到编排',
    subtitle: 'Function & Job Reshape',
    excerpt: 'HR、财务、运营等岗位的职责正从"做"转向"编排"——这一变化比想象中更快。',
    content: '本文观察职能岗位的重塑趋势。',
    contentHtml: '<p>本文观察职能岗位的重塑趋势。</p>',
    author: 'FORGE HR 组', publishedAt: '2025-08-01', readingTime: 8,
    tags: ['Function', 'Job'],
    isPublished: true, viewCount: 1620, likeCount: 110,
    index: '04', nodeSlug: 'ai-changing-work'
  },
  {
    id: 'c12', slug: 'sales-team-ai-workflow',
    category: 'field_note',
    title: '一个销售团队如何把 AI 从工具变成工作流',
    subtitle: 'Sales Team AI Workflow',
    excerpt: '从线索评分到合同审阅，他们用 6 周时间把 AI 嵌进了 4 个核心环节。',
    content: '本文复盘一个销售团队的 AI 工作流改造过程。',
    contentHtml: '<p>本文复盘一个销售团队的 AI 工作流改造过程。</p>',
    author: 'FORGE 工作流组', publishedAt: '2025-07-22', readingTime: 9,
    tags: ['Sales', 'Workflow'],
    isPublished: true, viewCount: 1430, likeCount: 96,
    index: '05', nodeSlug: 'ai-changing-work'
  },

  // --- 系列 3 · AI Changing Organization ---
  {
    id: 'c3', slug: 'ai-org-three-stage',
    category: 'trend',
    title: 'AI 组织变革的三个阶段',
    subtitle: 'Three Stages of AI Org',
    excerpt: '从 Copilot 到 Co-worker，再到 Co-founder——AI 与组织关系的演化路径。',
    content: '从 Copilot 到 Co-worker，再到 Co-founder 的演化路径。',
    contentHtml: '<p>从 Copilot 到 Co-worker，再到 Co-founder 的演化路径。</p>',
    author: 'FORGE 研究组', publishedAt: '2025-08-28', readingTime: 7,
    tags: ['Trend'],
    isPublished: true, viewCount: 3120, likeCount: 245,
    index: '01', nodeSlug: 'ai-changing-org'
  },
  {
    id: 'c4', slug: 'forge-judgment-1',
    category: 'insight',
    title: 'FORGE 判断 #1 · 不要把 AI 当工具',
    subtitle: 'FORGE Judgment #1',
    excerpt: 'AI 不是工具，是新的协作主体。这一判断决定了我们看待 AI 战略的一切方式。',
    content: '这是 FORGE 第一个核心判断。',
    contentHtml: '<p>这是 FORGE 第一个核心判断。</p>',
    author: 'FORGE 主笔', publishedAt: '2025-08-15', readingTime: 5,
    tags: ['Judgment'],
    isPublished: true, viewCount: 1890, likeCount: 132,
    index: '02', nodeSlug: 'ai-changing-org'
  },
  {
    id: 'c13', slug: 'team-collaboration-pattern',
    category: 'insight',
    title: 'AI 团队的四种协作模式',
    subtitle: 'Four AI Team Patterns',
    excerpt: '单兵 AI、嵌入式 AI、Agent 协作、人机共创——四种主流协作模式的优劣与适用边界。',
    content: '本文总结 AI 团队的四种协作模式。',
    contentHtml: '<p>本文总结 AI 团队的四种协作模式。</p>',
    author: 'FORGE 研究组', publishedAt: '2025-09-05', readingTime: 11,
    tags: ['Team', 'Collaboration'],
    isPublished: true, viewCount: 2120, likeCount: 168,
    index: '03', nodeSlug: 'ai-changing-org'
  },
  {
    id: 'c14', slug: 'management-mechanism-redesign',
    category: 'point_of_view',
    title: '管理机制的重设计',
    subtitle: 'Management Mechanism Redesign',
    excerpt: 'OKR 不再够用、KPI 形同虚设——管理机制必须随 AI 协作主体一起重写。',
    content: '本文探讨 AI 时代管理机制的重设计。',
    contentHtml: '<p>本文探讨 AI 时代管理机制的重设计。</p>',
    author: 'FORGE 主笔', publishedAt: '2025-07-30', readingTime: 10,
    tags: ['Management', 'Mechanism'],
    isPublished: true, viewCount: 1750, likeCount: 142,
    index: '04', nodeSlug: 'ai-changing-org'
  },
  {
    id: 'c15', slug: 'governance-ai-strategy',
    category: 'insight',
    title: '治理与战略：当 AI 进入董事会',
    subtitle: 'AI Governance & Strategy',
    excerpt: '治理不再是风控的代名词，而是 AI 战略落地的关键基础设施。',
    content: '本文讨论 AI 治理与战略的关系。',
    contentHtml: '<p>本文讨论 AI 治理与战略的关系。</p>',
    author: 'FORGE 治理组', publishedAt: '2025-07-12', readingTime: 9,
    tags: ['Governance', 'Strategy'],
    isPublished: true, viewCount: 1310, likeCount: 88,
    index: '05', nodeSlug: 'ai-changing-org',
    navSection: 'understand' as const
  },
]

// 为 mock 数据中所有未指定 navSection 的文章兜底为 understand
for (const c of CONTENT) {
  if (!c.navSection) c.navSection = 'understand'
}

// ============================================================================
// Cases / 案例
// ============================================================================

export interface MockCase {
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

const CASES: MockCase[] = [
  {
    id: 'case-1', slug: 'manufacturing-co',
    company: '某新能源装备制造企业',
    industry: 'Manufacturing',
    scale: '3000+',
    title: '从研发部 AI 化到全组织 AI 化',
    before: '研发部 80% 时间在写报告，会议纪要散落各处。',
    intervention: '先做 Workflow 重设计，再引入 Agent 协同。',
    after: '报告时间 -65%，跨部门协同效率 +2.3x。',
    next: '下一步：把营销 / 售后也纳入 Workflow 重设计。',
    metrics: [
      { label: '报告时间', value: '-65%' },
      { label: '协同效率', value: '+230%' },
      { label: '员工 NPS', value: '+42' }
    ],
    testimonial: {
      quote: '我们以前觉得 AI 是工具，现在明白它是新的协作同事。',
      author: '张总监',
      position: 'CIO'
    },
    isPublished: true, publishedAt: '2025-08-01', sortOrder: 1
  },
  {
    id: 'case-2', slug: 'retail-co',
    company: '某连锁零售集团',
    industry: 'Retail',
    scale: '5000+',
    title: '门店督导工作流 AI 化',
    before: '督导每天 4 小时手动整理巡检数据。',
    intervention: '用 Agent 串联巡检 → 报告 → 工单派发。',
    after: '巡检效率 +180%，异常响应 -50%。',
    metrics: [
      { label: '巡检效率', value: '+180%' },
      { label: '异常响应', value: '-50%' }
    ],
    isPublished: true, publishedAt: '2025-07-15', sortOrder: 2
  },
  {
    id: 'case-3', slug: 'consulting-co',
    company: '某管理咨询公司',
    industry: 'Consulting',
    scale: '500+',
    title: '咨询交付的 AI 增强',
    before: '咨询师 60% 时间在收集、整理信息。',
    intervention: 'Agent 负责信息收集，咨询师专注判断。',
    after: '人均产能 +90%。',
    metrics: [
      { label: '人均产能', value: '+90%' },
      { label: '客户满意度', value: '+12pt' }
    ],
    isPublished: true, publishedAt: '2025-06-20', sortOrder: 3
  },
]

// ============================================================================
// 查询工具
// ============================================================================

export const MOCK_DB = {
  resources: RES,
  contents: CONTENT as MockContent[],
  cases: CASES,
}

export function findResource(slug: string) {
  return RES.find((r) => r.slug === slug)
}
export function findContent(slug: string) {
  return CONTENT.find((c) => c.slug === slug)
}
export function findCase(slug: string) {
  return CASES.find((c) => c.slug === slug)
}
