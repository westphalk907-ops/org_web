/**
 * 体验区场景库 - 前端 Mock
 * 当 USE_BACKEND = false 时使用
 */
import type { Scenario, OwnerContact, ScenarioCategory } from '@/api/server'

const now = '2025-09-20'

export const MOCK_SCENARIOS: Scenario[] = [
  // ───────── 个人 ─────────
  {
    id: 'sc-1', slug: 'weekly-report-ai',
    category: 'INDIVIDUAL',
    title: '周报写作 · 从 2 小时到 8 分钟',
    subtitle: '把零散的工作记录转成结构化周报',
    icon: '📝',
    problem: '每周五花 2 小时回忆本周做了什么、写周报、写下周计划。常常漏写、流水账、领导反馈"看不出价值"。',
    beforeSteps: [
      '翻聊天记录 / 日历回忆本周事项',
      '用 Word 凭印象罗列',
      '再调整措辞、加数据',
      '提交后被要求"再具体点"'
    ],
    afterSteps: [
      '本周所有 IM/邮件/会议记录自动汇总',
      'AI 按"成果 / 进度 / 卡点 / 下周"四段式生成初稿',
      '人工微调 5 分钟',
      '自动存为下周复盘素材'
    ],
    prompts: [
      '你是我的周报助理，请把以下原始记录改写成"成果 / 进度 / 卡点 / 下周"四段式周报，要求每条带数据或案例。\n\n原始记录：\n{records}'
    ],
    resourceSlugs: ['weekly-report-workflow', 'meeting-summarizer-skill'],
    ownerContactEnabled: true,
    tags: ['写作', '效率', '周报'],
    isActive: true, sortOrder: 1, publishedAt: now,
  },
  {
    id: 'sc-2', slug: 'meeting-minutes',
    category: 'INDIVIDUAL',
    title: '会议纪要 · 不再加班整理',
    subtitle: '录音 / 笔记 → 可执行的待办清单',
    icon: '🎙️',
    problem: '1 小时会议 + 1 小时整理纪要。会后还要在群里 @人确认待办,3 天后没人记得结论。',
    beforeSteps: [
      '会议中手动记要点',
      '会后整理 Word / Notion',
      '群里复制粘贴待办 @人',
      '3 天后没人记得结论'
    ],
    afterSteps: [
      '录音自动转写 + 角色识别',
      'AI 抽取「决议 / 待办 / 责任人 / 截止日」',
      '一键同步到 Notion / 飞书',
      '临近截止自动提醒'
    ],
    prompts: [
      '请把以下会议转写文本整理为结构化纪要，包含：1) 核心结论（不超过 3 条）2) 待办事项（角色 / 截止日）3) 遗留问题。\n\n转写文本：\n{transcript}'
    ],
    resourceSlugs: ['meeting-summarizer-skill'],
    ownerContactEnabled: true,
    tags: ['会议', '效率'],
    isActive: true, sortOrder: 2, publishedAt: now,
  },
  {
    id: 'sc-3', slug: 'reading-deep',
    category: 'INDIVIDUAL',
    title: '深度阅读 · 30 分钟读完一本行业书',
    subtitle: '用 AI 把 300 页书压成 30 分钟「值得读的」',
    icon: '📚',
    problem: '买了大量行业书,看不完;即使看完也记不住;想用书里的方法,找不到原话。',
    beforeSteps: [
      '买书 / 收藏文章',
      '抽空翻几页',
      '再没打开过',
      '想引用时找不到原话'
    ],
    afterSteps: [
      '上传 PDF / 链接,AI 生成结构化导图',
      '关键章节拆解成 5 段摘要',
      '生成「可引用观点」卡片',
      '形成个人知识库'
    ],
    prompts: [
      '你是行业研究助理，请把这本书拆解为：1) 核心命题 2) 三个关键论点（含证据）3) 与我工作（AI 组织变革）的关系 4) 一段可引用的金句。\n\n文本：\n{content}'
    ],
    resourceSlugs: [],
    ownerContactEnabled: true,
    tags: ['阅读', '学习'],
    isActive: true, sortOrder: 3, publishedAt: now,
  },

  // ───────── 团队 ─────────
  {
    id: 'sc-4', slug: 'team-knowledge-base',
    category: 'TEAM',
    title: '团队知识库 · 让新人 1 周上手',
    subtitle: '历史会议 / 文档 / 决策 → 可检索知识库',
    icon: '🧠',
    problem: '新人入职 3 个月还在问"这个流程谁定的";核心员工离职,带走大量隐性知识;同一问题被反复回答。',
    beforeSteps: [
      '老员工口头传授',
      '零散写在 Notion 角落',
      '找不到时群里 @人',
      '员工离职,知识消失'
    ],
    afterSteps: [
      '历史会议 / 文档自动入库',
      'AI 生成 FAQ + 决策日志',
      '新成员入职第一天可自助查询',
      '关键决策有据可循'
    ],
    prompts: [
      '请把以下团队历史讨论整理为「FAQ + 决策日志」两部分,每条 FAQ 要写明背景、结论、负责人。\n\n讨论：\n{discussions}'
    ],
    resourceSlugs: [],
    ownerContactEnabled: true,
    tags: ['知识管理', '新人'],
    isActive: true, sortOrder: 4, publishedAt: now,
  },

  // ───────── 销售 ─────────
  {
    id: 'sc-5', slug: 'sales-lead-scoring',
    category: 'SALES',
    title: '线索打分 · 销售只跟 A 类客户',
    subtitle: 'AI 自动评估线索质量,优先排序',
    icon: '🎯',
    problem: '销售每天收到 50+ 条线索,全靠经验判断优先级;优质线索被埋没;差线索耗费 70% 时间。',
    beforeSteps: [
      '销售逐条查看线索',
      '凭经验判断优先级',
      '电话过去对方无需求',
      '优质线索 3 天后才跟进'
    ],
    afterSteps: [
      'AI 综合客户画像 + 行为打分',
      '自动分 A/B/C/D 级',
      'A 级直接推送给销售 + 提醒',
      'D 级进入培育序列'
    ],
    prompts: [
      '你是 B2B 销售助理,请根据以下客户信息给出 1-100 分的线索质量评分,并说明 3 个关键打分依据。\n\n客户：\n{lead_info}'
    ],
    resourceSlugs: ['sales-workflow-prompt'],
    ownerContactEnabled: true,
    tags: ['销售', '线索'],
    isActive: true, sortOrder: 5, publishedAt: now,
  },
  {
    id: 'sc-6', slug: 'sales-proposal',
    category: 'SALES',
    title: '方案撰写 · 4 小时压到 40 分钟',
    subtitle: '客户背景 → 行业定制方案',
    icon: '📄',
    problem: '每个客户方案要写 4-8 小时;新人写得不专业;不同销售对同一客户方案不一致。',
    beforeSteps: [
      '销售查客户背景',
      '复制模板改',
      '反复修改措辞',
      '新人写的不专业'
    ],
    afterSteps: [
      'AI 抓取客户官网 / 财报 / 新闻',
      '自动匹配最相似的历史方案',
      '生成 80% 完整度的初稿',
      '销售只改客户专属部分'
    ],
    prompts: [
      '请基于以下客户背景,按「挑战 / 方案 / 价值 / 时间表 / 团队」5 段式生成定制方案初稿,字数 1500 字以内。\n\n客户：\n{client}'
    ],
    resourceSlugs: ['sales-team-ai-workflow'],
    ownerContactEnabled: true,
    tags: ['销售', '方案'],
    isActive: true, sortOrder: 6, publishedAt: now,
  },

  // ───────── 市场 ─────────
  {
    id: 'sc-7', slug: 'marketing-content-batch',
    category: 'MARKETING',
    title: '内容批量生产 · 1 篇变 10 篇',
    subtitle: '1 个核心观点,适配多平台',
    icon: '📢',
    problem: '市场 1 周要出 1 篇文章 + 5 条朋友圈 + 3 条小红书;团队 3 人常常加班;内容质量还参差不齐。',
    beforeSteps: [
      '1 个人写 1 篇深度文章',
      '另 1 人改朋友圈',
      '再 1 人改小红书',
      '一周只能发 1 套'
    ],
    afterSteps: [
      '1 篇核心文章输入',
      'AI 自动拆解为不同平台版本',
      '人工只做语气校对',
      '一周可发 3 套'
    ],
    prompts: [
      '请把以下核心文章改写为：1) 朋友圈（200 字,口语化）2) 小红书（400 字,带 emoji）3) 知乎（800 字,理性）。保留核心观点不变。\n\n原文：\n{article}'
    ],
    resourceSlugs: [],
    ownerContactEnabled: true,
    tags: ['市场', '内容'],
    isActive: true, sortOrder: 7, publishedAt: now,
  },
  {
    id: 'sc-8', slug: 'marketing-user-research',
    category: 'MARKETING',
    title: '用户调研 · 10 份访谈 1 天完成',
    subtitle: '录音 → 关键洞察 + 用户画像',
    icon: '🔍',
    problem: '10 份用户访谈要 1 周整理;不同分析员结论不一致;洞察报告常常"听完就忘"。',
    beforeSteps: [
      '访谈员逐字稿',
      '分析师人工编码',
      '整理成洞察 PPT',
      '结论主观、难以复用'
    ],
    afterSteps: [
      '录音自动转写',
      'AI 抽取关键洞察 + 矛盾点',
      '生成标准化画像卡片',
      '建立可检索的洞察库'
    ],
    prompts: [
      '请从以下用户访谈中提炼：1) 3 个核心痛点 2) 3 个未满足的需求 3) 1 个反直觉洞察。每点附原话引用。\n\n访谈：\n{interviews}'
    ],
    resourceSlugs: [],
    ownerContactEnabled: true,
    tags: ['市场', '调研'],
    isActive: true, sortOrder: 8, publishedAt: now,
  },

  // ───────── HR ─────────
  {
    id: 'sc-9', slug: 'hr-resume-screening',
    category: 'HR',
    title: '简历筛选 · 100 份 30 分钟筛完',
    subtitle: 'AI 初筛 + 人终面',
    icon: '📋',
    problem: 'HR 一天收 100+ 简历,80% 不匹配;好简历被埋没;招聘周期长达 6 周。',
    beforeSteps: [
      'HR 逐份打开简历',
      '凭关键词搜索',
      '主观判断匹配度',
      '好简历常常错过'
    ],
    afterSteps: [
      'AI 按 JD 自动打分',
      'Top 20 推送 HR',
      'HR 只看推荐简历',
      '招聘周期 -50%'
    ],
    prompts: [
      '请根据以下 JD 给每份简历打分（1-100）,并写出 1 句匹配理由 + 1 个潜在顾虑。\n\nJD：\n{jd}\n\n简历：\n{resume}'
    ],
    resourceSlugs: [],
    ownerContactEnabled: true,
    tags: ['HR', '招聘'],
    isActive: true, sortOrder: 9, publishedAt: now,
  },
  {
    id: 'sc-10', slug: 'hr-performance-review',
    category: 'HR',
    title: '绩效面谈 · AI 帮主管说对话',
    subtitle: '客观数据 + 结构化面谈',
    icon: '💬',
    problem: '主管绩效面谈准备 2 小时;评价主观;员工反馈"不知道哪里不行";面谈后没行动项。',
    beforeSteps: [
      '主管凭印象打分',
      '面谈无具体例子',
      '员工不服气',
      '面谈后没行动项'
    ],
    afterSteps: [
      'AI 汇总员工 1 季度关键事件',
      '生成优势 / 待改进清单',
      '主管面谈有据可依',
      '面谈后自动生成 OKR'
    ],
    prompts: [
      '请基于以下员工本季度关键事件,生成：1) 3 个具体优势（带证据）2) 2 个待改进（带建议行动）3) 下季度 3 个 OKR 建议。\n\n事件：\n{events}'
    ],
    resourceSlugs: ['hr-ai-insight'],
    ownerContactEnabled: true,
    tags: ['HR', '绩效'],
    isActive: true, sortOrder: 10, publishedAt: now,
  },

  // ───────── 客服 ─────────
  {
    id: 'sc-11', slug: 'service-first-response',
    category: 'SERVICE',
    title: '客服首响 · 30 秒内专业回复',
    subtitle: 'AI 客服 + 人工兜底',
    icon: '⚡',
    problem: '高峰时段客户等待 10 分钟;夜班无客服;80% 问题其实 FAQ。',
    beforeSteps: [
      '客户等待 5-10 分钟',
      '客服逐条回复重复问题',
      '夜班无人值守',
      'FAQ 没沉淀'
    ],
    afterSteps: [
      'AI 7×24 首响',
      '命中 FAQ 直接回复',
      '复杂问题转人工 + 上下文',
      'FAQ 自动沉淀'
    ],
    prompts: [
      '你是 SaaS 产品客服,请基于以下 FAQ 库回答客户问题。如果 FAQ 没覆盖,礼貌告知并建议转人工。\n\nFAQ：\n{faq}\n\n问题：\n{question}'
    ],
    resourceSlugs: [],
    ownerContactEnabled: true,
    tags: ['客服'],
    isActive: true, sortOrder: 11, publishedAt: now,
  },

  // ───────── 管理 ─────────
  {
    id: 'sc-12', slug: 'mgmt-decision-brief',
    category: 'MANAGEMENT',
    title: '决策简报 · 让 CEO 5 分钟拍板',
    subtitle: '议题背景 + 方案对比 + 建议',
    icon: '🧭',
    problem: 'CEO 一周 30+ 议题;团队写的简报 30 页;CEO 没时间看,凭直觉决策。',
    beforeSteps: [
      '团队写 30 页 PPT',
      'CEO 没时间看',
      '会议临时决策',
      '事后回顾依据不全'
    ],
    afterSteps: [
      '议题输入 AI',
      '自动生成 1 页决策简报',
      '含背景 / 3 方案 / 风险 / 建议',
      'CEO 5 分钟拍板'
    ],
    prompts: [
      '请把以下议题压缩为 1 页决策简报：1) 背景（不超过 100 字）2) 3 个候选方案（各 50 字 + 利弊）3) 推荐方案 + 理由 4) 风险与兜底。\n\n议题：\n{topic}'
    ],
    resourceSlugs: ['management-mechanism-redesign'],
    ownerContactEnabled: true,
    tags: ['管理', '决策'],
    isActive: true, sortOrder: 12, publishedAt: now,
  },
]

export const MOCK_OWNER_CONTACT: OwnerContact = {
  wechatId: 'FORGE_Owner',
  qrcodeUrl: '/qrcode/owner-wechat.png',
  intro: '加好友备注「体验场景」,我会一对一拉你进对应实战群,并送上场景相关的 Prompt / 模板。',
}

// ===== 分类元信息 =====
export const SCENARIO_CATEGORIES: Array<{ value: ScenarioCategory; label: string; icon: string; desc: string }> = [
  { value: 'INDIVIDUAL', label: '个人', icon: '👤', desc: '一人也能 AI 化的提效场景' },
  { value: 'TEAM', label: '团队', icon: '👥', desc: '协作 / 知识沉淀类场景' },
  { value: 'SALES', label: '销售', icon: '🤝', desc: '线索 / 方案 / 跟进' },
  { value: 'MARKETING', label: '市场', icon: '📣', desc: '内容 / 调研 / 投放' },
  { value: 'HR', label: 'HR', icon: '🪪', desc: '招聘 / 培训 / 绩效' },
  { value: 'SERVICE', label: '客服', icon: '💬', desc: '工单 / FAQ / 响应' },
  { value: 'MANAGEMENT', label: '管理', icon: '🧭', desc: '决策 / 复盘 / 简报' },
]
