import SeparateContainer from '/@/containers/Separate.vue'

const routes = [
  {
    path: '/view',
    name: 'SeparateApp',
    component: SeparateContainer,
    meta: { hasView: true },
    children: [
      {
        path: 'setting',
        name: 'AppSetting',
        component: () => import('/@/pages/Setting/index.vue'),
        meta: { title: '设置', minimizable: false, maximizable: false }
      }
    ]
  }
]

export default routes
