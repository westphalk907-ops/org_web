import type { RouteRecordRaw } from 'vue-router'
import { useAdminAuthStore } from './store'

/**
 * 管理后台路由
 * 嵌在主站里（/admin 前缀）
 */
const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/login',
    name: 'admin.login',
    component: () => import('./views/Login.vue'),
    meta: { title: '管理后台登录', hideInNav: true },
  },
  {
    path: '/admin',
    name: 'admin.dashboard',
    component: () => import('./views/Dashboard.vue'),
    meta: { title: '管理控制台', requiresAdmin: true, hideInNav: true },
  },
  {
    path: '/admin/resources',
    name: 'admin.resources',
    component: () => import('./views/Resources.vue'),
    meta: { title: '资料管理', requiresAdmin: true, hideInNav: true },
  },
  {
    path: '/admin/articles',
    name: 'admin.articles',
    component: () => import('./views/Articles.vue'),
    meta: { title: '文章管理', requiresAdmin: true, hideInNav: true },
  },
  {
    path: '/admin/series',
    name: 'admin.series',
    component: () => import('./views/Series.vue'),
    meta: { title: '系列管理', requiresAdmin: true, hideInNav: true },
  },
  {
    path: '/admin/cases',
    name: 'admin.cases',
    component: () => import('./views/Cases.vue'),
    meta: { title: '案例管理', requiresAdmin: true, hideInNav: true },
  },
  {
    path: '/admin/scenarios',
    name: 'admin.scenarios',
    component: () => import('./views/Scenarios.vue'),
    meta: { title: '场景管理', requiresAdmin: true, hideInNav: true },
  },
]

/**
 * 鉴权守卫：未登录跳 /admin/login
 */
export function installAdminGuard(router: { beforeEach: (cb: any) => void }) {
  router.beforeEach(async (to: any) => {
    if (!to.meta?.requiresAdmin) return true

    const auth = useAdminAuthStore()
    if (!auth.isLoggedIn) return { path: '/admin/login', query: { redirect: to.fullPath } }

    if (!auth.user) {
      try {
        await auth.fetchMe()
      } catch {
        auth.logout()
        return { path: '/admin/login' }
      }
    }
    return true
  })
}

export default adminRoutes