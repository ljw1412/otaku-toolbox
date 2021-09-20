import MainContainer from '/@/containers/Main.vue'

const routes = {
  path: '/main',
  name: 'MainApp',
  component: MainContainer,
  redirect: { name: 'AppHome' },
  children: [
    {
      path: 'home',
      name: 'AppHome',
      component: import('/@/pages/Home/index.vue'),
      meta: { module: 'home' }
    },
    // 动画
    {
      path: 'anime',
      name: 'AppAnime',
      component: import('/@/pages/Anime/index.vue'),
      meta: { module: 'anime' },
      redirect: { name: 'AnimeHome' },
      children: [
        // 动画主页
        {
          path: 'home',
          name: 'AnimeHome',
          component: import('/@/pages/Anime/Home/index.vue')
        },
        // 新闻资讯
        {
          path: 'news',
          name: 'AnimeNews',
          component: import('/@/pages/Anime/News/index.vue')
        },
        // 新番表
        {
          path: 'bangumi',
          name: 'AnimeBangumi',
          component: import('/@/pages/Anime/Bangumi/index.vue')
        }
      ]
    },
    {
      path: 'comic',
      name: 'AppComic',
      component: import('/@/pages/Comic/index.vue'),
      meta: { module: 'comic' },
      children: []
    },
    {
      path: 'game',
      name: 'AppGame',
      component: import('/@/pages/Game/index.vue'),
      meta: { module: 'game' },
      children: []
    }
  ]
}

export default routes
