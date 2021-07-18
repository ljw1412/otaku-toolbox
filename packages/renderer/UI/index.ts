import type { App } from 'vue'
import components from './packages'
import './styles/Tooltip'

export default function(app: App): void {
  components.forEach(component => {
    app.component(component.name,component)
  })
}
