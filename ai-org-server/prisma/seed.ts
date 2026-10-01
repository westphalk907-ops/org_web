/**
 * 数据库种子数据
 *
 * 把前端硬编码的 RESOURCES_FULL 一次性迁入数据库
 * 这样前端可以无缝切换到「读数据库」模式
 *
 * 用法：pnpm db:seed
 */
import { PrismaClient, ResourceType, FileType } from '@prisma/client'

// Prisma enum 在数据库里是大写，但 API/前端用小写
// 这里做一次映射
const RT = {
  insight: ResourceType.insight,
  research: ResourceType.research,
  framework: ResourceType.framework,
  playbook: ResourceType.playbook,
  case: ResourceType.case,
  checklist: ResourceType.checklist,
  tool: ResourceType.tool,
  prompt: ResourceType.prompt,
  skill: ResourceType.skill,
  workflow: ResourceType.workflow,
  whitepaper: ResourceType.whitepaper,
} as const
const FT = {
  pdf: FileType.pdf,
  md: FileType.md,
  link: FileType.link,
  notion: FileType.notion,
} as const

const prisma = new PrismaClient()

const SEED_RESOURCES = [
  // ───────────────── INSIGHT 洞察 ─────────────────
  {
    slug: 'ai-org-evolution-whitepaper',
    type: RT.insight,
    title: 'AI 组织进化白皮书',
    subtitle: 'AI Org Evolution Whitepaper',
    summary: '从工具使用到组织重塑，6 个阶段、12 个核心能力。',
    fileType: FT.md,
    fileName: 'AI组织进化白皮书.md',
    fileSize: '28 KB',
    pages: 28,
    author: '道可乾元研究院',
    tags: ['白皮书', '组织'],
  },
  {
    slug: 'human-ai-collaboration-mindset',
    type: RT.insight,
    title: '人机协作心智模型',
    subtitle: 'Human–AI Collaboration Mindset',
    summary: '一线管理者视角：当 AI 成为同事，管理者该做哪些改变。',
    fileType: FT.md,
    fileName: '人机协作心智模型.md',
    fileSize: '12 KB',
    author: '道可乾元研究院',
    tags: ['心智模型'],
  },
  {
    slug: 'frontline-ai-research',
    type: RT.research,
    title: '一线工作场景研究',
    subtitle: 'Frontline AI Use Research',
    summary: '30 家企业、120 个岗位的 AI 真实使用方式与收益分布。',
    fileType: FT.pdf,
    fileName: '一线工作场景研究.pdf',
    fileSize: '8.6 MB',
    pages: 64,
    tags: ['研究'],
  },
  {
    slug: '5-truths-of-ai-failure',
    type: RT.insight,
    title: 'AI 落地失败的 5 个真相',
    subtitle: '5 Truths of AI Failure',
    summary: '为什么 80% 的 AI 试点停在了第二个季度。',
    fileType: FT.md,
    fileName: 'AI落地失败的5个真相.md',
    fileSize: '9 KB',
    tags: ['洞察'],
  },

  // ───────────────── PROMPT 提示词 ─────────────────
  {
    slug: 'strategy-translator',
    type: RT.prompt,
    title: '战略翻译提示词',
    subtitle: 'Strategy Translator Prompt',
    summary: '把老板的一句话，翻译成可执行的产品策略。',
    fileType: FT.md,
    fileName: '战略翻译提示词.md',
    fileSize: '4 KB',
    tags: ['Prompt'],
  },
  {
    slug: 'customer-interview-outline',
    type: RT.prompt,
    title: '客户访谈提纲提示词',
    subtitle: 'Customer Interview Outline',
    summary: '30 秒生成一份高密度、不引导的客户访谈提纲。',
    fileType: FT.md,
    fileName: '客户访谈提纲提示词.md',
    fileSize: '5 KB',
    tags: ['Prompt'],
  },
  {
    slug: 'executive-briefing',
    type: RT.prompt,
    title: '汇报写稿提示词',
    subtitle: 'Executive Briefing Prompt',
    summary: '把零散产出，整理成 1 页可上会的管理层汇报。',
    fileType: FT.md,
    fileName: '汇报写稿提示词.md',
    fileSize: '4 KB',
    tags: ['Prompt'],
  },
  {
    slug: 'competitor-scan',
    type: RT.prompt,
    title: '竞品速读提示词',
    subtitle: 'Competitor Scan Prompt',
    summary: '丢一个域名，30 秒输出竞品能力地图与差异化点。',
    fileType: FT.md,
    fileName: '竞品速读提示词.md',
    fileSize: '3 KB',
    tags: ['Prompt'],
  },

  // ───────────────── SKILL 技能 ─────────────────
  {
    slug: 'customer-research-skill',
    type: RT.skill,
    title: '客户研究技能',
    subtitle: 'Customer Research Skill',
    summary: '把客户访谈内容自动整理为洞察、标签与画像。',
    fileType: FT.md,
    fileName: '客户研究技能.md',
    fileSize: '6 KB',
    tags: ['Skill'],
  },
  {
    slug: 'meeting-notes-skill',
    type: RT.skill,
    title: '会议纪要技能',
    subtitle: 'Meeting Notes Skill',
    summary: '把会议录音转成结构化纪要、行动项与决策记录。',
    fileType: FT.md,
    fileName: '会议纪要技能.md',
    fileSize: '6 KB',
    tags: ['Skill'],
  },
  {
    slug: 'weekly-report-skill',
    type: RT.skill,
    title: '周报生成技能',
    subtitle: 'Weekly Report Skill',
    summary: '把一周碎片产出，整理成可对外发布的周报。',
    fileType: FT.md,
    fileName: '周报生成技能.md',
    fileSize: '5 KB',
    tags: ['Skill'],
  },
  {
    slug: 'knowledge-base-skill',
    type: RT.skill,
    title: '知识库整理技能',
    subtitle: 'Knowledge Base Skill',
    summary: '把散落文档，整理为可检索、可复用的知识图谱。',
    fileType: FT.md,
    fileName: '知识库整理技能.md',
    fileSize: '7 KB',
    tags: ['Skill'],
  },

  // ───────────────── WORKFLOW 工作流 ─────────────────
  {
    slug: 'ai-market-research-workflow',
    type: RT.workflow,
    title: 'AI 市场研究工作流',
    subtitle: 'AI Market Research Workflow',
    summary: '从市场信息收集，到洞察生成，再到管理层报告。',
    fileType: FT.md,
    fileName: 'AI市场研究工作流.md',
    fileSize: '14 KB',
    pages: 12,
    tags: ['工作流', '旗舰'],
    isFeatured: true,
  },
  {
    slug: 'ai-customer-interview-workflow',
    type: RT.workflow,
    title: 'AI 客户访谈工作流',
    subtitle: 'AI Customer Interview Workflow',
    summary: '从访谈提纲，到录音转写，再到洞察分类。',
    fileType: FT.md,
    fileName: 'AI客户访谈工作流.md',
    fileSize: '12 KB',
    tags: ['工作流'],
  },
  {
    slug: 'ai-weekly-retrospective-workflow',
    type: RT.workflow,
    title: 'AI 周会复盘工作流',
    subtitle: 'AI Weekly Retrospective Workflow',
    summary: '把一周碎片产出，整理成可上会的复盘报告。',
    fileType: FT.md,
    fileName: 'AI周会复盘工作流.md',
    fileSize: '10 KB',
    tags: ['工作流'],
  },

  // ───────────────── PLAYBOOK / Checklist ─────────────────
  {
    slug: 'ai-90-day-action-guide',
    type: RT.playbook,
    title: 'AI 90天行动指南',
    subtitle: 'AI 90-Day Action Guide',
    summary: '把 AI 转型拆成 12 周、3 个阶段，落到每周产出。',
    fileType: FT.pdf,
    fileName: 'AI 90天行动指南.pdf',
    fileSize: '6.2 MB',
    pages: 36,
    tags: ['Playbook'],
    isFeatured: true,
  },
  {
    slug: 'ai-department-playbook',
    type: RT.playbook,
    title: 'AI 部门落地手册',
    subtitle: 'AI Department Playbook',
    summary: '一个部门从 0 到 1 启动 AI 的完整 SOP 与检查表。',
    fileType: FT.pdf,
    fileName: 'AI 部门落地手册.pdf',
    fileSize: '4.1 MB',
    pages: 24,
    tags: ['Playbook'],
  },
  {
    slug: 'manager-30-questions',
    type: RT.checklist,
    title: '管理者 30 问清单',
    subtitle: 'Manager 30 Questions Checklist',
    summary: '管理者推动 AI 落地前，先问完这 30 个问题。',
    fileType: FT.md,
    fileName: '管理者30问清单.md',
    fileSize: '5 KB',
    tags: ['清单'],
  },

  // ───────────────── FEATURED ─────────────────
  {
    slug: 'ai-organization-maturity-report-2026',
    type: RT.whitepaper,
    title: '2026 企业 AI 组织成熟度报告',
    subtitle: 'AI Organization Maturity Report 2026',
    summary: '基于 500+ 企业调研，揭示 AI 组织进化的 5 个阶段与关键差距。',
    fileType: FT.pdf,
    fileName: '2026企业AI组织成熟度报告.pdf',
    fileSize: '13.4 MB',
    pages: 85,
    tags: ['旗舰', '白皮书'],
    isFeatured: true,
    sortOrder: 1,
  },
  {
    slug: 'ai-individual-map',
    type: RT.framework,
    title: 'AI 个体能力地图',
    subtitle: 'AI Individual Capability Map',
    summary: '从感知者到架构师，五阶段个人 AI 能力进化框架。',
    fileType: FT.link,
    fileName: '',
    pages: 12,
    tags: ['框架'],
    isFeatured: true,
    sortOrder: 2,
  },
  {
    slug: 'ai-transformation-90-days',
    type: RT.playbook,
    title: '企业 AI 转型 90 天行动指南',
    subtitle: 'AI Transformation 90 Days Playbook',
    summary: '90 天落地路线图，覆盖战略、培训、场景、组织四维度。',
    fileType: FT.pdf,
    fileName: '企业AI转型90天行动指南.pdf',
    fileSize: '5.6 MB',
    pages: 32,
    tags: ['Playbook'],
    isFeatured: true,
    sortOrder: 3,
  },
  {
    slug: 'ai-readiness-checklist',
    type: RT.checklist,
    title: 'AI 场景与组织准备度 Checklist',
    subtitle: 'AI Readiness Checklist',
    summary: '60 个判断题，5 分钟评估你的企业 AI 就绪度。',
    fileType: FT.md,
    fileName: 'AI场景与组织准备度Checklist.md',
    fileSize: '7 KB',
    tags: ['清单'],
    isFeatured: true,
    sortOrder: 4,
  },
]

async function main() {
  console.log('🌱 开始种子数据...')

  // 1. 管理员账号
  const bcryptModule = await import('bcryptjs')
  const bcrypt = (bcryptModule as any).default ?? bcryptModule
  const adminUser = process.env.ADMIN_USERNAME || 'admin'
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123456'
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ai-org.local'

  const existing = await prisma.admin.findUnique({ where: { username: adminUser } })
  if (!existing) {
    const passwordHash = await bcrypt.hash(adminPass, 10)
    await prisma.admin.create({
      data: {
        username: adminUser,
        passwordHash,
        email: adminEmail,
        role: 'super_admin',
      },
    })
    console.log(`  ✅ 创建管理员: ${adminUser} / ${adminPass}`)
  } else {
    console.log(`  ⏭️  管理员已存在: ${adminUser}`)
  }

  // 2. Resources 种子
  let created = 0
  let updated = 0
  for (const item of SEED_RESOURCES) {
    const existed = await prisma.resource.findUnique({ where: { slug: item.slug } })
    if (existed) {
      await prisma.resource.update({
        where: { id: existed.id },
        data: { ...item },
      })
      updated++
    } else {
      await prisma.resource.create({ data: item as any })
      created++
    }
  }
  console.log(`  ✅ Resources: ${created} 新建 / ${updated} 更新 / 共 ${SEED_RESOURCES.length} 条`)

  // 3. 公众号文章（Content / category = TREND/POINT_OF_VIEW/FIELD_NOTE）
  const SEED_ARTICLES = [
    {
      slug: 'wxa-agent-into-enterprise',
      category: 'trend' as const,
      title: 'Agent 正在进入企业，但真正的变化还没开始',
      excerpt: '2026 年是 Agent 进入企业的元年，但真正的组织变革还没开始。本篇梳理三个判断。',
      content: '# Agent 正在进入企业\n\n2026 年是 Agent 进入企业的元年。\n\n## 三个判断\n\n1. **从工具到流程**：Agent 不再是单点工具，而是嵌入到流程中的协作节点。\n2. **从效率到结构**：组织结构会因为 Agent 重新分配任务、决策权与责任归属。\n3. **从个人到组织**：单点效率提升是表象，组织重塑才是本质。\n\n## 我们看到了什么\n\n在 30+ 家头部企业的落地中，Agent 的真正价值不在于"更快"，而在于"更系统"。',
      author: '道可乾元研究院',
      publishedAt: new Date('2026-09-28'),
      index: '01',
      nodeSlug: 'ai-changing-what',
      sourcePlatform: 'WECHAT',
      isPublished: true,
      tags: ['Agent', '趋势'],
    },
    {
      slug: 'wxa-ai-not-transformation',
      category: 'point_of_view' as const,
      title: '为什么"人人都会用 AI"依然不是 AI 转型？',
      excerpt: '工具普及 ≠ 组织变革。当每个人都在用 AI，企业反而更需要重新设计工作方式。',
      content: '# 为什么"人人都会用 AI"依然不是 AI 转型\n\n工具普及 ≠ 组织变革。\n\n## 三层差异\n\n- **能力**：能不能用\n- **工作**：会不会用进工作\n- **组织**：会不会围绕 AI 重塑流程、KPI、责任划分\n\n只有第三层做到，才叫 AI 转型。',
      author: '道可乾元研究院',
      publishedAt: new Date('2026-09-26'),
      index: '02',
      nodeSlug: 'ai-changing-organization',
      sourcePlatform: 'WECHAT',
      isPublished: true,
      tags: ['观点', '组织变革'],
    },
    {
      slug: 'wxa-sales-team-ai-workflow',
      category: 'field_note' as const,
      title: '一个销售团队如何把 AI 从工具变成工作流？',
      excerpt: '真实案例：从工具堆叠，到端到端 AI 工作流。一支 50 人销售团队的 90 天。',
      content: '# 销售团队的 AI 工作流化\n\n## 起点\n\n50 人销售团队，AI 工具 8 个，每人每天切 12 次应用。\n\n## 我们做了什么\n\n1. **场景梳理**：识别出 3 条核心销售流程\n2. **工作流设计**：每条流程用 AI Work Lab 重构\n3. **培训 + 落地**：3 周培训 + 6 周陪同\n\n## 结果\n\n- 新人成单周期：6 个月 → 3 个月\n- 单线索转化率：+45%\n- 月签单：×2',
      author: '道可乾元研究院',
      publishedAt: new Date('2026-09-24'),
      index: '03',
      nodeSlug: 'ai-changing-work',
      sourcePlatform: 'WECHAT',
      isPublished: true,
      tags: ['实践', '工作流'],
    },
    {
      slug: 'wxa-multi-agent-collaboration',
      category: 'trend' as const,
      title: 'AI Agent 的下一步：从单 Agent 到多 Agent 协作',
      excerpt: '单 Agent 已经成熟，2027 年的看点是多 Agent 协作。三个关键能力。',
      content: '# 多 Agent 协作的三个关键能力\n\n1. **任务分解**：把复杂任务拆成可并行子任务\n2. **状态共享**：Agent 之间共享上下文与中间产物\n3. **冲突解决**：多 Agent 决策冲突时的仲裁机制',
      author: '道可乾元研究院',
      publishedAt: new Date('2026-09-21'),
      index: '04',
      nodeSlug: 'ai-changing-what',
      sourcePlatform: 'WECHAT',
      isPublished: true,
      tags: ['Agent', '趋势'],
    },
    {
      slug: 'wxa-ai-maturity-2026',
      category: 'point_of_view' as const,
      title: '企业 AI 成熟度报告：我们在哪儿？',
      excerpt: '500+ 企业调研，揭示 AI 组织进化的 5 个阶段。多数企业停在 L2-L3。',
      content: '# 企业 AI 成熟度 5 阶段\n\n- **L1 工具试用**：个人零散使用\n- **L2 流程嵌入**：AI 进入部分流程\n- **L3 团队协同**：跨角色协同使用\n- **L4 组织重塑**：组织结构因 AI 改变\n- **L5 战略核心**：AI 成为战略级能力\n\n500+ 调研：超过 70% 停在 L2-L3。',
      author: '道可乾元研究院',
      publishedAt: new Date('2026-09-19'),
      index: '05',
      nodeSlug: 'ai-changing-organization',
      sourcePlatform: 'WECHAT',
      isPublished: true,
      tags: ['成熟度', '调研'],
    },
  ]

  let aCreated = 0, aUpdated = 0
  for (const art of SEED_ARTICLES) {
    // schema 要求 contentHtml 非空；用 content 同值兜底（前端详情页可再覆盖）
    const data = { ...art, contentHtml: art.content, navSection: 'understand' as const }
    const existed = await prisma.content.findUnique({ where: { slug: art.slug } })
    if (existed) {
      await prisma.content.update({ where: { id: existed.id }, data })
      aUpdated++
    } else {
      await prisma.content.create({ data })
      aCreated++
    }
  }
  console.log(`  ✅ Articles (understand): ${aCreated} 新建 / ${aUpdated} 更新 / 共 ${SEED_ARTICLES.length} 条`)

  // 3.5 Learn 分类文章（framework / playbook / whitepaper）
  // 让 /learn 列表页有内容可读，验证前后端打通
  const SEED_LEARN = [
    // ── framework 框架 ──
    {
      slug: 'ai-individual-capability-map',
      category: 'framework' as const,
      title: 'AI 个体能力地图',
      excerpt: '从感知者到架构师，五阶段个人 AI 能力进化框架。覆盖感知、尝试、协作、设计、架构。',
      content: '# AI 个体能力地图\n\n## 五个阶段\n\n1. **感知者**：知道 AI 能做什么，但未真正使用\n2. **尝试者**：每天用 AI 解决 3+ 任务\n3. **协作者**：把 AI 当作工作伙伴，开始优化工作流\n4. **设计者**：能设计 AI 增强的工作方式\n5. **架构师**：在组织层面设计 AI 战略\n\n## 关键判断\n\n工具普及 ≠ 能力升级。真正的能力升级，看的是你**重构了多少条工作流**。',
      author: '道可乾元研究院',
      publishedAt: new Date('2026-09-30'),
      nodeSlug: 'ai-changing-work',
      sourcePlatform: 'INTERNAL',
      isPublished: true,
      tags: ['框架', '个体能力'],
    },
    {
      slug: 'ai-organization-maturity-framework',
      category: 'framework' as const,
      title: 'AI 组织成熟度框架',
      excerpt: '5 阶段 × 7 维度，刻画企业 AI 转型的真实位置。每个维度给出一组判断标准。',
      content: '# AI 组织成熟度框架\n\n## 五个阶段\n\n- L1 工具试用\n- L2 流程嵌入\n- L3 团队协同\n- L4 组织重塑\n- L5 战略核心\n\n## 七个维度\n\n战略 / 人才 / 工作流 / 技术 / 数据 / 治理 / 组织\n\n500+ 调研显示，超过 70% 的企业停在 L2-L3。',
      author: '道可乾元研究院',
      publishedAt: new Date('2026-09-29'),
      nodeSlug: 'ai-changing-organization',
      sourcePlatform: 'INTERNAL',
      isPublished: true,
      tags: ['框架', '组织成熟度'],
    },
    {
      slug: 'ai-workflow-canvas',
      category: 'framework' as const,
      title: 'AI 工作流画布',
      excerpt: '把 AI 工作流设计拆成 9 个模块，让任何人都能画出可落地的 AI 流程。',
      content: '# AI 工作流画布\n\n## 9 个模块\n\n1. 触发场景\n2. 输入信息\n3. AI 能力点\n4. 角色协作\n5. 中间产物\n7. 质量校验\n8. 异常处理\n9. 效果衡量\n\n## 核心原则\n\n不是把 AI 塞进流程，而是先画流程，再找 AI 增益点。',
      author: '道可乾元研究院',
      publishedAt: new Date('2026-09-28'),
      nodeSlug: 'ai-changing-work',
      sourcePlatform: 'INTERNAL',
      isPublished: true,
      tags: ['框架', '工作流'],
    },

    // ── playbook 行动手册 ──
    {
      slug: 'ai-90-day-action-guide',
      category: 'playbook' as const,
      title: 'AI 90 天行动指南',
      excerpt: '把 AI 转型拆成 12 周、3 个阶段，落到每周产出。第 1 周做什么、第 12 周交付什么。',
      content: '# AI 90 天行动指南\n\n## 三阶段\n\n- **第 1-4 周 摸底**：调研、识别场景、确定试点\n- **第 5-8 周 试点**：跑通 3 条核心场景，建立度量\n- **第 9-12 周 推广**：跨部门复用，建立组织机制\n\n## 每周产出\n\n每周一会、每周产出、每周复盘。',
      author: '道可乾元研究院',
      publishedAt: new Date('2026-09-27'),
      nodeSlug: 'ai-changing-organization',
      sourcePlatform: 'INTERNAL',
      isPublished: true,
      tags: ['Playbook', '转型'],
    },
    {
      slug: 'ai-department-playbook',
      category: 'playbook' as const,
      title: 'AI 部门落地手册',
      excerpt: '一个部门从 0 到 1 启动 AI 的完整 SOP 与检查表。每一步给到具体动作、责任人、产出物。',
      content: '# AI 部门落地手册\n\n## 五个步骤\n\n1. 部门 AI 现状盘点\n2. Top 3 场景识别\n3. 试点项目立项\n4. 培训 + 落地\n5. 效果评估 + 推广',
      author: '道可乾元研究院',
      publishedAt: new Date('2026-09-25'),
      nodeSlug: 'ai-changing-work',
      sourcePlatform: 'INTERNAL',
      isPublished: true,
      tags: ['Playbook', '部门'],
    },
    {
      slug: 'sales-ai-30-day-playbook',
      category: 'playbook' as const,
      title: '销售团队 30 天 AI 实战手册',
      excerpt: '一支销售团队 30 天从工具堆叠到端到端 AI 工作流。每天 1 个动作，第 30 天验收。',
      content: '# 销售团队 30 天 AI 实战\n\n## 第 1 周\n盘点工具 / 识别场景 / 选择 3 条核心销售流程\n\n## 第 2 周\n设计 AI 工作流原型 / 与一线对齐\n\n## 第 3 周\n培训 + 上线 / 跟踪指标\n\n## 第 4 周\n复盘 / 优化 / 扩展到更多场景',
      author: '道可乾元研究院',
      publishedAt: new Date('2026-09-23'),
      nodeSlug: 'ai-changing-work',
      sourcePlatform: 'INTERNAL',
      isPublished: true,
      tags: ['Playbook', '销售'],
    },

    // ── whitepaper 白皮书 ──
    {
      slug: 'ai-org-evolution-whitepaper',
      category: 'whitepaper' as const,
      title: 'AI 组织进化白皮书 2026',
      excerpt: '从工具使用到组织重塑，6 个阶段、12 个核心能力。基于 500+ 企业调研。',
      content: '# AI 组织进化白皮书\n\n## 6 个阶段\n\n1. 工具试用\n2. 流程嵌入\n3. 团队协同\n4. 组织重塑\n5. 战略核心\n6. 行业领先\n\n## 12 个核心能力\n\n覆盖战略、人才、流程、技术、数据、治理、组织七大维度。',
      author: '道可乾元研究院',
      publishedAt: new Date('2026-09-30'),
      nodeSlug: 'ai-changing-organization',
      sourcePlatform: 'INTERNAL',
      isPublished: true,
      tags: ['白皮书', '组织进化'],
    },
    {
      slug: 'enterprise-ai-readiness-whitepaper',
      category: 'whitepaper' as const,
      title: '企业 AI 就绪度白皮书',
      excerpt: '60 个判断题 × 7 个维度，5 分钟评估你的企业 AI 就绪度。本白皮书给出解读与下一步建议。',
      content: '# 企业 AI 就绪度白皮书\n\n## 七个维度\n\n战略 / 人才 / 工作流 / 技术 / 数据 / 治理 / 组织\n\n## 五个阶段\n\nL1-L5，每阶段给出明确的判断标准与下一步动作。',
      author: '道可乾元研究院',
      publishedAt: new Date('2026-09-28'),
      nodeSlug: 'ai-changing-organization',
      sourcePlatform: 'INTERNAL',
      isPublished: true,
      tags: ['白皮书', '就绪度'],
    },
    {
      slug: 'agent-enterprise-whitepaper',
      category: 'whitepaper' as const,
      title: 'Agent 进入企业白皮书',
      excerpt: '2026 Agent 元年，从单 Agent 到多 Agent 协作，本白皮书给出企业级落地路径。',
      content: '# Agent 进入企业\n\n## 三个判断\n\n1. 从工具到流程\n2. 从效率到结构\n3. 从个人到组织\n\n## 落地路径\n\n试点 → 流程化 → 团队化 → 组织化。',
      author: '道可乾元研究院',
      publishedAt: new Date('2026-09-26'),
      nodeSlug: 'ai-changing-what',
      sourcePlatform: 'INTERNAL',
      isPublished: true,
      tags: ['白皮书', 'Agent'],
    },
  ]

  let lCreated = 0, lUpdated = 0
  for (const art of SEED_LEARN) {
    const data = { ...art, contentHtml: art.content, navSection: 'learn' as const }
    const existed = await prisma.content.findUnique({ where: { slug: art.slug } })
    if (existed) {
      await prisma.content.update({ where: { id: existed.id }, data })
      lUpdated++
    } else {
      await prisma.content.create({ data })
      lCreated++
    }
  }
  console.log(`  ✅ Learn Articles: ${lCreated} 新建 / ${lUpdated} 更新 / 共 ${SEED_LEARN.length} 条`)

  // 3.6 Experience 栏目文章（深度评测 / 体验报告）
  // 让 /experience 索引页顶部有内容可读
  const SEED_EXPERIENCE = [
    {
      slug: 'experience-ai-org-readiness-deep',
      category: 'insight' as const,
      title: '深度评测：一家千人制造企业的 AI 就绪度',
      excerpt: '我们陪跑了一家千人制造企业的 AI 转型，记录真实位置、卡点、破局。',
      content: '# 千人制造企业 AI 就绪度评测\n\n## 真实位置\n\nL2 流程嵌入，部分场景跑通，整体还停在工具试用。\n\n## 卡点\n\n- 流程未拆解到 AI 可嵌入粒度\n- 一线管理者对 AI 工作流缺乏信心\n- 数据治理缺位\n\n## 破局动作\n\n详见正文。',
      author: '道可乾元研究院',
      publishedAt: new Date('2026-09-30'),
      sourcePlatform: 'INTERNAL',
      isPublished: true,
      tags: ['评测', '制造'],
    },
    {
      slug: 'experience-agent-90-day-log',
      category: 'field_note' as const,
      title: 'Agent 落地 90 天记录',
      excerpt: '把 Agent 从 demo 推到生产环境，90 天里我们踩了 6 个坑、解决了 4 个核心问题。',
      content: '# Agent 落地 90 天记录\n\n## 第 1-30 天\n\n单 Agent demo，验证业务价值。\n\n## 第 31-60 天\n\n多 Agent 协作，处理状态共享与冲突。\n\n## 第 61-90 天\n\n与企业系统打通，进入生产环境。\n\n## 6 个坑\n\n1. Tool 协议不稳定\n2. Context Window 不够\n3. ...',
      author: '道可乾元研究院',
      publishedAt: new Date('2026-09-26'),
      sourcePlatform: 'INTERNAL',
      isPublished: true,
      tags: ['Agent', '实践'],
    },
    {
      slug: 'experience-individual-deep-shift',
      category: 'trend' as const,
      title: '个人 AI 体验：从感知到架构的五个真相',
      excerpt: '我们跟踪了 50 位用户 6 个月，记录他们在个人 AI 体验上的真实跃迁。',
      content: '# 个人 AI 体验的五个真相\n\n## 真相 1\n\n工具普及 ≠ 能力升级\n\n## 真相 2\n\n真正跃迁发生在重构工作流那一刻\n\n## 真相 3\n\n...',
      author: '道可乾元研究院',
      publishedAt: new Date('2026-09-22'),
      sourcePlatform: 'INTERNAL',
      isPublished: true,
      tags: ['个人', '体验'],
    },
  ]

  let eCreated = 0, eUpdated = 0
  for (const art of SEED_EXPERIENCE) {
    const data = { ...art, contentHtml: art.content, navSection: 'experience' as const }
    const existed = await prisma.content.findUnique({ where: { slug: art.slug } })
    if (existed) {
      await prisma.content.update({ where: { id: existed.id }, data })
      eUpdated++
    } else {
      await prisma.content.create({ data })
      eCreated++
    }
  }
  console.log(`  ✅ Experience Articles: ${eCreated} 新建 / ${eUpdated} 更新 / 共 ${SEED_EXPERIENCE.length} 条`)

  // 4. 案例 Case 种子
  const SEED_CASES = [
    {
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
        { label: '合规事件', value: '0' },
      ],
      testimonial: {
        quote: '我们不是引入了一个工具，而是重建了一套 AI 时代的工作方式。',
        author: 'CDO',
        position: '某制造集团',
      },
      isPublished: true,
      sortOrder: 1,
    },
    {
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
        { label: '月签单', value: '×2' },
      ],
      isPublished: true,
      sortOrder: 2,
    },
    {
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
        { label: '新人融入', value: '-40%' },
      ],
      isPublished: true,
      sortOrder: 3,
    },
  ]

  let cCreated = 0, cUpdated = 0
  for (const c of SEED_CASES) {
    const existed = await prisma.case.findUnique({ where: { slug: c.slug } })
    if (existed) {
      await prisma.case.update({ where: { id: existed.id }, data: c })
      cUpdated++
    } else {
      await prisma.case.create({ data: c })
      cCreated++
    }
  }
  console.log(`  ✅ Cases: ${cCreated} 新建 / ${cUpdated} 更新 / 共 ${SEED_CASES.length} 条`)

  // 5. HomeConfig 种子（首页运营文案 + /understand 页面 sections）
  const SEED_HOME_CONFIG: Record<string, unknown> = {
    painPoints: [
      { id: 'pain-individual', title: '员工会用 AI，但不会用进工作', description: 'AI 个体能力不足或碎片化，员工停留在"玩具级"使用。', icon: 'user', href: '/experience/individual-map' },
      { id: 'pain-workflow', title: 'AI 工具很多，但工作方式没变', description: '缺少 Workflow 设计，工具与流程脱节。', icon: 'workflow', href: '/experience/workflow-demo' },
      { id: 'pain-organization', title: 'AI 项目很多，但无法规模化', description: '缺少组织机制与路线图，无法从试点走向规模化。', icon: 'organization', href: '/experience/organization-map' },
      { id: 'pain-start', title: '不知道企业 AI 从哪里开始', description: '缺少成熟度判断与可执行的下一步。', icon: 'compass', href: '/experience/assessment' },
    ],
    methodology: [
      { id: 'm1', title: 'AI 个体', desc: '个体能力是起点' },
      { id: 'm2', title: 'AI 工作', desc: '工作场景是练兵场' },
      { id: 'm3', title: 'AI 团队', desc: '团队协同放大价值' },
      { id: 'm4', title: 'AI 流程', desc: '流程嵌入沉淀能力' },
      { id: 'm5', title: 'AI 组织', desc: '组织设计决定规模化' },
    ],

    // /understand 页面 sections
    cognitionPath: [
      {
        slug: 'ai-changing-what',
        label: 'AI 正在改变什么',
        en: 'AI Changing What',
        desc: '趋势 / 技术 / Agent / AI Evolution',
        topics: [
          { name: '技术演进', count: 12 },
          { name: 'Agent 形态', count: 8 },
          { name: '模型能力', count: 6 },
          { name: '产业趋势', count: 14 },
        ],
        articles: 40,
        frameworks: 3,
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
          { name: '流程重构', count: 21 },
        ],
        articles: 52,
        frameworks: 5,
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
          { name: '治理与战略', count: 7 },
        ],
        articles: 42,
        frameworks: 4,
      },
    ],
    forgeJudgments: [
      {
        code: 'P', label: '核心观点', en: 'Point of View',
        desc: 'FORGE 对 AI 组织变革最重要的判断与立场',
        href: '/understand/insights?type=pov',
        highlights: [
          'AI 不会直接替代组织，但会重新定义工作',
          '人人都会用 AI，依然不是 AI 转型',
          '工具变革 ≠ 流程变革 ≠ 组织变革',
        ],
      },
      {
        code: 'F', label: '框架模型', en: 'Framework',
        desc: 'FORGE 自有的方法论资产，沉淀为可复用的心智模型',
        href: '/understand/insights?type=framework',
        highlights: ['AI Organization Map', 'AI Maturity Model', 'AI Individual Map', 'AI Workflow Canvas'],
      },
      {
        code: 'I', label: '深度洞察', en: 'Insight',
        desc: '比公众号文章更深的研究、专题、数据分析',
        href: '/understand/insights?type=insight',
        highlights: ['企业 AI Adoption 的五个阶段', 'Agent 对企业组织意味着什么', 'AI 转型的隐性成本'],
      },
      {
        code: 'M', label: '心智模型', en: 'Mental Model',
        desc: '我们看 AI 组织变革的方式，决定了我们如何行动',
        href: '/understand/insights?type=mental-model',
        highlights: ['从工具到系统', '从效率到结构', '从个人到组织'],
      },
    ],
    deepInsights: [
      {
        code: 'R-01', category: 'RESEARCH',
        title: '企业 AI Adoption 的五个阶段：我们在哪儿？',
        summary: '从工具试用到组织重塑，AI 转型是一条非线性的进化路径。本研究基于 60+ 家中国企业的实地观察。',
        readTime: '12 min', href: '/understand/research', accent: 'gold',
      },
      {
        code: 'I-07', category: 'INSIGHT',
        title: 'Agent 对企业组织意味着什么',
        summary: 'Agent 不只是更聪明的工具，它会重新分配任务、决策权与责任归属。',
        readTime: '8 min', href: '/understand/insights', accent: 'ember',
      },
      {
        code: 'D-03', category: 'DEEP DIVE',
        title: '从 Workflow Demo 到生产：那些被低估的失败',
        summary: '为什么 80% 的 AI Workflow 在生产环节会失败？我们梳理了 23 个真实案例的共同结构。',
        readTime: '15 min', href: '/understand/research', accent: 'jade',
      },
    ],
    exploreEntries: [
      { label: '学习', en: 'Learn', desc: '从框架、白皮书到行动手册，把认知变成系统知识', href: '/learn', glyph: 'L' },
      { label: '体验', en: 'Experience', desc: 'AI 个体地图 / 组织地图 / 成熟度测评 / 工作流演示', href: '/experience', glyph: 'E' },
      { label: '资源', en: 'Resources', desc: '模板、清单、案例集——可下载、可立即使用', href: '/resources', glyph: 'R' },
      { label: '解决方案', en: 'Solutions', desc: 'AI Academy / Work Lab / 组织变革咨询', href: '/act', glyph: 'S' },
    ],
  }

  for (const [key, payload] of Object.entries(SEED_HOME_CONFIG)) {
    await prisma.homeConfig.upsert({
      where: { key },
      update: { payload: payload as any },
      create: { key, payload: payload as any },
    })
  }
  console.log(`  ✅ HomeConfig: ${Object.keys(SEED_HOME_CONFIG).length} 个配置已写入`)

  // 6. ExperienceMap（3 张体验地图）
  const SEED_MAPS = [
    {
      kind: 'INDIVIDUAL' as const,
      slug: 'individual-map',
      title: 'AI Individual Map',
      subtitle: '个体 AI 能力进化',
      heroDesc: '一个人如何成为 AI 时代的高效工作者？',
      sortOrder: 1,
      stages: [
        {
          stage: '01',
          title: '感知者',
          description: '知道 AI 能做什么，但仍停留在"听说"阶段，未真正使用。',
          characteristics: ['知道 AI 的存在', '偶尔试用 1-2 个工具', '对 AI 的能力边界缺乏判断', '依赖他人解读 AI 趋势'],
          painPoints: ['缺乏主动使用的动机', '不知道哪个工具适合自己', '担心学不会或被取代'],
          actions: ['每周用 1 次 AI 工具', '关注 5 个 AI 公众号', '参加一次 AI 主题分享'],
          sortOrder: 1,
        },
        {
          stage: '02',
          title: '尝试者',
          description: '开始主动使用 AI 工具解决简单问题，但仍停留在单点工具。',
          characteristics: ['每天用 AI 解决 3+ 任务', '形成了几个固定 Prompt', '开始优化提示词', '对比不同工具的差异'],
          painPoints: ['效率提升不显著', '提示词效果不稳定', '难以处理复杂任务'],
          actions: ['建立个人 Prompt 库', '学习结构化提示词', '在 1-2 个核心场景深度使用'],
          sortOrder: 2,
        },
        {
          stage: '03',
          title: '协作者',
          description: '把 AI 当作工作伙伴，开始用 AI 优化工作流程。',
          characteristics: ['每周节省 5+ 小时', '用 AI 重构 1-2 条工作流', '与团队分享 AI 使用经验', '能组合多个 AI 工具'],
          painPoints: ['如何让团队一起用', '成果难以量化', '担心错误率'],
          actions: ['沉淀 3 条标准工作流', '指导同事使用 AI', '跟踪效率指标'],
          sortOrder: 3,
        },
        {
          stage: '04',
          title: '设计者',
          description: '能从系统视角设计 AI 增强的工作方式，并影响他人。',
          characteristics: ['设计完整的 AI 工作流', '为团队提供培训', '建立 AI 使用规范', '持续迭代工作流'],
          painPoints: ['如何规模化推广', '如何衡量 ROI', '团队接受度不一'],
          actions: ['设计部门级 AI 方案', '建立培训机制', '推动流程标准化'],
          sortOrder: 4,
        },
        {
          stage: '05',
          title: '架构师',
          description: '能在组织层面设计 AI 战略，影响业务和组织决策。',
          characteristics: ['参与公司 AI 战略', '设计组织级 AI 体系', '培养 AI 人才梯队', '推动业务变革'],
          painPoints: ['需要跨部门协同', '需要高管支持', '需要长期投入'],
          actions: ['参与战略制定', '设计组织级方案', '推动组织变革'],
          sortOrder: 5,
        },
      ],
    },
    {
      kind: 'ORGANIZATION' as const,
      slug: 'organization-map',
      title: 'AI Organization Map',
      subtitle: '5 阶段 × 7 维度',
      heroDesc: '企业如何从 AI Adoption 走向 AI Organization。',
      sortOrder: 2,
      stages: [
        {
          stage: '01',
          title: '工具试用',
          description: '个人零散使用 AI 工具，无组织级规划。',
          characteristics: ['员工自发使用', '工具分散', '无统一标准', '效果不可见'],
          painPoints: ['数据安全风险', '效果难以衡量', '无法形成组织能力'],
          actions: ['调研员工使用情况', '识别高价值场景', '准备试点项目'],
          sortOrder: 1,
        },
        {
          stage: '02',
          title: '流程嵌入',
          description: 'AI 进入部分核心流程，但仍是局部优化。',
          characteristics: ['AI 嵌入 1-3 条流程', '有项目团队', '开始收集数据', '管理层初步认可'],
          painPoints: ['跨部门协同不足', '效果依赖个人', '难以规模化'],
          actions: ['组建专门团队', '建立流程标准', '扩大试点范围'],
          sortOrder: 2,
        },
        {
          stage: '03',
          title: '团队协同',
          description: '跨角色协同使用 AI，团队级效率显著提升。',
          characteristics: ['跨部门协作', '团队级流程设计', '数据驱动决策', '效果可衡量'],
          painPoints: ['需要组织支持', '需要持续投入', '需要变革管理'],
          actions: ['建立协作机制', '设计团队 KPI', '推动组织学习'],
          sortOrder: 3,
        },
        {
          stage: '04',
          title: '组织重塑',
          description: '组织结构因 AI 改变，AI 成为核心能力。',
          characteristics: ['组织结构重塑', '新角色诞生', 'AI 成为 KPI', '文化全面拥抱'],
          painPoints: ['变革阻力', '需要高管决心', '需要长期投入'],
          actions: ['重塑组织结构', '设计新角色', '建立 AI 文化'],
          sortOrder: 4,
        },
        {
          stage: '05',
          title: '战略核心',
          description: 'AI 成为战略级能力，组织全面智能化。',
          characteristics: ['AI 驱动战略', '组织 AI 化', '行业领先地位', '生态影响力'],
          painPoints: ['保持创新', '应对竞争', '持续进化'],
          actions: ['持续创新', '构建生态', '引领行业'],
          sortOrder: 5,
        },
      ],
    },
    {
      kind: 'WORKFLOW' as const,
      slug: 'workflow-demo',
      title: 'AI Workflow Demo',
      subtitle: '看见真实的工作流改变',
      heroDesc: '选择业务场景，对比"传统 vs AI"工作方式。',
      sortOrder: 3,
      stages: [
        {
          stage: '01',
          title: '销售场景',
          description: 'B2B 销售流程的 AI 化改造。',
          characteristics: ['线索智能分配', '客户画像自动生成', '销售话术推荐', '成单预测'],
          painPoints: ['线索质量参差', '新人成单周期长', '转化率波动大'],
          actions: ['AI 评分线索', '自动生成客户报告', '实时推荐话术'],
          details: {
            industry: 'sales',
            traditional: {
              duration: '4h / 单',
              steps: [
                { role: '销售', action: '手动筛 200 条线索', duration: '40 min' },
                { role: '销售', action: '逐条搜客户背景', duration: '90 min' },
                { role: '销售', action: '写客户邮件', duration: '60 min' },
                { role: '销售', action: '整理 CRM 记录', duration: '50 min' },
              ],
              output: '低质量线索列表 + 模板化邮件',
            },
            aiEnabled: {
              duration: '50 min / 单',
              steps: [
                { role: 'AI', action: '自动评分 200 条线索', duration: '3 min', aiCapability: '基于历史成交模式学习' },
                { role: 'AI', action: '生成客户画像报告', duration: '5 min', aiCapability: '聚合公开信息 + CRM 历史' },
                { role: 'AI', action: '推荐个性化话术', duration: '2 min', aiCapability: 'RAG 检索产品知识库' },
                { role: '销售', action: 'AI 辅助确认与发送', duration: '40 min' },
              ],
              output: '高质量 Top20 线索 + 个性化邮件 + 跟进策略',
            },
          },
          sortOrder: 1,
        },
        {
          stage: '02',
          title: '市场场景',
          description: '市场内容生产与投放的 AI 化。',
          characteristics: ['内容自动生成', '多渠道分发', '效果实时分析', '用户画像精准'],
          painPoints: ['内容生产成本高', '效果难以衡量', '响应速度慢'],
          actions: ['AI 内容生产', '智能投放优化', '实时效果分析'],
          details: {
            industry: 'marketing',
            traditional: {
              duration: '2 天',
              steps: [
                { role: '市场', action: '选题调研', duration: '4h' },
                { role: '市场', action: '撰写文案', duration: '6h' },
                { role: '设计', action: '配图与排版', duration: '4h' },
                { role: '市场', action: '多渠道投放', duration: '2h' },
              ],
              output: '1 篇内容 + 多渠道分发',
            },
            aiEnabled: {
              duration: '4h',
              steps: [
                { role: 'AI', action: '实时热点扫描', duration: '10 min', aiCapability: '全网热点聚合分析' },
                { role: 'AI', action: '一键生成多版本文案', duration: '15 min', aiCapability: '多模型协同' },
                { role: 'AI', action: '自动设计配图', duration: '20 min', aiCapability: 'AI 设计生成' },
                { role: '市场', action: '审核 + 智能投放', duration: '3h' },
              ],
              output: '1 套内容包（5 个平台版本）',
            },
          },
          sortOrder: 2,
        },
        {
          stage: '03',
          title: 'HR 场景',
          description: '招聘与员工发展的 AI 化。',
          characteristics: ['简历智能筛选', '面试问题推荐', '员工画像生成', '培训内容个性化'],
          painPoints: ['筛选效率低', '面试标准不一', '培训效果难量化'],
          actions: ['AI 简历筛选', '结构化面试', '个性化培训'],
          details: {
            industry: 'hr',
            traditional: {
              duration: '30 min / 份',
              steps: [
                { role: 'HR', action: '浏览简历', duration: '15 min' },
                { role: 'HR', action: '评估匹配度', duration: '10 min' },
                { role: 'HR', action: '做面试笔记', duration: '5 min' },
              ],
              output: '简历初筛结果',
            },
            aiEnabled: {
              duration: '5 min / 份',
              steps: [
                { role: 'AI', action: '自动解析简历', duration: '10 sec', aiCapability: 'OCR + NLP' },
                { role: 'AI', action: '智能匹配岗位', duration: '5 sec', aiCapability: '岗位要求匹配算法' },
                { role: 'AI', action: '推荐面试问题', duration: '10 sec', aiCapability: '基于候选人画像' },
                { role: 'HR', action: '审核 + 决策', duration: '4 min' },
              ],
              output: '候选人评分 + 面试问题集',
            },
          },
          sortOrder: 3,
        },
        {
          stage: '04',
          title: '客服场景',
          description: '客户服务的 AI 化升级。',
          characteristics: ['智能客服 7x24', '工单智能分类', '情绪识别', '自动升级处理'],
          painPoints: ['人工成本高', '响应速度慢', '服务质量波动'],
          actions: ['部署 AI 客服', '智能工单处理', '情绪监控'],
          details: {
            industry: 'service',
            traditional: {
              duration: '8 min / 工单',
              steps: [
                { role: '客服', action: '阅读客户问题', duration: '2 min' },
                { role: '客服', action: '查询知识库', duration: '3 min' },
                { role: '客服', action: '写回复', duration: '2 min' },
                { role: '客服', action: '归档记录', duration: '1 min' },
              ],
              output: '客户回复',
            },
            aiEnabled: {
              duration: '30 sec / 工单',
              steps: [
                { role: 'AI', action: '识别客户意图', duration: '1 sec', aiCapability: '意图识别模型' },
                { role: 'AI', action: '检索知识库答案', duration: '2 sec', aiCapability: 'RAG 检索' },
                { role: 'AI', action: '生成回复', duration: '5 sec', aiCapability: '对话生成' },
                { role: '客服', action: '复杂问题接管', duration: '20 sec' },
              ],
              output: '即时回复 + 复杂问题升级',
            },
          },
          sortOrder: 4,
        },
        {
          stage: '05',
          title: '管理场景',
          description: '管理决策与报告的 AI 化。',
          characteristics: ['报告自动生成', '数据洞察推荐', '决策辅助', '风险预警'],
          painPoints: ['数据分散', '报告耗时长', '决策依赖经验'],
          actions: ['AI 数据洞察', '自动报告生成', '决策辅助系统'],
          details: {
            industry: 'management',
            traditional: {
              duration: '5 天',
              steps: [
                { role: '分析师', action: '收集各部门数据', duration: '1 day' },
                { role: '分析师', action: '清洗与对账', duration: '1 day' },
                { role: '分析师', action: '分析并出图', duration: '2 day' },
                { role: '管理层', action: '阅读报告', duration: '1 day' },
              ],
              output: '月度经营报告',
            },
            aiEnabled: {
              duration: '2 小时',
              steps: [
                { role: 'AI', action: '实时聚合数据', duration: '5 min', aiCapability: '多源数据自动集成' },
                { role: 'AI', action: '异常检测', duration: '10 min', aiCapability: '异常模式识别' },
                { role: 'AI', action: '自动生成报告', duration: '30 min', aiCapability: '智能报告生成' },
                { role: '管理层', action: '决策对话', duration: '1h' },
              ],
              output: '实时报告 + 洞察建议',
            },
          },
          sortOrder: 5,
        },
      ],
    },
  ]

  for (const m of SEED_MAPS) {
    const existed = await prisma.experienceMap.findUnique({ where: { slug: m.slug } })
    if (existed) {
      await prisma.experienceMap.delete({ where: { id: existed.id } }) // 级联删 stages
    }
    await prisma.experienceMap.create({
      data: {
        kind: m.kind,
        slug: m.slug,
        title: m.title,
        subtitle: m.subtitle,
        heroDesc: m.heroDesc,
        sortOrder: m.sortOrder,
        isActive: true,
        stages: { create: m.stages },
      },
    })
  }
  console.log(`  ✅ ExperienceMap: ${SEED_MAPS.length} 张地图已写入`)

  // 7. AssessmentQuestion 题库（7 维度 × 4-5 题）
  const SEED_QUESTIONS = [
    // STRATEGY 战略
    { slug: 'q-s1', dimension: 'STRATEGY' as const, text: '公司有清晰的 AI 战略与路线图。', options: [{ score: 1, label: '完全不同意' }, { score: 2, label: '不同意' }, { score: 3, label: '中立' }, { score: 4, label: '同意' }, { score: 5, label: '完全同意' }], sortOrder: 1 },
    { slug: 'q-s2', dimension: 'STRATEGY' as const, text: '高管层对 AI 转型有明确承诺与投入。', options: [{ score: 1, label: '完全没有' }, { score: 2, label: '较少' }, { score: 3, label: '一般' }, { score: 4, label: '较多' }, { score: 5, label: '非常多' }], sortOrder: 2 },
    { slug: 'q-s3', dimension: 'STRATEGY' as const, text: 'AI 战略与业务战略深度对齐。', options: [{ score: 1, label: '完全没对齐' }, { score: 2, label: '部分对齐' }, { score: 3, label: '基本对齐' }, { score: 4, label: '深度对齐' }, { score: 5, label: '完全融合' }], sortOrder: 3 },
    // PEOPLE 人才
    { slug: 'q-p1', dimension: 'PEOPLE' as const, text: '员工普遍具备基础 AI 工具使用能力。', options: [{ score: 1, label: '< 10%' }, { score: 2, label: '10-30%' }, { score: 3, label: '30-60%' }, { score: 4, label: '60-80%' }, { score: 5, label: '> 80%' }], sortOrder: 1 },
    { slug: 'q-p2', dimension: 'PEOPLE' as const, text: '公司有专门的 AI 人才或团队。', options: [{ score: 1, label: '没有' }, { score: 2, label: '1-3 人' }, { score: 3, label: '3-10 人' }, { score: 4, label: '10-30 人' }, { score: 5, label: '> 30 人' }], sortOrder: 2 },
    { slug: 'q-p3', dimension: 'PEOPLE' as const, text: '员工能持续学习 AI 新能力。', options: [{ score: 1, label: '完全没有' }, { score: 2, label: '偶尔' }, { score: 3, label: '经常' }, { score: 4, label: '系统化' }, { score: 5, label: '常态化' }], sortOrder: 3 },
    // WORKFLOW 工作流
    { slug: 'q-w1', dimension: 'WORKFLOW' as const, text: 'AI 已嵌入到核心业务流程。', options: [{ score: 1, label: '没有' }, { score: 2, label: '1-2 条' }, { score: 3, label: '3-5 条' }, { score: 4, label: '5-10 条' }, { score: 5, label: '> 10 条' }], sortOrder: 1 },
    { slug: 'q-w2', dimension: 'WORKFLOW' as const, text: '工作流有清晰的 AI 使用标准。', options: [{ score: 1, label: '没有标准' }, { score: 2, label: '探索中' }, { score: 3, label: '有标准' }, { score: 4, label: '标准化' }, { score: 5, label: '持续优化' }], sortOrder: 2 },
    { slug: 'q-w3', dimension: 'WORKFLOW' as const, text: 'AI 工作流的效果可被衡量。', options: [{ score: 1, label: '无法衡量' }, { score: 2, label: '部分衡量' }, { score: 3, label: '基本衡量' }, { score: 4, label: '系统衡量' }, { score: 5, label: '驱动决策' }], sortOrder: 3 },
    // TECHNOLOGY 技术
    { slug: 'q-t1', dimension: 'TECHNOLOGY' as const, text: '公司有统一的 AI 工具栈。', options: [{ score: 1, label: '完全分散' }, { score: 2, label: '部分统一' }, { score: 3, label: '基本统一' }, { score: 4, label: '完全统一' }, { score: 5, label: '战略级统一' }], sortOrder: 1 },
    { slug: 'q-t2', dimension: 'TECHNOLOGY' as const, text: 'AI 工具有数据安全与合规保障。', options: [{ score: 1, label: '没有保障' }, { score: 2, label: '基础保障' }, { score: 3, label: '中等保障' }, { score: 4, label: '高保障' }, { score: 5, label: '战略级保障' }], sortOrder: 2 },
    // DATA 数据
    { slug: 'q-d1', dimension: 'DATA' as const, text: '公司数据资产有清晰的治理。', options: [{ score: 1, label: '没有' }, { score: 2, label: '初步' }, { score: 3, label: '基本' }, { score: 4, label: '完善' }, { score: 5, label: '战略级' }], sortOrder: 1 },
    { slug: 'q-d2', dimension: 'DATA' as const, text: 'AI 用到的数据质量稳定。', options: [{ score: 1, label: '很差' }, { score: 2, label: '较差' }, { score: 3, label: '一般' }, { score: 4, label: '较好' }, { score: 5, label: '很好' }], sortOrder: 2 },
    // GOVERNANCE 治理
    { slug: 'q-g1', dimension: 'GOVERNANCE' as const, text: '公司有 AI 使用的伦理与合规规范。', options: [{ score: 1, label: '没有' }, { score: 2, label: '初步' }, { score: 3, label: '有规范' }, { score: 4, label: '完善' }, { score: 5, label: '战略级' }], sortOrder: 1 },
    { slug: 'q-g2', dimension: 'GOVERNANCE' as const, text: 'AI 决策可被追溯与审计。', options: [{ score: 1, label: '不能' }, { score: 2, label: '部分' }, { score: 3, label: '基本' }, { score: 4, label: '完全' }, { score: 5, label: '自动化' }], sortOrder: 2 },
    // ORGANIZATION 组织
    { slug: 'q-o1', dimension: 'ORGANIZATION' as const, text: '组织结构因 AI 进行了调整。', options: [{ score: 1, label: '完全没有' }, { score: 2, label: '局部' }, { score: 3, label: '部分' }, { score: 4, label: '较大' }, { score: 5, label: '全面' }], sortOrder: 1 },
    { slug: 'q-o2', dimension: 'ORGANIZATION' as const, text: '公司有 AI 变革管理的机制。', options: [{ score: 1, label: '没有' }, { score: 2, label: '探索中' }, { score: 3, label: '有机制' }, { score: 4, label: '完善' }, { score: 5, label: '成熟' }], sortOrder: 2 },
  ]

  let qCreated = 0, qUpdated = 0
  for (const q of SEED_QUESTIONS) {
    const existed = await prisma.assessmentQuestion.findUnique({ where: { slug: q.slug } })
    if (existed) {
      await prisma.assessmentQuestion.update({ where: { id: existed.id }, data: q })
      qUpdated++
    } else {
      await prisma.assessmentQuestion.create({ data: q })
      qCreated++
    }
  }
  console.log(`  ✅ AssessmentQuestion: ${qCreated} 新建 / ${qUpdated} 更新 / 共 ${SEED_QUESTIONS.length} 题`)

  // ===================================================================
  // 8. Series 系列（认知地图节点 / 学习模块）
  //    3 个系列 + 12 个子主题，按 navSection 分布
  // ===================================================================
  const SEED_SERIES = [
    {
      slug: 'ai-changing-what',
      navSection: 'understand' as const,
      title: 'AI 正在改变什么',
      en: 'AI Changing What',
      desc: '从工具到组织，AI 正在重新定义企业每一个核心环节。',
      sortOrder: 1,
      subTopics: [
        { slug: 'tech-evolution',  name: '技术演进',   sortOrder: 1 },
        { slug: 'agent-patterns',  name: 'Agent 形态', sortOrder: 2 },
        { slug: 'model-capability', name: '模型能力',  sortOrder: 3 },
        { slug: 'industry-trend',  name: '产业趋势',   sortOrder: 4 },
      ],
    },
    {
      slug: 'ai-changing-organization',
      navSection: 'understand' as const,
      title: 'AI 如何重塑组织',
      en: 'AI Changing Organization',
      desc: '组织结构、岗位定义、协作方式——当 AI 成为同事，组织的每个齿轮都要被重新设计。',
      sortOrder: 2,
      subTopics: [
        { slug: 'org-structure',   name: '组织结构',     sortOrder: 1 },
        { slug: 'role-rewrite',    name: '岗位重定义',   sortOrder: 2 },
        { slug: 'collab-pattern',  name: '协作新模式',   sortOrder: 3 },
        { slug: 'talent-strategy', name: '人才策略',     sortOrder: 4 },
      ],
    },
    {
      slug: 'ai-changing-workflow',
      navSection: 'learn' as const,
      title: 'AI 时代的工作流',
      en: 'AI Workflows',
      desc: '从一线岗位到管理流程，AI 落地的真实工作流是怎么跑的。',
      sortOrder: 1,
      subTopics: [
        { slug: 'daily-tools',      name: '日常提效工具', sortOrder: 1 },
        { slug: 'decision-flow',    name: '决策流程',     sortOrder: 2 },
        { slug: 'creation-flow',    name: '内容创作流',   sortOrder: 3 },
        { slug: 'review-flow',      name: '审核与质检',   sortOrder: 4 },
      ],
    },
  ]

  let sCreated = 0, sUpdated = 0, stCreated = 0, stUpdated = 0
  for (const s of SEED_SERIES) {
    const { subTopics, ...seriesData } = s
    const existed = await prisma.series.findUnique({ where: { slug: s.slug } })
    let seriesId: string
    if (existed) {
      const updated = await prisma.series.update({
        where: { id: existed.id },
        data: seriesData,
      })
      seriesId = updated.id
      sUpdated++
    } else {
      const created = await prisma.series.create({ data: seriesData })
      seriesId = created.id
      sCreated++
    }

    // 子主题：用 upsert（seriesId + slug 复合唯一）
    for (const st of subTopics) {
      const existedSt = await prisma.subTopic.findUnique({
        where: { seriesId_slug: { seriesId, slug: st.slug } },
      })
      if (existedSt) {
        await prisma.subTopic.update({
          where: { id: existedSt.id },
          data: { name: st.name, sortOrder: st.sortOrder },
        })
        stUpdated++
      } else {
        await prisma.subTopic.create({
          data: { ...st, seriesId },
        })
        stCreated++
      }
    }
  }
  console.log(`  ✅ Series: ${sCreated} 新建 / ${sUpdated} 更新`)
  console.log(`  ✅ SubTopic: ${stCreated} 新建 / ${stUpdated} 更新`)

  console.log('')
  console.log('🎉 种子完成！')
  console.log('')
  console.log('  登录账号:')
  console.log(`    username: ${adminUser}`)
  console.log(`    password: ${adminPass}`)
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ 种子失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
