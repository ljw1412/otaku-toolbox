import { createRouter, createWebHistory } from 'vue-router'
import MainWrapper from '/@/wrappers/MainWrapper.vue'
import TitleWrapper from '/@/wrappers/TitleWrapper.vue'
import Home from '/@/pages/Home/index.vue'

const routes = [
  { path: '/', redirect: { name: 'AppHome' } },
  {
    path: '/main',
    name: 'MainApp',
    component: MainWrapper,
    children: [
      {
        path: '',
        name: 'AppHome',
        component: Home,
        meta: { title: '首页', module: 'home' }
      },
      {
        path: 'anime-home',
        name: 'AppAnimeHome',
        component: () => import('/@/pages/Anime/Home/index.vue'),
        meta: { title: '动画-首页', module: 'anime' }
      },
      {
        path: 'anime-index',
        name: 'AppAnimeIndex',
        component: () => import('/@/pages/Anime/Index/index.vue'),
        meta: { title: '动画-索引', module: 'anime' }
      },
      {
        path: 'setting',
        name: 'AppSetting',
        component: () => import('/@/pages/Setting/index.vue'),
        meta: { title: '设置' }
      }
    ]
  },
  { path: '/view', name: 'TitleApp', component: TitleWrapper }
]

export default createRouter({
  routes,
  history: createWebHistory()
})
