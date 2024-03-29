import { ComponentPublicInstance } from 'vue'
import {
  createRouter,
  createWebHashHistory,
  isNavigationFailure
} from 'vue-router'
import { getNavigationCache } from '/@/utils/cache'
import MainRoutes from '/@/routes/main'
import SeparateRoutes from '/@/routes/separate'
import PluginRoutes from '/@/plugins/route'
import mGlobal, { globalAdd } from '/@/global'
import * as logger from '/@/utils/logger'

const routes = [
  { path: '/', redirect: { name: 'AppHome' } },
  MainRoutes,
  ...SeparateRoutes,
  ...PluginRoutes
]

const router = createRouter({
  routes,
  history: createWebHashHistory()
})

export default router

router.beforeEach((to, from, next) => {
  const routeName = to.name as string
  if (['AppAnime', 'AppComic', 'AppGame'].includes(routeName)) {
    const module = to.meta.module as string
    const navCache = getNavigationCache(module)
    const homeRouteName = routeName.replace('App', '') + 'Home'
    console.log('路由缓存：', navCache, `,首页路由：${homeRouteName}`)
    return next(navCache || { name: homeRouteName })
  }
  // 拦截未匹配成功的路由
  if (!to.matched.length) {
    const isMain = to.query.isMain === 'true' || from.path.startsWith('/main')
    return next({
      replace: true,
      name: isMain ? 'AppError' : 'ViewError',
      query: { message: '页面不存在', status: '404', isMain: isMain + '' }
    })
  }

  next()
})

if (import.meta.env.MODE === 'development') {
  router.afterEach((to, from) => {
    const tofrom = [
      ['[To]', to],
      ['[From]', from]
    ]
    logger.message('CurrentRoute', window.location.href, ...tofrom)
  })
}

globalAdd('router', router)

export function routerErrorhandler(
  error: unknown,
  vm: ComponentPublicInstance | null,
  info: string
) {
  const isRouterError = isNavigationFailure(error)
  if (!isRouterError) return false
  if (vm) {
    const errorId = +new Date()
    router.push({
      name: vm.$route.path.startsWith('/main') ? 'AppError' : 'ViewError',
      query: { message: '页面不存在', status: '404', id: errorId }
    })
    mGlobal.errorStore[errorId] = error
  }
  return true
}
