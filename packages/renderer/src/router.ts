import { createRouter, createWebHistory } from 'vue-router'
import Home from '/@/pages/Home/index.vue'

const routes = [
  { path: '/', name: 'AppHome', component: Home, meta: { title: '首页' } },
  {
    path: '/anime',
    name: 'AppAnimeHome',
    component: () => import('/@/pages/Anime/Home/index.vue'),
    meta: { title: '动画' }
  },
  {
    path: '/setting',
    name: 'AppSetting',
    component: () => import('/@/pages/Setting/index.vue'),
    meta: { title: '设置' }
  }
]

export default createRouter({
  routes,
  history: createWebHistory()
})
