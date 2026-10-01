/**
 * Home Config Mock
 * -----------------------------------------------------------------------------
 * 当 USE_BACKEND = false 时，前端各 Section 拉取的"后端配置"在这里找。
 * 字段名要和后端 home_config.key 一一对应（驼峰转 snake_case 在 server 端处理）。
 */

/**
 * 认知页 07 区 · 继续探索入口
 * ContinueExploreSection.vue 期望：ExploreEntry[]
 */
export interface ExploreEntry {
  label: string
  en: string
  desc: string
  href: string
}

/** 痛点区 · PainPointsSection.vue 期望 */
export interface PainPointItem {
  id: string
  title: string
  description: string
  icon: 'user' | 'workflow' | 'organization' | 'compass'
  href: string
}

/** 认知路径 · CognitionPathSection.vue 期望 */
export interface CognitionNode {
  id: string
  index: string       // "01" "02" ...
  title: string
  subtitle?: string
  description: string
  href: string
  tag?: string
}

/** 深度洞察 · DeepInsightSection.vue 期望 */
export interface DeepInsightCard {
  id: string
  tag: string
  title: string
  excerpt: string
  href: string
  readingTime?: number
  date?: string
  cover?: string
}

/** FORGE 判断 · ForgeJudgmentSection.vue 期望 */
export interface ForgeJudgment {
  id: string
  index: string   // "FORGE 01"
  title: string
  detail: string
  href: string
}

/** 方法论阶段 · MethodologySection.vue 期望 */
export interface MethodologyStage {
  id: string
  title: string
  desc: string
}

export const HOME_CONFIG_MOCK: Record<string, unknown> = {
  exploreEntries: [
    { label: '深度学习', en: 'Learn', desc: '从 AI 个体到组织变革的系统课程与训练营。', href: '/learn' },
    { label: '互动体验', en: 'Experience', desc: '个人 · 组织 · 工作流三条 AI 进化路径的沉浸式体验。', href: '/experience' },
    { label: '资源中心', en: 'Resources', desc: '工具、Prompt、Skill、报告、模板的可下载资产库。', href: '/resources' },
    { label: '解决方案', en: 'Solutions', desc: '面向不同行业与场景的 AI 组织变革落地路径。', href: '/solutions' }
  ] satisfies ExploreEntry[],

  painPoints: [
    { id: 'pp1', icon: 'user', title: '个人效率瓶颈', description: '员工使用 AI 仍停留在问问题阶段，无法形成持续产出。', href: '/solutions#individual' },
    { id: 'pp2', icon: 'workflow', title: '工作流未重设计', description: '把 AI 嵌入老流程只会更快地产出错东西。', href: '/solutions#workflow' },
    { id: 'pp3', icon: 'organization', title: '组织协同断裂', description: '部门间信息与目标不同步，AI 反而放大隔阂。', href: '/solutions#org' },
    { id: 'pp4', icon: 'compass', title: '战略定位模糊', description: '不清楚 AI 在公司里到底是工具还是协作主体。', href: '/understand' }
  ] satisfies PainPointItem[],

  cognitionPath: [
    { id: 'n1', index: '01', title: 'AI 在改变什么', subtitle: 'What AI is Changing', description: '重新理解 AI 时代的生产力、组织与竞争规则。', href: '/understand/insights', tag: 'INSIGHT' },
    { id: 'n2', index: '02', title: 'AI 如何重塑工作', subtitle: 'How AI Reshapes Work', description: '工作流重设计是 AI 落地的真正起点。', href: '/understand/trends', tag: 'TREND' },
    { id: 'n3', index: '03', title: '如何锻造 AI 组织', subtitle: 'How to Forge an AI Org', description: '从战略到 Workflow 再到个人能力的系统锻造。', href: '/learn', tag: 'FORGE' }
  ] satisfies CognitionNode[],

  deepInsights: [
    { id: 'di1', tag: '洞察', title: 'Agent 是新组织', excerpt: '当 Agent 数量与能力超过人类，组织设计的范式必须重写。', href: '/understand/insights?category=insight', readingTime: 8, date: '2025.09.20' },
    { id: 'di2', tag: '趋势', title: '从 Copilot 到 Co-founder', excerpt: 'AI 角色的三阶段演化路径与每一步的能力跃迁。', href: '/understand/insights?category=trend', readingTime: 6, date: '2025.09.05' },
    { id: 'di3', tag: '观点', title: '先重设计 Workflow，再谈 AI 战略', excerpt: '没有 Workflow 重设计的 AI 战略都是空想。', href: '/understand/insights?category=point_of_view', readingTime: 7, date: '2025.08.28' }
  ] satisfies DeepInsightCard[],

  forgeJudgments: [
    { id: 'fj1', index: 'FORGE 01', title: '不要把 AI 当工具', detail: 'AI 是新的协作主体，组织设计的前提必须更新。', href: '/understand/insights?type=pov' },
    { id: 'fj2', index: 'FORGE 02', title: 'Workflow 比 Prompt 更重要', detail: '真正的杠杆在 Workflow 而不是在 Prompt。', href: '/understand/insights?type=framework' },
    { id: 'fj3', index: 'FORGE 03', title: '组织容量决定 AI 速度', detail: '再先进的 AI 也跑不动断裂的组织协同。', href: '/understand/insights?type=insight' },
    { id: 'fj4', index: 'FORGE 04', title: '判断力才是稀缺品', detail: 'AI 时代最稀缺的是判断力而非信息量。', href: '/understand/insights?type=mental-model' }
  ] satisfies ForgeJudgment[],

  methodology: [
    { id: 'm1', title: 'AI 个体', desc: '先把每个员工变成 AI 个体，再谈组织。' },
    { id: 'm2', title: 'AI 协同', desc: '通过 Workflow 让 AI 与人高效协同。' },
    { id: 'm3', title: 'AI 组织', desc: '在协同基础上重设计组织结构与决策机制。' },
    { id: 'm4', title: 'AI 文化', desc: '形成与 AI 共事的文化与价值观。' },
    { id: 'm5', title: 'AI 战略', desc: '把 AI 内嵌为公司战略与商业模式的一部分。' }
  ] satisfies MethodologyStage[]
}