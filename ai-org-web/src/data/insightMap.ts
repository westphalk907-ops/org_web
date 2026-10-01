/**
 * 认知地图数据模型
 * -----------------------------------------------------------------------------
 * 核心理念：
 *  - 「主题 / 认知节点」是最小单位，而不是公众号文章
 *  - 公众号文章是「节点」的动态内容层，挂载到对应节点
 *  - 整套结构是 FORGE 网站的内容骨架，公众号 / 学习课程 / Skill / Workflow
 *    / 案例 / 资源都会顺着这张地图自然生长
 */

/** 认知节点（地图上的一个圆圈 / 一张卡片） */
export interface CognitionNode {
  /** 唯一 id，用于路由跳转 */
  slug: string
  /** 中文名 */
  label: string
  /** 英文 / 副标题 */
  en: string
  /** 一句话说明 */
  desc: string
  /** 当前节点已沉淀的子主题（详细到二级认知） */
  topics: { name: string; count?: number }[]
  /** 当前节点已挂载的公众号文章数（用于显示内容深度） */
  articles?: number
  /** 当前节点已挂载的 framework 数量 */
  frameworks?: number
}

/**
 * 一级认知路径
 * 这是用户进入认知页后，第一眼看到的"演进路径"
 * 与首页的 AI Individual / Workflow / Organization 三阶不同，
 * 这里更偏向"AI 究竟在改变什么"——把范围拉得更宽、更具思辨性
 */
export const COGNITION_PATH: CognitionNode[] = [
  {
    slug: 'ai-changing-what',
    label: 'AI 正在改变什么',
    en: 'AI Changing What',
    desc: '趋势 / 技术 / Agent / AI Evolution',
    topics: [
      { name: '技术演进', count: 12 },
      { name: 'Agent 形态', count: 8 },
      { name: '模型能力', count: 6 },
      { name: '产业趋势', count: 14 }
    ],
    articles: 40,
    frameworks: 3
  },
  {
    slug: 'ai-changing-work',
    label: 'AI 正在改变工作什么',
    en: 'AI Changing Work',
    desc: 'Individual / Work / Workflow',
    topics: [
      { name: '个人能力', count: 12 },
      { name: '职能岗位', count: 15 },
      { name: '工作方式', count: 11 },
      { name: '流程重构', count: 21 }
    ],
    articles: 52,
    frameworks: 5
  },
  {
    slug: 'ai-changing-organization',
    label: 'AI 为什么必须改变组织',
    en: 'AI Changing Organization',
    desc: 'Team / Management / Organization',
    topics: [
      { name: '团队协作', count: 9 },
      { name: '管理机制', count: 12 },
      { name: '组织设计', count: 14 },
      { name: '治理与战略', count: 7 }
    ],
    articles: 42,
    frameworks: 4
  }
]

/** 02｜Do Core 的判断：四类认知资产 */
export interface JudgmentItem {
  code: string
  label: string
  en: string
  desc: string
  /** 点击进入对应类型列表页（?type=...） */
  href: string
  highlights: string[]
}

export const FORGE_JUDGMENTS: JudgmentItem[] = [
  {
    code: 'P',
    label: '核心观点',
    en: 'Point of View',
    desc: 'FORGE 对 AI 组织变革最重要的判断与立场',
    href: '/understand/insights?type=pov',
    highlights: [
      'AI 不会直接替代组织，但会重新定义工作',
      '人人都会用 AI，依然不是 AI 转型',
      '工具变革 ≠ 流程变革 ≠ 组织变革'
    ]
  },
  {
    code: 'F',
    label: '框架模型',
    en: 'Framework',
    desc: 'FORGE 自有的方法论资产，沉淀为可复用的心智模型',
    href: '/understand/insights?type=framework',
    highlights: [
      'AI Organization Map',
      'AI Maturity Model',
      'AI Individual Map',
      'AI Workflow Canvas'
    ]
  },
  {
    code: 'I',
    label: '深度洞察',
    en: 'Insight',
    desc: '比公众号文章更深的研究、专题、数据分析',
    href: '/understand/insights?type=insight',
    highlights: [
      '企业 AI Adoption 的五个阶段',
      'Agent 对企业组织意味着什么',
      'AI 转型的隐性成本'
    ]
  },
  {
    code: 'M',
    label: '心智模型',
    en: 'Mental Model',
    desc: '我们看 AI 组织变革的方式，决定了我们如何行动',
    href: '/understand/insights?type=mental-model',
    highlights: [
      '从工具到系统',
      '从效率到结构',
      '从个人到组织'
    ]
  }
]

/** 03｜本周 FORGE 观察（公众号最新 3 篇） */
export interface WeeklyNote {
  index: string
  category: string
  title: string
  date: string
  /** 公众号原文链接（占位） */
  href: string
  /** 对应的认知节点 slug，悬停时可在地图上高亮 */
  nodeSlug: string
}

export const WEEKLY_NOTES: WeeklyNote[] = [
  {
    index: '01',
    category: 'TREND',
    title: 'Agent 正在进入企业，但真正的变化还没开始',
    date: '2026.09.28',
    href: '#',
    nodeSlug: 'ai-changing-what'
  },
  {
    index: '02',
    category: 'POINT OF VIEW',
    title: '为什么"人人都会用 AI"依然不是 AI 转型？',
    date: '2026.09.26',
    href: '#',
    nodeSlug: 'ai-changing-organization'
  },
  {
    index: '03',
    category: 'FIELD NOTE',
    title: '一个销售团队如何把 AI 从工具变成工作流？',
    date: '2026.09.24',
    href: '#',
    nodeSlug: 'ai-changing-work'
  }
]

/** 04｜深度认知 */
export interface DeepInsight {
  code: string
  category: string
  title: string
  summary: string
  readTime: string
  href: string
  /** 主题色标记 */
  accent: 'gold' | 'ember' | 'jade'
}

export const DEEP_INSIGHTS: DeepInsight[] = [
  {
    code: 'R-01',
    category: 'RESEARCH',
    title: '企业 AI Adoption 的五个阶段：我们在哪儿？',
    summary: '从工具试用到组织重塑，AI 转型是一条非线性的进化路径。本研究基于 60+ 家中国企业的实地观察。',
    readTime: '12 min',
    href: '/understand/insights?category=research',
    accent: 'gold'
  },
  {
    code: 'I-07',
    category: 'INSIGHT',
    title: 'Agent 对企业组织意味着什么',
    summary: 'Agent 不只是更聪明的工具，它会重新分配任务、决策权与责任归属。',
    readTime: '8 min',
    href: '/understand/insights?category=insight',
    accent: 'ember'
  },
  {
    code: 'D-03',
    category: 'DEEP DIVE',
    title: '从 Workflow Demo 到生产：那些被低估的失败',
    summary: '为什么 80% 的 AI Workflow 在生产环节会失败？我们梳理了 23 个真实案例的共同结构。',
    readTime: '15 min',
    href: '/understand/insights?category=field_note',
    accent: 'jade'
  }
]

/** 05｜继续探索：四类下游入口 */
export interface ExploreEntry {
  label: string
  en: string
  desc: string
  href: string
  /** 用于小图标的字符（emoji-free，用纯符号 / 字母） */
  glyph: string
}

export const EXPLORE_ENTRIES: ExploreEntry[] = [
  {
    label: '学习',
    en: 'Learn',
    desc: '从框架、白皮书到行动手册，把认知变成系统知识',
    href: '/learn',
    glyph: 'L'
  },
  {
    label: '体验',
    en: 'Experience',
    desc: 'AI 个体地图 / 组织地图 / 成熟度测评 / 工作流演示',
    href: '/experience',
    glyph: 'E'
  },
  {
    label: '资源',
    en: 'Resources',
    desc: '模板、清单、案例集——可下载、可立即使用',
    href: '/resources',
    glyph: 'R'
  },
  {
    label: '解决方案',
    en: 'Solutions',
    desc: 'AI Academy / Work Lab / 组织变革咨询',
    href: '/act',
    glyph: 'S'
  }
]
