/**
 * 最小 mock 后端，仅用于让 admin UI 可写入 / 读取
 * 真实生产请使用 ai-org-web/backend/main.py (FastAPI + Supabase)
 *
 * 用法: node scripts/mock-admin-backend.mjs
 * 监听: 4000
 */
import http from 'node:http'
import { URL } from 'node:url'

const PORT = 4000

// 内存数据
const db = {
  resources: [
    {
      id: 'r-001',
      slug: 'ai-org-evolution-whitepaper',
      type: 'whitepaper',
      title: '企业 AI 组织进化白皮书 2026',
      subtitle: '从工具到组织的范式转移',
      summary: '一份系统阐述 AI 组织变革方法论的白皮书，包含三大模块、五项跃迁与十二个真实案例。',
      author: '道可乾元研究院',
      publishedAt: '2026-01-15T00:00:00.000Z',
      tags: ['白皮书', '组织', '方法论'],
      audience: ['CEO', 'CHRO', 'CIO'],
      industry: ['制造业', '金融', '零售'],
      pages: 48,
      fileUrl: '/uploads/ai-org-evolution.pdf',
      fileName: '企业 AI 组织进化白皮书.pdf',
      fileSize: '12.4 MB',
      viewCount: 1248,
      downloadCount: 386,
      isFeatured: true,
      sortOrder: 1,
    },
    {
      id: 'r-002',
      slug: 'weekly-report-workflow',
      type: 'workflow',
      title: 'AI 周报生成工作流',
      subtitle: '把一周碎片产出，整理成可上会的复盘报告',
      summary: '基于 LLM 的周报自动化工作流，输入日程 + 碎片产出，输出结构化周报。',
      author: '道可乾元内容团队',
      publishedAt: '2026-02-01T00:00:00.000Z',
      tags: ['工作流', '效率', '周报'],
      audience: ['产品经理', '运营'],
      industry: ['互联网', 'SaaS'],
      pages: 8,
      fileUrl: '/uploads/weekly-report.md',
      fileName: 'AI 周报工作流.md',
      fileSize: '24 KB',
      viewCount: 856,
      downloadCount: 241,
      isFeatured: false,
      sortOrder: 2,
    },
  ],
  contents: [
    {
      id: 'c-001',
      slug: 'ai-fluency',
      category: 'insight',
      title: '从 AI Literacy 到 AI Fluency：企业 AI 进化的下一个十年',
      subtitle: 'AI 素养的真正含义',
      excerpt: 'AI Literacy 是基础，AI Fluency 才是组织能力的分水岭。本文系统阐述二者区别。',
      content: '# 从 AI Literacy 到 AI Fluency\n\n企业 AI 进化，**不是**让更多人「会用」AI，\n而是让组织具备与 AI **共事**的能力。\n\n## 三个维度\n\n- **个人维度**：AI Literacy\n- **场景维度**：AI 嵌入工作流\n- **组织维度**：AI 决策与治理',
      author: '道可乾元',
      publishedAt: '2026-03-10T00:00:00.000Z',
      tags: ['AI', '组织', '素养'],
      sourceUrl: '',
      sourcePlatform: '',
      isPublished: true,
      viewCount: 642,
      likeCount: 88,
      contentHtml: '',
      readingTime: 7,
    },
  ],
  cases: [
    {
      id: 'cs-001',
      slug: 'manufacturing-ai-rollout',
      company: '某大型制造集团',
      industry: '制造业',
      scale: '10,000+ 员工',
      title: '从 5 人 AI 试验到 200 人 AI 协同组织',
      before: '研发部门分散使用 ChatGPT、文心一言等工具，知识无法沉淀，效果不可衡量。',
      intervention: '为期 12 周的 AI Academy 培训 + 3 个核心场景的工作流改造 + AI 治理委员会建设。',
      after: '员工 AI 使用率从 18% 提升至 76%，研发文档整理效率提升 4 倍。',
      next: '建立内部 AI Agent 平台，向供应链和客户服务延伸。',
      metrics: [
        { label: 'AI 使用率', value: '18% → 76%' },
        { label: '文档整理效率', value: '+400%' },
      ],
      testimonial: '道可乾元的培训不只是工具教学，更是工作方式的重塑。',
      isPublished: true,
      sortOrder: 1,
    },
  ],
  scenarios: [
    {
      id: 'sc-001',
      slug: 'weekly-report-ai',
      category: 'INDIVIDUAL',
      title: 'AI 周报生成',
      subtitle: '把一周碎片产出，整理成可上会的复盘报告',
      heroDesc: '基于日程、碎片产出，自动生成结构化周报',
      icon: '📝',
      problem: '每周花 2-3 小时写周报，且格式不统一、重点不突出。',
      beforeSteps: ['打开日程表', '回忆本周产出', '手动整理到文档', '调整格式', '发送给领导'],
      afterSteps: ['导入日程与碎片产出', 'AI 自动生成周报初稿', '人工微调重点', '一键发送给领导'],
      prompts: ['你是资深产品经理，请根据以下本周产出整理为周报...'],
      resourceSlugs: ['weekly-report-workflow'],
      ownerContactEnabled: true,
      tags: ['写作', '效率', '周报'],
      isActive: true,
      sortOrder: 1,
      publishedAt: '2026-04-01',
    },
  ],
  homeConfig: {
    cognitionPath: [
      { id: 1, label: 'AI 个人', desc: '个人阶段', detail: 'AI Literacy · 个人效率 · 场景化' },
      { id: 2, label: 'AI 场景', desc: '场景阶段', detail: '12+ 实战场景 · 可复用 Prompt' },
      { id: 3, label: 'AI 组织', desc: '组织阶段', detail: '治理框架 · 决策智能 · 组织韧性' },
    ],
    deepInsights: [],
    exploreEntries: [],
    forgeJudgments: [],
    methodology: [],
    painPoints: [
      { tag: 'AI 进入企业，真正难的不是"会不会用"', detail: '中间存在五个关键跃迁' },
    ],
  },
}

// ── Auth ──
const ADMIN_ACCOUNTS = {
  admin: { password: 'admin123456', admin: { id: 'admin-001', username: 'admin', email: '[email protected]', role: 'super_admin' } },
  editor: { password: 'editor123', admin: { id: 'admin-002', username: 'editor', email: '[email protected]', role: 'editor' } },
}

// ── Helpers ──
function send(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
  })
  res.end(JSON.stringify(payload))
}
function ok(res, data) { send(res, 200, { ok: true, data }) }
function fail(res, status, code, msg) { send(res, status, { ok: false, error: { code, message: msg } }) }

async function readJson(req) {
  return new Promise((resolve) => {
    let buf = ''
    req.on('data', (c) => (buf += c))
    req.on('end', () => {
      try { resolve(JSON.parse(buf || '{}')) } catch { resolve({}) }
    })
  })
}

function paginate(items, page = 1, pageSize = 20) {
  const p = Math.max(1, +page)
  const ps = Math.min(100, Math.max(1, +pageSize))
  const start = (p - 1) * ps
  return { items: items.slice(start, start + ps), total: items.length, page: p, pageSize: ps }
}

function nextId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

// ── Router ──
async function handle(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  const path = url.pathname
  const method = req.method

  // CORS preflight
  if (method === 'OPTIONS') return send(res, 204, {})

  // ── Auth ──
  if (path === '/api/auth/login' && method === 'POST') {
    const { username, password } = await readJson(req)
    const acct = ADMIN_ACCOUNTS[username]
    if (!acct || acct.password !== password) return fail(res, 401, 'AUTH_FAIL', '账号或密码错误')
    const token = `mock-${username}-${Date.now()}`
    return ok(res, { token, admin: acct.admin })
  }
  if (path === '/api/auth/me' && method === 'GET') {
    const auth = req.headers['authorization'] || ''
    if (!auth.startsWith('Bearer mock-')) return fail(res, 401, 'NO_TOKEN', '未登录')
    const username = auth.replace('Bearer mock-', '').split('-')[0]
    const acct = ADMIN_ACCOUNTS[username]
    if (!acct) return fail(res, 401, 'BAD_TOKEN', 'token 无效')
    return ok(res, { ...acct.admin, lastLoginAt: new Date().toISOString() })
  }

  // ── Resources (admin) ──
  if (path === '/api/resources/admin/list' && method === 'GET') {
    const type = url.searchParams.get('type')
    const keyword = url.searchParams.get('keyword')
    let list = [...db.resources]
    if (type) list = list.filter((r) => r.type === type)
    if (keyword) {
      const k = keyword.toLowerCase()
      list = list.filter((r) => r.title.toLowerCase().includes(k) || (r.summary || '').toLowerCase().includes(k))
    }
    return ok(res, paginate(list, url.searchParams.get('page'), url.searchParams.get('pageSize') || 100))
  }
  if (path === '/api/resources/admin' && method === 'POST') {
    const body = await readJson(req)
    const r = { ...body, id: nextId('r'), viewCount: 0, downloadCount: 0 }
    db.resources.unshift(r)
    return ok(res, r)
  }
  let m = path.match(/^\/api\/resources\/admin\/([^/]+)$/)
  if (m && method === 'PUT') {
    const idx = db.resources.findIndex((r) => r.id === m[1])
    if (idx < 0) return fail(res, 404, 'NOT_FOUND', '资源不存在')
    db.resources[idx] = { ...db.resources[idx], ...(await readJson(req)) }
    return ok(res, db.resources[idx])
  }
  if (m && method === 'DELETE') {
    const idx = db.resources.findIndex((r) => r.id === m[1])
    if (idx < 0) return fail(res, 404, 'NOT_FOUND', '资源不存在')
    db.resources.splice(idx, 1)
    return ok(res, { id: m[1], deletedAt: new Date().toISOString() })
  }

  // ── Contents ──
  if (path === '/api/contents/admin/list' && method === 'GET') {
    const keyword = url.searchParams.get('keyword')
    let list = [...db.contents]
    if (keyword) {
      const k = keyword.toLowerCase()
      list = list.filter((c) => c.title.toLowerCase().includes(k))
    }
    return ok(res, paginate(list, url.searchParams.get('page'), url.searchParams.get('pageSize') || 100))
  }
  m = path.match(/^\/api\/contents\/admin\/([^/]+)$/)
  if (m && method === 'PUT') {
    const idx = db.contents.findIndex((c) => c.id === m[1])
    if (idx < 0) return fail(res, 404, 'NOT_FOUND', '文章不存在')
    db.contents[idx] = { ...db.contents[idx], ...(await readJson(req)) }
    return ok(res, db.contents[idx])
  }
  if (m && method === 'DELETE') {
    const idx = db.contents.findIndex((c) => c.id === m[1])
    if (idx < 0) return fail(res, 404, 'NOT_FOUND', '文章不存在')
    db.contents.splice(idx, 1)
    return ok(res, { id: m[1], deletedAt: new Date().toISOString() })
  }

  // ── Cases ──
  if (path === '/api/cases/admin/list' && method === 'GET') {
    return ok(res, paginate(db.cases, url.searchParams.get('page'), url.searchParams.get('pageSize') || 100))
  }
  if (path === '/api/cases/admin' && method === 'POST') {
    const body = await readJson(req)
    const c = { ...body, id: nextId('cs') }
    db.cases.unshift(c)
    return ok(res, c)
  }
  m = path.match(/^\/api\/cases\/admin\/([^/]+)$/)
  if (m && method === 'PUT') {
    const idx = db.cases.findIndex((c) => c.id === m[1])
    if (idx < 0) return fail(res, 404, 'NOT_FOUND', '案例不存在')
    db.cases[idx] = { ...db.cases[idx], ...(await readJson(req)) }
    return ok(res, db.cases[idx])
  }
  if (m && method === 'DELETE') {
    const idx = db.cases.findIndex((c) => c.id === m[1])
    if (idx < 0) return fail(res, 404, 'NOT_FOUND', '案例不存在')
    db.cases.splice(idx, 1)
    return ok(res, { id: m[1], deletedAt: new Date().toISOString() })
  }

  // ── Scenarios ──
  if (path === '/api/scenarios/admin/list' && method === 'GET') {
    return ok(res, db.scenarios)
  }
  if (path === '/api/scenarios/admin' && method === 'POST') {
    const body = await readJson(req)
    const s = { ...body, id: nextId('sc'), publishedAt: body.publishedAt || new Date().toISOString().slice(0, 10) }
    db.scenarios.push(s)
    return ok(res, s)
  }
  m = path.match(/^\/api\/scenarios\/admin\/([^/]+)$/)
  if (m && method === 'PUT') {
    const idx = db.scenarios.findIndex((s) => s.id === m[1])
    if (idx < 0) return fail(res, 404, 'NOT_FOUND', '场景不存在')
    db.scenarios[idx] = { ...db.scenarios[idx], ...(await readJson(req)) }
    return ok(res, db.scenarios[idx])
  }
  if (m && method === 'DELETE') {
    const idx = db.scenarios.findIndex((s) => s.id === m[1])
    if (idx < 0) return fail(res, 404, 'NOT_FOUND', '场景不存在')
    db.scenarios.splice(idx, 1)
    return ok(res, { id: m[1], deletedAt: new Date().toISOString() })
  }

  // ── 公开读 ──
  if (path === '/api/resources' && method === 'GET') return ok(res, db.resources)
  if (path === '/api/contents' && method === 'GET') return ok(res, db.contents)
  if (path === '/api/cases' && method === 'GET') return ok(res, db.cases)
  if (path === '/api/scenarios' && method === 'GET') return ok(res, db.scenarios)
  if (path === '/api/home-config' && method === 'GET') return ok(res, db.homeConfig)

  // Health
  if (path === '/api/health') return ok(res, { ok: true, time: new Date().toISOString() })

  return fail(res, 404, 'NOT_FOUND', `路由不存在: ${method} ${path}`)
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((e) => {
    console.error('ERR', e)
    fail(res, 500, 'INTERNAL', e.message)
  })
})
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[mock-admin] listening on ${PORT}`)
  console.log(`  admin / admin123456`)
})
