import { App } from 'vue'
import { hyphenate } from '/@/utils/string'
import * as directives from '/@/directives/index'
import AppAreaHeader from '/@/components/AppAreaHeader.vue'

const components = [AppAreaHeader]

export default function(app: App) {
  Object.keys(directives).forEach(key => {
    app.directive(hyphenate(key), directives[key as keyof typeof directives])
  })
  components.forEach(component => {
    app.component(component.name, component)
  })
}
