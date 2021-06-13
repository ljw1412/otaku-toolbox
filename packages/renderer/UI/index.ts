import type { App } from 'vue'
import Icon from './Icon.vue'

const components = [Icon]

export default function(app: App): void {
  components.forEach(component => {
    app.component(component.name,component)
  })
}
