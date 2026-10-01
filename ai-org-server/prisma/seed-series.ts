/**
 * 一次性补 ai-changing-work 系列（用于首页 CognitionPathSection 演示）
 *
 * 用法：npx tsx prisma/seed-series.ts
 *
 * 已存在的 series 会跳过；不存在则创建。
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TARGETS = [
  {
    slug: 'ai-changing-what',
    title: 'AI 正在改变什么',
    en: 'AI Changing What',
    desc: '从工具到组织：AI 正在重新定义企业的每一个基本单元。',
    sortOrder: 1,
    topics: [
      { slug: 'tech-evolution',    name: '技术演进', sortOrder: 1 },
      { slug: 'agent-patterns',    name: 'Agent 形态', sortOrder: 2 },
      { slug: 'model-capability',  name: '模型能力', sortOrder: 3 },
      { slug: 'industry-trend',    name: '产业趋势', sortOrder: 4 },
    ],
  },
  {
    slug: 'ai-changing-work',
    title: 'AI 正在改变工作什么',
    en: 'AI Changing Work',
    desc: '个人 / 工作 / 流程——AI 渗透到工作方式的每一层。',
    sortOrder: 2,
    topics: [
      { slug: 'individual-ability', name: '个人能力', sortOrder: 1 },
      { slug: 'function-job',       name: '职能岗位', sortOrder: 2 },
      { slug: 'workflow',           name: '工作方式', sortOrder: 3 },
      { slug: 'process-restructure', name: '流程重构', sortOrder: 4 },
    ],
  },
  {
    slug: 'ai-changing-organization',
    title: 'AI 为什么必须改变组织',
    en: 'AI Changing Organization',
    desc: '组织结构、岗位定义、协作方式——当 AI 成为同事，组织的每个字段都要重新设计。',
    sortOrder: 3,
    topics: [
      { slug: 'org-structure', name: '组织结构', sortOrder: 1 },
      { slug: 'role-rewrite',  name: '岗位重定义', sortOrder: 2 },
      { slug: 'collab-pattern', name: '协作模式', sortOrder: 3 },
      { slug: 'talent-strategy', name: '人才战略', sortOrder: 4 },
    ],
  },
]

async function main() {
  for (const t of TARGETS) {
    const existing = await prisma.series.findUnique({ where: { slug: t.slug } })
    if (existing) {
      console.log(`[skip] series already exists: ${t.slug}`)
      continue
    }

    const series = await prisma.series.create({
      data: {
        slug: t.slug,
        title: t.title,
        en: t.en,
        desc: t.desc,
        navSection: 'understand',
        sortOrder: t.sortOrder,
        isPublished: true,
        subTopics: {
          create: t.topics.map((top) => ({
            slug: top.slug,
            name: top.name,
            sortOrder: top.sortOrder,
          })),
        },
      },
    })
    console.log(`[create] ${series.slug} (id=${series.id})`)
  }
  console.log('Done.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())