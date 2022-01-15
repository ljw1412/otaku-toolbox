import SeparateContainer from '/@/containers/Separate.vue'
import AppErrorPage from '/@/pages/pageError/index.vue'
import AppSetting from '/@/pages/Setting/index.vue'
import AppTheme from '/@/pages/Theme/index.vue'
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
  // 系统设置
  {
    path: '/setting',
    name: 'AppSetting',
    component: AppSetting,
    meta: {
      separate: true,
      title: '系统设置',
      hideBackUp: true,
      minimizable: false,
      maximizable: false,
      hidable: true
    }
  },
  {
    path: '/tools/origin-manager',
    name: 'OriginManager',
    component: () => import('/@/pages/Tools/OriginManager/index.vue')
  },
  // 漫画详情页
  {
    path: '/comic/:namespace',
    name: 'ComicDetails',
    props: true,
    component: () => import('/@/pages/Comic/Details/index.vue'),
    meta: { title: '漫画详情页' }
  },
  // 带标题栏的界面
  {
    path: '/view',
    name: 'SeparateApp',
    component: SeparateContainer,
    meta: { separate: true },
    children: [
      { path: '/error', name: 'ViewError', component: AppErrorPage },

      // 应用主题
      {
        path: '/theme',
        name: 'AppTheme',
        component: AppTheme,
        meta: {
          title: '主题',
          hideBackUp: true,
          minimizable: false,
          maximizable: false,
          hidable: true
        }
      },
      {
        path: '/anime/bangumi/:code?',
        name: 'AnimeBangumiS',
        component: () => import('/@/pages/Anime/Bangumi/index.vue'),
        props: true,
        meta: { title: '新番表' }
      },
      {
        path: '/anime/wiki/:id',
        name: 'AnimeWiki',
        props: true,
        component: () => import('/@/pages/Anime/Wiki/index.vue'),
        meta: { title: '番剧百科' }
      },
      {
        path: '/comic/reader/:namespace',
        name: 'ComicReader',
        props: true,
        component: () => import('/@/pages/Comic/Reader/index.vue'),
        meta: { title: '漫画阅读器', hideBackUp: true }
      },
      {
        path: '/live',
        name: 'AppLive',
        component: () => import('/@/pages/Tools/Live/index.vue'),
        meta: { title: '直播', maximizable: false, hideBackUp: true }
      },
      {
        path: '/live/sigle-room/:id',
        name: 'SingleLiveRoom',
        props: true,
        component: () => import('/@/pages/Tools/Live/singleRoom.vue'),
        meta: { title: '直播间', hideBackUp: true }
      },
      {
        path: '/live/multi-room/:type',
        name: 'MultiLiveRoom',
        props: true,
        component: () => import('/@/pages/Tools/Live/multiRoom.vue'),
        meta: { title: '直播监控台', hideBackUp: true }
      }
    ]
  }
]

export default routes
