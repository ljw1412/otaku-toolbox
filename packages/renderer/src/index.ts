import { createApp } from 'vue'
import * as dayjs from 'dayjs'
import * as isoWeek from 'dayjs/plugin/isoWeek'
import App from '/@/App.vue'
import router from '/@/router'
import themeHelper from '/@/utils/theme'
import UI from '../UI/index'
import '@ljw1412/ionicons-sprite'

import '/@/styles/preset/index.scss'
import '/@/styles/other/common.css'

window.$theme = themeHelper
window.$dayjs = dayjs

dayjs.extend(isoWeek)

themeHelper.init()

const app = createApp(App)

app
  .use(router)
  .use(UI)
  .mount('#app')
