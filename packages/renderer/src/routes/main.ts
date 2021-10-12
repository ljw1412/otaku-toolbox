import MainContainer from '/@/containers/Main.vue'
import AppHome from '/@/pages/Home/index.vue'

import AppAnime from '/@/pages/Anime/index.vue'
import AnimeHome from '/@/pages/Anime/Home/index.vue'
import AnimeIndex from '/@/pages/Anime/Index/index.vue'
import AnimeNews from '/@/pages/Anime/News/index.vue'
import AnimeBangumi from '/@/pages/Anime/Bangumi/index.vue'

import AppComic from '/@/pages/Comic/index.vue'
import ComicHome from '/@/pages/Comic/Home/index.vue'
import ComicOrigin from '/@/pages/Comic/Origin/index.vue'
import ComicFavourite from '/@/pages/Comic/Favourite/index.vue'
import ComicHistory from '/@/pages/Comic/History/index.vue'
import ComicSearch from '/@/pages/Comic/Search/index.vue'
import ComicSetting from '/@/pages/Comic/Setting/index.vue'

import AppGame from '/@/pages/Game/index.vue'
import GameHome from '/@/pages/Game/Home/index.vue'

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
      meta: { module: 'home', scrollEl: '#app-main' }
    },
    // 动画
    {
      path: 'anime',
      name: 'AppAnime',
      component: AppAnime,
      meta: { module: 'anime' },
      children: [
        // 动画主页
        {
          path: 'home',
          name: 'AnimeHome',
          component: AnimeHome
        },
        // 新闻资讯
        {
          path: 'news',
          name: 'AnimeNews',
          component: AnimeNews
        },
        {
          path: 'index',
          name: 'AnimeIndex',
          component: AnimeIndex
        },
        // 新番表
        {
          path: 'bangumi',
          name: 'AnimeBangumi',
          component: AnimeBangumi
        }
      ]
    },
    {
      path: 'comic',
      name: 'AppComic',
      component: AppComic,
      meta: { module: 'comic' },
      children: [
        {
          path: 'home',
          name: 'ComicHome',
          component: ComicHome
        },
        {
          path: 'favourite',
          name: 'ComicFavourite',
          component: ComicFavourite
        },
        {
          path: 'history',
          name: 'ComicHistory',
          component: ComicHistory
        },
        {
          path: 'search',
          name: 'ComicSearch',
          component: ComicSearch
        },
        {
          path: 'setting',
          name: 'ComicSetting',
          component: ComicSetting
        },
        {
          path: 'origin/:id',
          name: 'ComicOrigin',
          component: ComicOrigin,
          props: true
        }
      ]
    },
    {
      path: 'game',
      name: 'AppGame',
      component: AppGame,
      meta: { module: 'game' },
      children: [
        {
          path: 'home',
          name: 'GameHome',
          component: GameHome
        }
      ]
    }
  ]
}

export default routes
