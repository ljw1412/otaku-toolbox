import { createApp } from 'vue'
import App from '/@/App.vue'
import router from '/@/router'
import themeHelper from '/@/utils/theme'
import UI from '../UI/index'
import '@ljw1412/ionicons-sprite'

import '/@/styles/preset/index.scss'

window.$theme = themeHelper

themeHelper.init()

createApp(App)
  .use(router)
  .use(UI)
  .mount('#app')
