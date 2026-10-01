import type { AssessmentQuestion } from '@/types/content'

/**
 * AI Organization Assessment - 题库
 * 维度：strategy / people / workflow / technology / data / governance / organization
 */
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // Strategy 战略
  {
    id: 'q-s1',
    dimension: 'strategy',
    text: '公司是否有清晰的 AI 战略与目标？',
    options: [
      { label: '完全没有', score: 0 },
      { label: '仅高层有想法，未形成文档', score: 2 },
      { label: '有战略文档但未落地', score: 4 },
      { label: '明确战略并持续推进', score: 6 }
    ]
  },
  {
    id: 'q-s2',
    dimension: 'strategy',
    text: 'AI 投入是否纳入年度预算与考核？',
    options: [
      { label: '没有', score: 0 },
      { label: '有少量专项预算', score: 2 },
      { label: '有专项预算与 KPI', score: 4 },
      { label: 'AI 投入已成体系', score: 6 }
    ]
  },
  // People 人才
  {
    id: 'q-p1',
    dimension: 'people',
    text: '员工 AI 工具使用率如何？',
    options: [
      { label: '< 10%', score: 0 },
      { label: '10–30%', score: 2 },
      { label: '30–60%', score: 4 },
      { label: '> 60%', score: 6 }
    ]
  },
  {
    id: 'q-p2',
    dimension: 'people',
    text: '是否有系统化的 AI 培训？',
    options: [
      { label: '没有', score: 0 },
      { label: '零散讲座', score: 2 },
      { label: '有完整培训路径', score: 4 },
      { label: '持续培养 + 实战结合', score: 6 }
    ]
  },
  // Workflow 工作流
  {
    id: 'q-w1',
    dimension: 'workflow',
    text: '是否有 AI 改造的业务流程？',
    options: [
      { label: '没有', score: 0 },
      { label: '1–2 个试点', score: 2 },
      { label: '5+ 流程', score: 4 },
      { label: '贯穿关键业务流程', score: 6 }
    ]
  },
  {
    id: 'q-w2',
    dimension: 'workflow',
    text: 'AI 是否进入了日常工作流（不是单独工具）？',
    options: [
      { label: '完全是独立工具', score: 0 },
      { label: '部分嵌入', score: 2 },
      { label: '多数场景嵌入', score: 4 },
      { label: 'AI 已嵌入核心流程', score: 6 }
    ]
  },
  // Technology 技术
  {
    id: 'q-t1',
    dimension: 'technology',
    text: 'AI 工具采购是否有统一规范？',
    options: [
      { label: '完全无序', score: 0 },
      { label: 'IT 审批', score: 2 },
      { label: '有评估框架', score: 4 },
      { label: '标准化 + 定期评估', score: 6 }
    ]
  },
  {
    id: 'q-t2',
    dimension: 'technology',
    text: '是否有自研或深度定制的 AI 应用？',
    options: [
      { label: '只用公开工具', score: 0 },
      { label: '少量 prompt 工程', score: 2 },
      { label: '业务定制应用', score: 4 },
      { label: '多个业务专属 AI Agent', score: 6 }
    ]
  },
  // Data 数据
  {
    id: 'q-d1',
    dimension: 'data',
    text: '企业核心数据资产是否可被 AI 调用？',
    options: [
      { label: '完全不可', score: 0 },
      { label: '部分结构化', score: 2 },
      { label: '有数据中台', score: 4 },
      { label: '全要素数据化', score: 6 }
    ]
  },
  {
    id: 'q-d2',
    dimension: 'data',
    text: '是否有数据安全与合规机制？',
    options: [
      { label: '无', score: 0 },
      { label: '基础合规', score: 2 },
      { label: '完善', score: 4 },
      { label: '行业领先', score: 6 }
    ]
  },
  // Governance 治理
  {
    id: 'q-g1',
    dimension: 'governance',
    text: '是否有 AI 使用规范？',
    options: [
      { label: '没有', score: 0 },
      { label: '简单提示', score: 2 },
      { label: '成文规范', score: 4 },
      { label: '完整治理体系', score: 6 }
    ]
  },
  {
    id: 'q-g2',
    dimension: 'governance',
    text: 'AI 项目失败的复盘机制？',
    options: [
      { label: '无', score: 0 },
      { label: '偶尔', score: 2 },
      { label: '常规', score: 4 },
      { label: '系统化', score: 6 }
    ]
  },
  // Organization 组织
  {
    id: 'q-o1',
    dimension: 'organization',
    text: '是否有 AI 牵头部门或虚拟组织？',
    options: [
      { label: '没有', score: 0 },
      { label: '某人兼职', score: 2 },
      { label: '有专职团队', score: 4 },
      { label: 'AI 已嵌入组织架构', score: 6 }
    ]
  },
  {
    id: 'q-o2',
    dimension: 'organization',
    text: '中层管理者是否理解 AI 对团队的影响？',
    options: [
      { label: '多数不理解', score: 0 },
      { label: '少数理解', score: 2 },
      { label: '多数理解', score: 4 },
      { label: '全部理解并能推动', score: 6 }
    ]
  },
  {
    id: 'q-o3',
    dimension: 'organization',
    text: 'AI 是否影响绩效与协作方式？',
    options: [
      { label: '完全不影响', score: 0 },
      { label: '少量影响', score: 2 },
      { label: '部分影响', score: 4 },
      { label: '重塑协作', score: 6 }
    ]
  }
]

export const TOTAL_QUESTIONS = ASSESSMENT_QUESTIONS.length  // 15
