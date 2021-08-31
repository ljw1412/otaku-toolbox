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
      component: () => import('/@/pages/Home/index.vue')
    }
  ]
}

export default routes
