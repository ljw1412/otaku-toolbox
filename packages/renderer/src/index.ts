import { createApp } from 'vue'
import App from '/@/App.vue'
import router from '/@/router'
import AcgUI from '/@/../UI/index'
import AppInject from '/@/inject'
import ApiFetch from '/@/utils/api'
import { initContra } from '/@/utils/contra'
import '@ljw1412/ionicons-sprite'
import './dayjs'

import themeHelper from '/@/utils/theme'
import '/@/styles/index.scss'

themeHelper.init()
window.$theme = themeHelper
initContra()

const app = createApp(App)

Object.assign(app.config.globalProperties, ApiFetch)

app
  .use(router)
  .use(AcgUI)
  .use(AppInject)
  .mount('#app')
