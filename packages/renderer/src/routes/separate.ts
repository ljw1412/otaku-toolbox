import SeparateContainer from '/@/containers/Separate.vue'

const routes = [
  // 内置浏览器
  {
    path: '/browser',
    name: 'AppBuiltInBrowser',
    component: SeparateContainer,
    meta: { hasView: true }
  },
  // 带标题栏的界面
  {
    path: '/view',
    name: 'SeparateApp',
    component: SeparateContainer,
    children: [
      // 系统设置
      {
        path: 'setting',
        name: 'AppSetting',
        component: () => import('/@/pages/Setting/index.vue'),
        meta: { title: '系统设置', minimizable: false, maximizable: false }
      },
      // 应用主题
      {
        path: '/theme',
        name: 'AppTheme',
        component: () => import('/@/pages/Theme/index.vue'),
        meta: { title: '主题', minimizable: false, maximizable: false }
      }
    ]
  }
]

export default routes
