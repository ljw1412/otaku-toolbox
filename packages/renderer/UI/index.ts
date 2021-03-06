import { App } from 'vue'
import components from './packages'
import * as directives from './directives'
import { hyphenate } from '/@/utils/string'

import './styles/index.scss'

export default function(app: App): void {
  components.forEach(component => {
    app.component(component.name, component)
  })
  Object.keys(directives).forEach(key => {
    app.directive(hyphenate(key), directives[key as keyof typeof directives])
  })
}
