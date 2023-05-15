import SeparateContainer from '/@/containers/Separate.vue'
import AppErrorPage from '/@/pages/pageError/index.vue'
import AppSetting from '/@/pages/Setting/index.vue'
import AppTheme from '/@/pages/Theme/index.vue'
import AppExit from '/@/pages/Modal/ExitApp/index.vue'
import AppAbout from '/@/pages/Modal/About/index.vue'
import AppLogin from '/@/pages/Modal/Login/index.vue'

const Detail = () => import('/@/pages/Anime/Detail/index.vue')
const DetailOverview = () => import('/@/pages/Anime/Detail/Overview.vue')
const DetailCharacters = () => import('/@/pages/Anime/Detail/Characters.vue')
const DetailStaff = () => import('/@/pages/Anime/Detail/Staff.vue')
const DetailReviews = () => import('/@/pages/Anime/Detail/Reviews.vue')
const DetailSocial = () => import('/@/pages/Anime/Detail/Social.vue')
const VideoWatch = () => import('/@/pages/Anime/Watch/index.vue')

const routes = [
  // 内置浏览器
  {
    path: '/browser',
    name: 'AppBuiltInBrowser',
    component: SeparateContainer,
    meta: { hasView: true }
  },
  // 退出弹窗
  { path: '/exit-app', name: 'ExitApp', component: AppExit },
  {
    path: '/about',
    name: 'AppAbout',
    component: AppAbout,
    meta: {
      hidable: true
    }
  },
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
    path: '/login',
    name: 'AppLogin',
    component: AppLogin,
    meta: {
      separate: true,
      title: '登录',
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

  // 直播监控台
  {
    path: '/live/multi-room/:monitorId',
    name: 'MultiLiveRoom',
    props: true,
    component: () => import('/@/pages/Tools/Live/multiRoom.vue'),
    meta: { title: '直播监控台', hideBackUp: true, isMulti: true }
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
        path: '/detail/:id',
        name: 'BangumiDetail',
        props: true,
        component: Detail,
        meta: {
          title: '作品详情',
          pageContainer: false,
          transparentHeader: true
        },
        children: [
          {
            path: '',
            name: 'DetailOverview',
            component: DetailOverview,
            meta: { title: '概览' }
          },
          {
            path: 'characters',
            name: 'DetailCharacters',
            component: DetailCharacters,
            meta: { title: '角色' }
          },
          {
            path: 'staff',
            name: 'DetailStaff',
            component: DetailStaff,
            meta: { title: '制作人员' }
          },
          {
            path: 'reviews',
            name: 'DetailReviews',
            component: DetailReviews,
            meta: { title: '统计' }
          },
          {
            path: 'social',
            name: 'DetailSocial',
            component: DetailSocial,
            meta: { title: '讨论' }
          }
        ]
      },
      {
        path: '/watch/:id?',
        component: VideoWatch,
        name: 'VideoWatch',
        props: true,
        meta: { title: '视频播放', pageContainer: false, footer: false }
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
        path: '/ocr',
        name: 'AppOCR',
        component: () => import('/@/pages/Tools/OCR/index.vue'),
        meta: { title: 'OCR', hideBackUp: true }
      }
    ]
  }
]

export default routes
