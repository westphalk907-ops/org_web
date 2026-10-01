import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import adminRoutes, { installAdminGuard } from '@/admin/routes'

const router = createRouter({
    history: createWebHistory(),
    routes: [...routes, ...adminRoutes],
    scrollBehavior(to, _from, savedPosition) {
      // 浏览器前进/后退：恢复原位置
      if (savedPosition) return savedPosition

      // 跳到带 hash 的目标
      if (to.hash) {
        // 等待目标元素渲染（特别是跨页面 + hash）
        return new Promise((resolve) => {
          setTimeout(() => {
            const el = document.querySelector(to.hash)
            if (el) {
              // 顶部 fixed header 高度 64px + 8px 余量
              resolve({ el: to.hash, top: 72, behavior: 'smooth' })
            } else {
              resolve({ top: 0, behavior: 'smooth' })
            }
          }, 300)
        })
      }

      return { top: 0, behavior: 'smooth' }
    }
  })

router.afterEach((to) => {
  const title = to.meta?.title as string | undefined
  document.title = title ? `${title} · AI Organization Solution Hub` : 'AI Organization Solution Hub'
})

// 安装后台鉴权守卫
installAdminGuard(router)

export default router
