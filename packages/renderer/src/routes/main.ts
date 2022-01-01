import { RouteRecordRaw } from 'vue-router'

import MainContainer from '/@/containers/Main.vue'
import AppErrorPage from '/@/pages/pageError/index.vue'
import AppHome from '/@/pages/Home/index.vue'

import AppAnimeHelper from '/@/pages/Anime/Helper.vue'
import AnimeHome from '/@/pages/Anime/Home/index.vue'
import AnimeIndex from '/@/pages/Anime/Index/index.vue'
import AnimeNews from '/@/pages/Anime/News/index.vue'
import AnimeBangumi from '/@/pages/Anime/Bangumi/index.vue'
import AnimeWeekBangumi from '/@/pages/Anime/WeekBangumi/index.vue'

import AppComicHelper from '/@/pages/Comic/Helper.vue'
import ComicHome from '/@/pages/Comic/Home/index.vue'
import ComicOrigin from '/@/pages/Comic/Origin/index.vue'
import ComicFavourite from '/@/pages/Comic/Favourite/index.vue'
import ComicHistory from '/@/pages/Comic/History/index.vue'
import ComicSearch from '/@/pages/Comic/Search/index.vue'

// import AppGameHelper from '/@/pages/Game/Helper.vue'
import GameHome from '/@/pages/Game/Home/index.vue'

import AppTools from '/@/pages/Tools/Home/index.vue'

import { toTitleCase } from '/@/utils/string'

interface CreateRoutes {
  routes: RouteRecordRaw[]
  helper?: any
  pageContainer?: boolean
}

function createRoutes(
  _module: string,
  { routes, helper, pageContainer }: CreateRoutes
) {
  const baseMeta = { module: _module, pageContainer, hideHelper: !helper }
  const newRoutes = routes.map(route => {
    const newRoute = Object.assign({}, route)
    newRoute.path = `${_module}/${route.path}`
    newRoute.meta = Object.assign({}, baseMeta, route.meta)
    if (helper && route.component) {
      delete newRoute.component
      newRoute.components = { helper, default: route.component }
    }
    return newRoute
  })

  newRoutes.unshift({
    path: _module,
    name: `App${toTitleCase(_module)}`,
    component: () => {},
    meta: Object.assign({}, baseMeta)
  })

  return newRoutes
}

const animeRoutes = createRoutes('anime', {
  pageContainer: true,
  helper: AppAnimeHelper,
  routes: [
    // 动画主页
    { path: 'home', name: 'AnimeHome', component: AnimeHome },
    // 新闻资讯
    { path: 'news', name: 'AnimeNews', component: AnimeNews },
    // 索引
    { path: 'index', name: 'AnimeIndex', component: AnimeIndex },
    // 新番表
    {
      path: 'bangumi/:code?',
      name: 'AnimeBangumi',
      component: AnimeBangumi,
      props: true
    },
    // 一周放送
    {
      path: 'weekbangumi',
      name: 'AnimeWeekBangumi',
      component: AnimeWeekBangumi,
      meta: { pageContainer: false }
    }
  ]
})

const comicRoutes = createRoutes('comic', {
  helper: AppComicHelper,
  routes: [
    { path: 'home', name: 'ComicHome', component: ComicHome },
    { path: 'favourite', name: 'ComicFavourite', component: ComicFavourite },
    { path: 'history', name: 'ComicHistory', component: ComicHistory },
    { path: 'search', name: 'ComicSearch', component: ComicSearch },
    {
      path: 'origin/:namespace',
      name: 'ComicOrigin',
      component: ComicOrigin,
      props: true
    }
  ]
})

const gameRoutes = createRoutes('game', {
  pageContainer: true,
  // helper: AppGameHelper,
  routes: [
    {
      path: 'home',
      name: 'GameHome',
      component: GameHome
    }
  ]
})

const routes = {
  path: '/main',
  name: 'MainApp',
  component: MainContainer,
  redirect: { name: 'AppHome' },
  children: [
    {
      path: 'home',
      name: 'AppHome',
      component: AppHome,
      meta: { module: 'home' }
    },
    // 动画
    ...animeRoutes,
    // 漫画
    ...comicRoutes,
    // 游戏
    ...gameRoutes,
    // 百宝箱
    {
      path: 'tools',
      name: 'AppTools',
      component: AppTools,
      meta: { module: 'tools', pageContainer: true }
    },
    { path: 'error', name: 'AppError', component: AppErrorPage }
  ]
}

export default routes
