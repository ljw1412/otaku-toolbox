import * as Vue from 'vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import AcgUI from '/@/../UI/index'
import AppInject from '/@/inject'
import * as DataCenter from '/@/apis/DataCenter'

window.usePlugin = () => {
  return {
    Vue,
    appUse(app: Vue.App) {
      return app
        .use(ArcoVue)
        .use(ArcoVueIcon)
        .use(AcgUI)
        .use(AppInject)
    },
    appMount(app: Vue.App) {
      app.mount('#plugin-main')
    },
    appUnMount(app: Vue.App) {
      app.unmount()
    },
    DataCenter
  }
}
