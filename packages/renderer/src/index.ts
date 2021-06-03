import { createApp } from 'vue'
import App from '/@/App.vue'
import router from '/@/router'
import themeHelper from '/@/utils/theme'

import '/@/styles/preset/index.scss'

window.$theme = themeHelper

themeHelper.init()

createApp(App)
  .use(router)
  .mount('#app')
