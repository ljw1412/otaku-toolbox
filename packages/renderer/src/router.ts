import { createRouter, createWebHashHistory } from 'vue-router'
import { getNavigationCache } from '/@/utils/cache'
import MainRoutes from '/@/routes/main'
import SeparateRoutes from '/@/routes/separate'

const routes = [
  { path: '/', redirect: { name: 'AppHome' } },
  MainRoutes,
  ...SeparateRoutes
]

const router = createRouter({
  routes,
  history: createWebHashHistory()
})

if (import.meta.env.MODE === 'development') {
  router.afterEach((to, from) => {
    const tofrom = ['\n[To]', to, '\n[From]', from]
    console.log(`[Current] ${window.location.href}`, ...tofrom)
  })
}

router.beforeEach((to, from, next) => {
  const routeName = to.name as string
  if (['AppAnime', 'AppComic', 'AppGame'].includes(routeName)) {
    const module = to.meta.module as string
    const navCache = getNavigationCache(module)
    const homeRouteName = routeName.replace('App', '') + 'Home'
    console.log(homeRouteName, navCache)
    return next(navCache || { name: homeRouteName })
  }
  next()
})

export default router
