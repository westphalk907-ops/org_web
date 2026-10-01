import type { ContentItem } from '@/types/content'

/**
 * 资源全量数据集
 *
 * 字段约定：
 *  - fileUrl：mock 阶段指向 /public/files/*；后端接上后可改为签名 URL
 *  - fileType：pdf / md / link / notion
 *  - fileName：浏览器下载时的默认文件名
 */
export const RESOURCES_FULL: ContentItem[] = [
  // ───────────────── INSIGHT 洞察 ─────────────────
  {
    id: 'res-insight-1',
    slug: 'ai-org-evolution-whitepaper',
    type: 'insight',
    title: 'AI 组织进化白皮书',
    subtitle: 'AI Org Evolution Whitepaper',
    summary: '从工具使用到组织重塑，6 个阶段、12 个核心能力。',
    fileUrl: '/files/insight/ai-org-evolution.md',
    fileType: 'md',
    fileName: 'AI组织进化白皮书.md',
    fileSize: '28 KB',
    pages: 28,
    publishedAt: '2026-03-12',
    author: '道可乾元研究院'
  },
  {
    id: 'res-insight-2',
    slug: 'human-ai-collaboration-mindset',
    type: 'insight',
    title: '人机协作心智模型',
    subtitle: 'Human–AI Collaboration Mindset',
    summary: '一线管理者视角：当 AI 成为同事，管理者该做哪些改变。',
    fileUrl: '/files/insight/human-ai-collaboration.md',
    fileType: 'md',
    fileName: '人机协作心智模型.md',
    fileSize: '12 KB',
    publishedAt: '2026-02-08',
    author: '道可乾元研究院'
  },
  {
    id: 'res-insight-3',
    slug: 'frontline-ai-research',
    type: 'research',
    title: '一线工作场景研究',
    subtitle: 'Frontline AI Use Research',
    summary: '30 家企业、120 个岗位的 AI 真实使用方式与收益分布。',
    fileUrl: '/files/research/frontline-ai-research.pdf',
    fileType: 'pdf',
    fileName: '一线工作场景研究.pdf',
    fileSize: '8.6 MB',
    pages: 64,
    publishedAt: '2026-01-20'
  },
  {
    id: 'res-insight-4',
    slug: '5-truths-of-ai-failure',
    type: 'insight',
    title: 'AI 落地失败的 5 个真相',
    subtitle: '5 Truths of AI Failure',
    summary: '为什么 80% 的 AI 试点停在了第二个季度。',
    fileUrl: '/files/insight/5-truths-of-ai-failure.md',
    fileType: 'md',
    fileName: 'AI落地失败的5个真相.md',
    fileSize: '9 KB',
    publishedAt: '2026-02-25'
  },

  // ───────────────── PROMPT 提示词 ─────────────────
  {
    id: 'res-prompt-1',
    slug: 'strategy-translator',
    type: 'prompt',
    title: '战略翻译提示词',
    subtitle: 'Strategy Translator Prompt',
    summary: '把老板的一句话，翻译成可执行的产品策略。',
    fileUrl: '/files/prompt/strategy-translator.md',
    fileType: 'md',
    fileName: '战略翻译提示词.md',
    fileSize: '4 KB',
    publishedAt: '2026-03-01'
  },
  {
    id: 'res-prompt-2',
    slug: 'customer-interview-outline',
    type: 'prompt',
    title: '客户访谈提纲提示词',
    subtitle: 'Customer Interview Outline',
    summary: '30 秒生成一份高密度、不引导的客户访谈提纲。',
    fileUrl: '/files/prompt/customer-interview-outline.md',
    fileType: 'md',
    fileName: '客户访谈提纲提示词.md',
    fileSize: '5 KB',
    publishedAt: '2026-03-01'
  },
  {
    id: 'res-prompt-3',
    slug: 'executive-briefing',
    type: 'prompt',
    title: '汇报写稿提示词',
    subtitle: 'Executive Briefing Prompt',
    summary: '把零散产出，整理成 1 页可上会的管理层汇报。',
    fileUrl: '/files/prompt/executive-briefing.md',
    fileType: 'md',
    fileName: '汇报写稿提示词.md',
    fileSize: '4 KB',
    publishedAt: '2026-02-20'
  },
  {
    id: 'res-prompt-4',
    slug: 'competitor-scan',
    type: 'prompt',
    title: '竞品速读提示词',
    subtitle: 'Competitor Scan Prompt',
    summary: '丢一个域名，30 秒输出竞品能力地图与差异化点。',
    fileUrl: '/files/prompt/competitor-scan.md',
    fileType: 'md',
    fileName: '竞品速读提示词.md',
    fileSize: '3 KB',
    publishedAt: '2026-02-20'
  },

  // ───────────────── SKILL 技能 ─────────────────
  {
    id: 'res-skill-1',
    slug: 'customer-research-skill',
    type: 'skill',
    title: '客户研究技能',
    subtitle: 'Customer Research Skill',
    summary: '把客户访谈内容自动整理为洞察、标签与画像。',
    fileUrl: '/files/skill/customer-research.md',
    fileType: 'md',
    fileName: '客户研究技能.md',
    fileSize: '6 KB',
    publishedAt: '2026-02-10'
  },
  {
    id: 'res-skill-2',
    slug: 'meeting-notes-skill',
    type: 'skill',
    title: '会议纪要技能',
    subtitle: 'Meeting Notes Skill',
    summary: '把会议录音转成结构化纪要、行动项与决策记录。',
    fileUrl: '/files/skill/meeting-notes.md',
    fileType: 'md',
    fileName: '会议纪要技能.md',
    fileSize: '6 KB',
    publishedAt: '2026-02-10'
  },
  {
    id: 'res-skill-3',
    slug: 'weekly-report-skill',
    type: 'skill',
    title: '周报生成技能',
    subtitle: 'Weekly Report Skill',
    summary: '把一周碎片产出，整理成可对外发布的周报。',
    fileUrl: '/files/skill/weekly-report.md',
    fileType: 'md',
    fileName: '周报生成技能.md',
    fileSize: '5 KB',
    publishedAt: '2026-02-10'
  },
  {
    id: 'res-skill-4',
    slug: 'knowledge-base-skill',
    type: 'skill',
    title: '知识库整理技能',
    subtitle: 'Knowledge Base Skill',
    summary: '把散落文档，整理为可检索、可复用的知识图谱。',
    fileUrl: '/files/skill/knowledge-base.md',
    fileType: 'md',
    fileName: '知识库整理技能.md',
    fileSize: '7 KB',
    publishedAt: '2026-02-10'
  },

  // ───────────────── WORKFLOW 工作流 ─────────────────
  {
    id: 'res-workflow-1',
    slug: 'ai-market-research-workflow',
    type: 'workflow',
    title: 'AI 市场研究工作流',
    subtitle: 'AI Market Research Workflow',
    summary: '从市场信息收集，到洞察生成，再到管理层报告。',
    fileUrl: '/files/workflow/ai-market-research.md',
    fileType: 'md',
    fileName: 'AI市场研究工作流.md',
    fileSize: '14 KB',
    pages: 12,
    publishedAt: '2026-03-05',
    tags: ['工作流', '旗舰']
  },
  {
    id: 'res-workflow-2',
    slug: 'ai-customer-interview-workflow',
    type: 'workflow',
    title: 'AI 客户访谈工作流',
    subtitle: 'AI Customer Interview Workflow',
    summary: '从访谈提纲，到录音转写，再到洞察分类。',
    fileUrl: '/files/workflow/ai-customer-interview.md',
    fileType: 'md',
    fileName: 'AI客户访谈工作流.md',
    fileSize: '12 KB',
    publishedAt: '2026-02-28'
  },
  {
    id: 'res-workflow-3',
    slug: 'ai-weekly-retrospective-workflow',
    type: 'workflow',
    title: 'AI 周会复盘工作流',
    subtitle: 'AI Weekly Retrospective Workflow',
    summary: '把一周碎片产出，整理成可上会的复盘报告。',
    fileUrl: '/files/workflow/ai-weekly-retrospective.md',
    fileType: 'md',
    fileName: 'AI周会复盘工作流.md',
    fileSize: '10 KB',
    publishedAt: '2026-02-28'
  },

  // ───────────────── PLAYBOOK / FRAMEWORK / 白皮书 / Checklist ─────────────────
  {
    id: 'res-playbook-1',
    slug: 'ai-90-day-action-guide',
    type: 'playbook',
    title: 'AI 90天行动指南',
    subtitle: 'AI 90-Day Action Guide',
    summary: '把 AI 转型拆成 12 周、3 个阶段，落到每周产出。',
    fileUrl: '/files/playbook/ai-90-day-action-guide.pdf',
    fileType: 'pdf',
    fileName: 'AI 90天行动指南.pdf',
    fileSize: '6.2 MB',
    pages: 36,
    publishedAt: '2026-01-15'
  },
  {
    id: 'res-playbook-2',
    slug: 'ai-department-playbook',
    type: 'playbook',
    title: 'AI 部门落地手册',
    subtitle: 'AI Department Playbook',
    summary: '一个部门从 0 到 1 启动 AI 的完整 SOP 与检查表。',
    fileUrl: '/files/playbook/ai-department-playbook.pdf',
    fileType: 'pdf',
    fileName: 'AI 部门落地手册.pdf',
    fileSize: '4.1 MB',
    pages: 24,
    publishedAt: '2026-01-08'
  },
  {
    id: 'res-playbook-3',
    slug: 'manager-30-questions',
    type: 'checklist',
    title: '管理者 30 问清单',
    subtitle: 'Manager 30 Questions Checklist',
    summary: '管理者推动 AI 落地前，先问完这 30 个问题。',
    fileUrl: '/files/checklist/manager-30-questions.md',
    fileType: 'md',
    fileName: '管理者30问清单.md',
    fileSize: '5 KB',
    publishedAt: '2026-02-22'
  },

  // ───────────────── 旧 FEATURED 资源（保留） ─────────────────
  {
    id: 'res-feat-1',
    slug: 'ai-organization-maturity-report-2026',
    type: 'whitepaper',
    title: '2026 企业 AI 组织成熟度报告',
    subtitle: 'AI Organization Maturity Report 2026',
    summary: '基于 500+ 企业调研，揭示 AI 组织进化的 5 个阶段与关键差距。',
    fileUrl: '/files/whitepaper/ai-org-maturity-report-2026.pdf',
    fileType: 'pdf',
    fileName: '2026企业AI组织成熟度报告.pdf',
    fileSize: '13.4 MB',
    pages: 85,
    publishedAt: '2026-01-10',
    tags: ['旗舰', '白皮书']
  },
  {
    id: 'res-feat-2',
    slug: 'ai-individual-map',
    type: 'framework',
    title: 'AI 个体能力地图',
    subtitle: 'AI Individual Capability Map',
    summary: '从感知者到架构师，五阶段个人 AI 能力进化框架。',
    fileUrl: '/experience/individual-map',
    fileType: 'link',
    fileName: '',
    pages: 12,
    publishedAt: '2026-02-15'
  },
  {
    id: 'res-feat-3',
    slug: 'ai-transformation-90-days',
    type: 'playbook',
    title: '企业 AI 转型 90 天行动指南',
    subtitle: 'AI Transformation 90 Days Playbook',
    summary: '90 天落地路线图，覆盖战略、培训、场景、组织四维度。',
    fileUrl: '/files/playbook/ai-transformation-90-days.pdf',
    fileType: 'pdf',
    fileName: '企业AI转型90天行动指南.pdf',
    fileSize: '5.6 MB',
    pages: 32,
    publishedAt: '2025-12-12'
  },
  {
    id: 'res-feat-4',
    slug: 'ai-readiness-checklist',
    type: 'checklist',
    title: 'AI 场景与组织准备度 Checklist',
    subtitle: 'AI Readiness Checklist',
    summary: '60 个判断题，5 分钟评估你的企业 AI 就绪度。',
    fileUrl: '/files/checklist/ai-readiness-checklist.md',
    fileType: 'md',
    fileName: 'AI场景与组织准备度Checklist.md',
    fileSize: '7 KB',
    publishedAt: '2025-11-20'
  }
]

/** 按 slug 查找资源 */
export function findResourceBySlug(slug: string): ContentItem | undefined {
  return RESOURCES_FULL.find((r) => r.slug === slug)
}

/** 按类型分组 */
export function groupByType() {
  const groups: Record<string, ContentItem[]> = {}
  RESOURCES_FULL.forEach((r) => {
    if (!groups[r.type]) groups[r.type] = []
    groups[r.type].push(r)
  })
  return groups
}
