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
      component: () => import('/@/pages/Home/index.vue'),
      meta: { module: 'home' }
    },
    {
      path: 'anime',
      name: 'AppAnime',
      component: () => import('/@/pages/Anime/index.vue'),
      meta: { module: 'anime' },
      children: []
    },
    {
      path: 'comic',
      name: 'AppComic',
      component: () => import('/@/pages/Comic/index.vue'),
      meta: { module: 'comic' },
      children: []
    },
    {
      path: 'game',
      name: 'AppGame',
      component: () => import('/@/pages/Game/index.vue'),
      meta: { module: 'game' },
      children: []
    }
  ]
}

export default routes
