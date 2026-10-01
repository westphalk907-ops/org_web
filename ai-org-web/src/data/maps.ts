import type { MapNode } from '@/types/content'

/**
 * AI Organization Map - 企业 AI 组织进化路径
 */
export const ORGANIZATION_MAP: MapNode[] = [
  {
    id: 'org-l1',
    stage: 'L1',
    title: '认知期',
    description: '企业开始意识到 AI 潜力，尚未系统化投入。',
    characteristics: [
      '少量员工个人尝试使用 ChatGPT 等通用工具',
      '管理层尚未形成 AI 战略',
      '没有专项预算或团队'
    ],
    painPoints: [
      '不知道 AI 能做什么、不能做什么',
      '担心信息安全和合规风险',
      '无法判断从哪里开始'
    ],
    actions: [
      '高层参加 AI 趋势与组织变革讲座',
      '下载《企业 AI 组织成熟度报告》',
      '完成 AI 组织成熟度测评'
    ],
    resources: [
      { title: '《企业 AI 组织成熟度报告》', href: '/understand/research', type: 'whitepaper' },
      { title: 'AI 组织成熟度测评', href: '/experience/assessment', type: 'tool' }
    ],
    services: [
      { title: 'AI 趋势高管讲座', href: '/act/academy' }
    ]
  },
  {
    id: 'org-l2',
    stage: 'L2',
    title: '探索期',
    description: '局部团队开始 AI 工具试点，尚未形成组织共识。',
    characteristics: [
      '部分团队自发使用 AI 工具',
      '不同部门使用不同工具',
      '缺乏统一规范'
    ],
    painPoints: [
      'AI 工具分散，无法评估价值',
      '员工能力参差不齐',
      '缺少培训与最佳实践沉淀'
    ],
    actions: [
      '盘点现有 AI 工具与使用情况',
      '启动 AI Academy 个体能力培训',
      '建立内部知识共享机制'
    ],
    resources: [
      { title: '《90 天 AI 转型行动指南》', href: '/learn/playbooks', type: 'playbook' },
      { title: 'AI 个体能力地图', href: '/experience/individual-map', type: 'framework' }
    ],
    services: [
      { title: 'AI Academy 培训', href: '/act/academy' }
    ]
  },
  {
    id: 'org-l3',
    stage: 'L3',
    title: '构建期',
    description: '已建立专项团队和试点项目，开始关注工作流与场景。',
    characteristics: [
      '成立 AI 专项团队或虚拟组织',
      '启动 3–5 个场景试点',
      '开始关注 ROI'
    ],
    painPoints: [
      '场景选择缺乏方法',
      '试点无法规模复制',
      '跨部门协作困难'
    ],
    actions: [
      '用 AI Work Lab 方法识别高价值场景',
      '设计 AI 工作流原型',
      '建立场景评估与优先级机制'
    ],
    resources: [
      { title: 'AI 工作流设计框架', href: '/learn/frameworks', type: 'framework' },
      { title: '行业场景案例集', href: '/cases', type: 'case' }
    ],
    services: [
      { title: 'AI Work Lab', href: '/act/work-lab' }
    ]
  },
  {
    id: 'org-l4',
    stage: 'L4',
    title: '规模化期',
    description: 'AI 在多个业务线规模化，需要组织机制保障。',
    characteristics: [
      'AI 在多业务线铺开',
      '需要组织治理与流程机制',
      '关注规模化 ROI'
    ],
    painPoints: [
      '如何从 1 到 N',
      '跨部门资源冲突',
      '数据与权限管理复杂'
    ],
    actions: [
      '建立 AI 组织治理委员会',
      '设计 AI 治理流程',
      '重构关键绩效指标'
    ],
    resources: [
      { title: 'AI 组织治理白皮书', href: '/learn/whitepapers', type: 'whitepaper' },
      { title: '组织变革 Playbook', href: '/learn/playbooks', type: 'playbook' }
    ],
    services: [
      { title: 'AI 组织变革咨询', href: '/act/consulting' }
    ]
  },
  {
    id: 'org-l5',
    stage: 'L5',
    title: 'AI 组织期',
    description: 'AI 已深度融入组织运作，人机协作成为核心生产力。',
    characteristics: [
      'AI 嵌入核心业务流程',
      '数据驱动决策',
      '组织持续进化'
    ],
    painPoints: [
      '如何保持行业领先',
      'AI 与人类角色重新定义',
      '伦理与可持续'
    ],
    actions: [
      '进入行业基准对标',
      '探索 AI × 人类协作新模式',
      '建立外部生态合作'
    ],
    resources: [
      { title: 'AI 组织成熟度报告（年度）', href: '/understand/research', type: 'research' }
    ],
    services: [
      { title: '战略合作', href: '/contact' }
    ]
  }
]

/**
 * AI Individual Map - 个体能力进化路径
 */
export const INDIVIDUAL_MAP: MapNode[] = [
  {
    id: 'ind-l1',
    stage: 'L1',
    title: '感知者',
    description: '刚开始接触 AI 工具，使用 ChatGPT 等通用助手。',
    characteristics: ['会用基础问答', '工具使用碎片化', '未进入工作流'],
    painPoints: ['不知道怎么用在工作里', '效率提升不明显'],
    actions: ['学习 Prompt 基础', '识别高频重复任务', '尝试 1–2 个工具'],
    resources: [
      { title: '《AI 时代个人效率手册》', href: '/learn/playbooks', type: 'playbook' }
    ],
    services: [
      { title: 'AI 基础工作坊', href: '/act/academy' }
    ]
  },
  {
    id: 'ind-l2',
    stage: 'L2',
    title: '使用者',
    description: '能够在常见场景稳定使用 AI 工具。',
    characteristics: ['熟悉 3+ 工具', '每周使用 5+ 小时', '能写有效 Prompt'],
    painPoints: ['成果不稳定', '难以复用'],
    actions: ['沉淀 Prompt 模板', '建立个人知识库', '尝试 Agent 编排'],
    resources: [
      { title: 'AI 个体能力地图', href: '/learn/frameworks', type: 'framework' }
    ],
    services: [
      { title: 'AI Academy 进阶课', href: '/act/academy' }
    ]
  },
  {
    id: 'ind-l3',
    stage: 'L3',
    title: '协作者',
    description: '与 AI 形成稳定协作，重塑个人工作方式。',
    characteristics: ['AI 嵌入日常工作流', 'Prompt 工程熟练', '能与 AI 共同创作'],
    painPoints: ['缺乏方法论', '团队协同困难'],
    actions: ['形成个人方法论', '沉淀团队最佳实践', '尝试跨工具编排'],
    resources: [
      { title: '《AI 工作流设计》', href: '/learn/playbooks', type: 'playbook' }
    ],
    services: [
      { title: 'AI 工作流工作坊', href: '/act/work-lab' }
    ]
  },
  {
    id: 'ind-l4',
    stage: 'L4',
    title: '驱动者',
    description: '能够驱动团队和组织使用 AI。',
    characteristics: ['培训团队', '设计 AI 工作流', '推动组织变革'],
    painPoints: ['组织阻力', '跨部门协同'],
    actions: ['设计团队培训', '推动 AI 项目', '构建 AI 团队文化'],
    resources: [
      { title: '《Manager AI 手册》', href: '/learn/playbooks', type: 'playbook' }
    ],
    services: [
      { title: '管理者 AI 训练营', href: '/act/academy' }
    ]
  },
  {
    id: 'ind-l5',
    stage: 'L5',
    title: '架构师',
    description: '能够在组织或行业层面构建 AI 解决方案。',
    characteristics: ['设计组织 AI 战略', '构建复杂 AI 系统', '定义行业最佳实践'],
    painPoints: ['战略与执行脱节', '生态整合'],
    actions: ['参与行业标准', '建立外部生态', '持续学习前沿'],
    resources: [
      { title: 'AI 组织战略研究', href: '/understand/research', type: 'research' }
    ],
    services: [
      { title: '专家咨询', href: '/contact' }
    ]
  }
]
