import type { WorkflowScenario } from '@/types/content'

/**
 * Workflow Demo 场景库
 */
export const WORKFLOW_SCENARIOS: WorkflowScenario[] = [
  {
    id: 'wf-sales',
    industry: 'sales',
    title: '销售线索跟进',
    description: '销售线索从分配到首次接触到建立信任',
    traditional: {
      duration: '4 小时 / 单',
      steps: [
        { role: '销售助理', action: '手工分单', duration: '20 分钟' },
        { role: '销售', action: '查询客户背景', duration: '60 分钟' },
        { role: '销售', action: '准备首次接触话术', duration: '90 分钟' },
        { role: '销售', action: '电话 / 邮件沟通', duration: '30 分钟' },
        { role: '销售', action: '整理 CRM 记录', duration: '40 分钟' }
      ],
      output: '线索分配 + 客户档案 + 沟通记录'
    },
    aiEnabled: {
      duration: '45 分钟 / 单',
      steps: [
        { role: 'AI Agent', action: '智能分单（基于画像与历史转化）', duration: '1 分钟' },
        { role: 'AI Agent', action: '聚合客户画像（公司、新闻、舆情）', duration: '2 分钟' },
        { role: 'AI 助手', action: '生成首次接触话术与价值主张', duration: '3 分钟' },
        { role: '销售', action: '电话沟通（AI 实时辅助）', duration: '30 分钟' },
        { role: 'AI 助手', action: '自动 CRM 记录 + 跟进建议', duration: '2 分钟' }
      ],
      output: '线索画像 + 个性化话术 + 自动记录 + 下一步建议'
    }
  },
  {
    id: 'wf-marketing',
    industry: 'marketing',
    title: '营销内容生产',
    description: '公众号 / 官网 / 邮件的多渠道内容生产',
    traditional: {
      duration: '1 周 / 主题',
      steps: [
        { role: '市场', action: '选题与大纲', duration: '1 天' },
        { role: '市场', action: '撰写长文', duration: '2 天' },
        { role: '设计', action: '配图与排版', duration: '1 天' },
        { role: '市场', action: '改稿与终审', duration: '1 天' },
        { role: '运营', action: '多渠道分发', duration: '半天' }
      ],
      output: '图文内容 + 多平台适配'
    },
    aiEnabled: {
      duration: '2 天 / 主题',
      steps: [
        { role: 'AI 助手', action: '生成选题建议（基于趋势与历史）', duration: '5 分钟' },
        { role: '市场', action: '确认大纲（AI 草拟）', duration: '1 小时' },
        { role: 'AI 写作', action: '生成多版本初稿', duration: '20 分钟' },
        { role: '市场', action: '审校与个性化', duration: '半天' },
        { role: 'AI 设计', action: '生成配图与排版', duration: '30 分钟' },
        { role: 'AI 分发', action: '一键多渠道适配', duration: '5 分钟' }
      ],
      output: '高质量图文 + 多平台素材 + 数据追踪'
    }
  },
  {
    id: 'wf-hr',
    industry: 'hr',
    title: '简历筛选与初面',
    description: '高并发招聘期的简历筛选与候选人沟通',
    traditional: {
      duration: '30 分钟 / 份',
      steps: [
        { role: 'HR', action: '下载与阅读简历', duration: '15 分钟' },
        { role: 'HR', action: '匹配度评估', duration: '10 分钟' },
        { role: 'HR', action: '电话沟通', duration: '5 分钟' }
      ],
      output: '简历评级 + 沟通反馈'
    },
    aiEnabled: {
      duration: '3 分钟 / 份',
      steps: [
        { role: 'AI Agent', action: '简历解析与 JD 匹配', duration: '30 秒' },
        { role: 'AI 助手', action: '生成评估报告与面试问题', duration: '1 分钟' },
        { role: 'AI 助手', action: '自动发起初轮沟通', duration: '1 分钟' },
        { role: 'HR', action: '决策是否进入复试', duration: '30 秒' }
      ],
      output: '匹配度评分 + 面试纪要 + 推荐决策'
    }
  },
  {
    id: 'wf-service',
    industry: 'service',
    title: '客户支持响应',
    description: '高频标准化问题的客服响应',
    traditional: {
      duration: '10 分钟 / 单',
      steps: [
        { role: '客服', action: '理解问题', duration: '2 分钟' },
        { role: '客服', action: '查询知识库', duration: '5 分钟' },
        { role: '客服', action: '撰写回复', duration: '3 分钟' }
      ],
      output: '标准答复'
    },
    aiEnabled: {
      duration: '< 1 分钟 / 单',
      steps: [
        { role: 'AI Agent', action: '理解问题与意图识别', duration: '5 秒' },
        { role: 'AI Agent', action: '检索知识库 + 草拟回复', duration: '10 秒' },
        { role: '客服', action: '快速确认 / 调整', duration: '30 秒' }
      ],
      output: '高质量答复 + 工单分类 + 知识沉淀'
    }
  },
  {
    id: 'wf-management',
    industry: 'management',
    title: '周报与会议',
    description: '团队周报汇总与会议纪要生成',
    traditional: {
      duration: '4 小时 / 周',
      steps: [
        { role: '每位成员', action: '撰写个人周报', duration: '30 分钟' },
        { role: '管理者', action: '汇总与对比', duration: '60 分钟' },
        { role: '团队', action: '周会沟通', duration: '60 分钟' },
        { role: '管理者', action: '会议纪要与待办', duration: '30 分钟' }
      ],
      output: '周报汇总 + 会议纪要 + 行动项'
    },
    aiEnabled: {
      duration: '1 小时 / 周',
      steps: [
        { role: 'AI 助手', action: '辅助生成结构化周报', duration: '10 分钟 / 人' },
        { role: 'AI 助手', action: '自动汇总与异常检测', duration: '5 分钟' },
        { role: '团队', action: '会议（AI 实时记录）', duration: '45 分钟' },
        { role: 'AI 助手', action: '生成纪要与待办推送', duration: '1 分钟' }
      ],
      output: '结构化周报 + 异常预警 + 自动纪要 + 行动追踪'
    }
  }
]
