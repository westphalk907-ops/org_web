import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/Index.vue'),
    meta: { title: '首页' }
  },

  // Understand / 认知
  {
    path: '/understand',
    name: 'understand',
    component: () => import('@/views/understand/Index.vue'),
    meta: { title: '认知 · Understand' }
  },
  // 趋势 → 跳到洞察页 + filter
  {
    path: '/understand/trends',
    redirect: '/understand/insights?category=trend'
  },
  {
    path: '/understand/insights',
    name: 'understand.insights',
    component: () => import('@/views/understand/Insights.vue'),
    meta: { title: '洞察' }
  },
  // 研究 → 跳到洞察页（trends/research 都用同一个列表，加 filter）
  {
    path: '/understand/research',
    redirect: '/understand/insights?category=research'
  },
  // 系列专题页：认知路径三大节点的展开
  {
    path: '/understand/series/:slug',
    name: 'understand.series',
    component: () => import('@/views/understand/Series.vue'),
    meta: { title: '系列专题' }
  },
  {
    path: '/understand/:slug',
    name: 'understand.detail',
    component: () => import('@/views/understand/Detail.vue'),
    meta: { title: '文章详情' }
  },

  // Learn / 学习
  {
    path: '/learn',
    name: 'learn',
    component: () => import('@/views/learn/Index.vue'),
    meta: { title: '学习 · Learn' }
  },
  // 框架 → 跳资料库 + filter=framework
  {
    path: '/learn/frameworks',
    redirect: '/resources?type=framework'
  },
  // 行动手册 → 跳资料库 + filter=playbook
  {
    path: '/learn/playbooks',
    redirect: '/resources?type=playbook'
  },
  // 白皮书 → 跳资料库 + filter=whitepaper
  {
    path: '/learn/whitepapers',
    redirect: '/resources?type=whitepaper'
  },
  {
    path: '/learn/:slug',
    name: 'learn.detail',
    component: () => import('@/views/learn/Detail.vue'),
    meta: { title: '内容详情' }
  },

  // Experience / 体验
  {
    path: '/experience',
    name: 'experience',
    component: () => import('@/views/experience/Index.vue'),
    meta: { title: '体验 · Experience' }
  },
  // AI 组织成熟度测评（顶栏 / 首页痛点 / 资源卡 共用入口）
  {
    path: '/experience/assessment',
    name: 'experience.assessment',
    component: () => import('@/views/experience/Assessment.vue'),
    meta: { title: 'AI 组织成熟度测评' }
  },
  // 三个独立地图视图（首页三阶路径直达）
  {
    path: '/experience/individual-map',
    name: 'experience.individual-map',
    component: () => import('@/views/experience/IndividualMap.vue'),
    meta: { title: '个人地图 · Individual Map' }
  },
  {
    path: '/experience/organization-map',
    name: 'experience.organization-map',
    component: () => import('@/views/experience/OrganizationMap.vue'),
    meta: { title: '组织地图 · Organization Map' }
  },
  {
    path: '/experience/workflow-demo',
    name: 'experience.workflow-demo',
    component: () => import('@/views/experience/WorkflowDemo.vue'),
    meta: { title: '工作流演示 · Workflow Demo' }
  },

  // 体验区场景详情
  {
    path: '/experience/scenarios/:slug',
    name: 'experience.scenario',
    component: () => import('@/views/experience/ScenarioDetail.vue'),
    meta: { title: '场景详情' }
  },

  // Act / 行动
  {
    path: '/act',
    name: 'act',
    component: () => import('@/views/act/Index.vue'),
    meta: { title: '行动 · Act' }
  },
  {
    path: '/act/academy',
    name: 'act.academy',
    component: () => import('@/views/act/Academy.vue'),
    meta: { title: 'AI Academy' }
  },
  {
    path: '/act/work-lab',
    name: 'act.work-lab',
    component: () => import('@/views/act/WorkLab.vue'),
    meta: { title: 'AI Work Lab' }
  },
  {
    path: '/act/consulting',
    name: 'act.consulting',
    component: () => import('@/views/act/Consulting.vue'),
    meta: { title: '组织变革咨询' }
  },

  // Resources / 资料库
  {
    path: '/resources',
    name: 'resources',
    component: () => import('@/views/resources/Index.vue'),
    meta: { title: '资料库 · Resources' }
  },
  {
    path: '/resources/:slug',
    name: 'resources.detail',
    component: () => import('@/views/resources/Detail.vue'),
    meta: { title: '资料详情' }
  },

  // Cases / 案例
  {
    path: '/cases',
    name: 'cases',
    component: () => import('@/views/cases/Index.vue'),
    meta: { title: '案例' }
  },
  {
    path: '/cases/:slug',
    name: 'cases.detail',
    component: () => import('@/views/cases/Detail.vue'),
    meta: { title: '案例详情' }
  },

  // About / 关于我们
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/about/Index.vue'),
    meta: { title: '关于我们' }
  },

  // Legal / 法律页面
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/views/legal/Privacy.vue'),
    meta: { title: '隐私政策' }
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/views/legal/Terms.vue'),
    meta: { title: '服务条款' }
  },

  // Contact / 咨询
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/contact/Index.vue'),
    meta: { title: '联系我们' }
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '页面未找到' }
  }
]

export default routes
