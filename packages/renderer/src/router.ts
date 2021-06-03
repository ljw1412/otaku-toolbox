import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '/@/pages/Home/index.vue'

const routes = [
  { path: '/', name: 'AppHome', component: Home },
  {
    path: '/setting',
    name: 'AppSetting',
    component: () => import('/@/pages/Setting/index.vue')
  } // Lazy load route component
]

export default createRouter({
  routes,
  history: createWebHashHistory()
})
