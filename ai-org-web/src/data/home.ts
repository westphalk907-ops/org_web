import type { CaseStudy } from '@/types/content'

/**
 * 首页痛点区数据
 */
export const PAIN_POINTS = [
  {
    id: 'pain-individual',
    title: '员工会用 AI，但不会用进工作',
    description: 'AI 个体能力不足或碎片化，员工停留在"玩具级"使用。',
    icon: 'user',
    href: '/experience/individual-map'
  },
  {
    id: 'pain-workflow',
    title: 'AI 工具很多，但工作方式没变',
    description: '缺少 Workflow 设计，工具与流程脱节。',
    icon: 'workflow',
    href: '/experience/workflow-demo'
  },
  {
    id: 'pain-organization',
    title: 'AI 项目很多，但无法规模化',
    description: '缺少组织机制与路线图，无法从试点走向规模化。',
    icon: 'organization',
    href: '/experience/organization-map'
  },
  {
    id: 'pain-start',
    title: '不知道企业 AI 从哪里开始',
    description: '缺少成熟度判断与可执行的下一步。',
    icon: 'compass',
    href: '/experience/assessment'
  }
]

/**
 * 首页旗舰资源
 */
export const FEATURED_RESOURCES = [
  {
    id: 'res-1',
    type: 'whitepaper',
    title: '《2026 企业 AI 组织成熟度报告》',
    description: '基于 500+ 企业调研，揭示 AI 组织进化的 5 个阶段与关键差距。',
    meta: '85 页 · PDF · 13.4 MB',
    href: '/resources/ai-organization-maturity-report-2026',
    tag: '旗舰白皮书'
  },
  {
    id: 'res-2',
    type: 'framework',
    title: '《AI 个体能力地图》',
    description: '从感知者到架构师，五阶段个人 AI 能力进化框架。',
    meta: '12 页 · 框架 · 在线',
    href: '/resources/ai-individual-map',
    tag: 'Framework'
  },
  {
    id: 'res-3',
    type: 'playbook',
    title: '《企业 AI 转型 90 天行动指南》',
    description: '90 天落地路线图，覆盖战略、培训、场景、组织四维度。',
    meta: '32 页 · Playbook · PDF',
    href: '/resources/ai-transformation-90-days',
    tag: 'Playbook'
  },
  {
    id: 'res-4',
    type: 'checklist',
    title: '《AI 场景与组织准备度 Checklist》',
    description: '60 个判断题，5 分钟评估你的企业 AI 就绪度。',
    meta: 'Checklist · 在线',
    href: '/resources/ai-readiness-checklist',
    tag: 'Checklist'
  }
]

/**
 * 首页方法论 5 阶段
 */
export const METHODOLOGY_STAGES = [
  { id: 'm1', title: 'AI 个体', desc: '个体能力是起点' },
  { id: 'm2', title: 'AI 工作', desc: '工作场景是练兵场' },
  { id: 'm3', title: 'AI 团队', desc: '团队协同放大价值' },
  { id: 'm4', title: 'AI 流程', desc: '流程嵌入沉淀能力' },
  { id: 'm5', title: 'AI 组织', desc: '组织设计决定规模化' }
]

/**
 * 典型案例（首页展示）
 */
export const FEATURED_CASES: CaseStudy[] = [
  {
    id: 'case-1',
    slug: 'manufacturing-ai-org',
    company: '某大型制造企业',
    industry: '制造业 · 万人规模',
    scale: '10,000+ 员工',
    title: '从工具试点到 AI 组织治理',
    before: '20+ 部门各自采购 AI 工具，数据安全事件频发，跨部门 AI 项目无法协同。',
    intervention: 'AI Academy 全员培训（800 人）+ Work Lab 场景共创 6 个 + 组织变革咨询（治理委员会 + KPI 重构）。',
    after: '统一工具栈，AI 流程标准化 12 个，跨部门复用率提升 60%，合规事件降为 0。',
    next: '进入行业基准对标，开放 AI 生态合作。',
    metrics: [
      { label: '流程标准化', value: '12 个' },
      { label: '复用率提升', value: '+60%' },
      { label: '合规事件', value: '0' }
    ],
    testimonial: {
      quote: '我们不是引入了一个工具，而是重建了一套 AI 时代的工作方式。',
      author: 'CDO',
      position: '某制造集团'
    }
  },
  {
    id: 'case-2',
    slug: 'saas-ai-workflow',
    company: '某 SaaS 公司',
    industry: 'B2B SaaS · 500 人',
    scale: '500 员工',
    title: '销售流程 AI 化，月签单翻倍',
    before: '销售人效低，新人成单周期 6 个月，线索分配不均导致转化率波动。',
    intervention: 'Workflow Demo 设计 + AI Work Lab 落地 3 条核心销售流程 + 销售培训。',
    after: '新人成单周期缩短至 3 个月，单线索转化率提升 45%，月签单翻倍。',
    next: '扩展到客服与产品流程。',
    metrics: [
      { label: '成单周期', value: '-50%' },
      { label: '转化率', value: '+45%' },
      { label: '月签单', value: '×2' }
    ]
  },
  {
    id: 'case-3',
    slug: 'finance-ai-individual',
    company: '某金融机构',
    industry: '金融 · 千人规模',
    scale: '2,000+ 员工',
    title: '员工 AI 能力从 10% 到 80%',
    before: '员工 AI 使用率 < 10%，仅限科技部门，影响范围有限。',
    intervention: 'AI Academy 全员培训（1500 人）+ 个体能力地图 + 内部 Prompt 知识库。',
    after: '员工 AI 使用率达 82%，人均节省每周 6 小时，新人融入周期缩短 40%。',
    next: '进入流程化与组织化阶段。',
    metrics: [
      { label: 'AI 使用率', value: '82%' },
      { label: '周节省时间', value: '6h / 人' },
      { label: '新人融入', value: '-40%' }
    ]
  }
]

/**
 * 顶部导航入口
 */
export const NAV_ITEMS = [
  {
    label: 'Understand',
    labelZh: '认知',
    href: '/understand',
    description: '趋势 · 洞察 · 研究'
  },
  {
    label: 'Learn',
    labelZh: '学习',
    href: '/learn',
    description: '框架 · 指南 · 白皮书'
  },
  {
    label: 'Experience',
    labelZh: '体验',
    href: '/experience',
    description: '测评 · 地图 · Demo'
  },
  {
    label: 'Act',
    labelZh: '行动',
    href: '/act',
    description: '培训 · 项目 · 咨询'
  },
  {
    label: 'Resources',
    labelZh: '资料',
    href: '/resources',
    description: '报告 · 模板 · 案例'
  }
]
