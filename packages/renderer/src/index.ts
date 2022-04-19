import { createApp } from 'vue'
import App from '/@/App.vue'
import router, { routerErrorhandler } from '/@/router'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'

import AcgUI from '/@/../UI/index'
import AppInject from '/@/inject'
import ApiFetch from '/@/utils/api'
import API from '/@/apis/index'
import mGlobal from './global/index'
import { initContra } from '/@/utils/contra'
import { imagePreview } from '/@/utils/image'

import dayjs from './dayjs'
import './IDB/index'
import '@ljw1412/ionicons-sprite'

import themeHelper from '/@/utils/theme'
import '/@/styles/index.scss'
import '@arco-design/web-vue/dist/arco.css'

themeHelper.init()
window.$theme = themeHelper
initContra()

const app = createApp(App)

Object.assign(app.config.globalProperties, ApiFetch, {
  $theme: themeHelper,
  $dayjs: dayjs,
  $imagePreview: imagePreview,
  $API: API,
  $global: mGlobal
})

if (import.meta.env.MODE === 'development') {
  window.$API = API
}

app
  .use(router)
  .use(ArcoVue)
  .use(ArcoVueIcon)
  .use(AcgUI)
  .use(AppInject)
  .mount('#app')

app.config.errorHandler = (err, vm, info) => {
  console.error(err)
  if (routerErrorhandler(err, vm, info)) return
}
