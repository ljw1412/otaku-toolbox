import SeparateContainer from '/@/containers/Separate.vue'
import AppSetting from '/@/pages/Setting/index.vue'
import AppTheme from '/@/pages/Theme/index.vue'
import AnimeBangumiS from '/@/pages/Anime/Bangumi/index.vue'
import ExitApp from '/@/pages/Modal/ExitApp/index.vue'

const routes = [
  // 内置浏览器
  {
    path: '/browser',
    name: 'AppBuiltInBrowser',
    component: SeparateContainer,
    meta: { hasView: true }
  },
  // 退出弹窗
  { path: '/exit-app', name: 'ExitApp', component: ExitApp },
  // 带标题栏的界面
  {
    path: '/view',
    name: 'SeparateApp',
    component: SeparateContainer,
    meta: { separate: true },
    children: [
      // 系统设置
      {
        path: 'setting',
        name: 'AppSetting',
        component: AppSetting,
        meta: { title: '系统设置', minimizable: false, maximizable: false }
      },
      // 应用主题
      {
        path: '/theme',
        name: 'AppTheme',
        component: AppTheme,
        meta: { title: '主题', minimizable: false, maximizable: false }
      },
      {
        path: '/anime/bangumi',
        name: 'AnimeBangumiS',
        component: AnimeBangumiS,
        meta: { title: '新番表' }
      }
    ]
  }
]

export default routes
