import { createApp } from 'vue'
import App from '/@/App.vue'
import router from '/@/router'
import AcgUI from '/@/../UI/index'
import '@ljw1412/ionicons-sprite'

import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import themeHelper from '/@/utils/theme'

import '/@/styles/preset/index.scss'
import '/@/styles/other/common.css'

dayjs.extend(isoWeek)
themeHelper.init()

window.$theme = themeHelper
window.$dayjs = dayjs

const app = createApp(App)

app
  .use(router)
  .use(AcgUI)
  .mount('#app')
