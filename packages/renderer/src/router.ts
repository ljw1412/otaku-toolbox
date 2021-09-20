import { createRouter, createWebHashHistory } from 'vue-router'
import MainRoutes from '/@/routes/main'
import SeparateRoutes from '/@/routes/separate'

const routes = [
  { path: '/', redirect: { name: 'AppHome' } },
  MainRoutes,
  ...SeparateRoutes
]

const router = createRouter({
  routes,
  history: createWebHashHistory(),
  scrollBehavior(to, from, savedPosition) {
    console.log('[scrollBehavior]', savedPosition)

    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

if (import.meta.env.MODE === 'development') {
  router.afterEach((to, from) => {
    const tofrom = ['\n[To]', to, '\n[From]', from]
    console.log(`[Current] ${window.location.href}`, ...tofrom)
  })
}

export default router
