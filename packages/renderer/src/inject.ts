import { App } from 'vue'
import { hyphenate } from '/@/utils/string'
import commonMixin from './mixins/common'

import * as directives from '/@/directives/index'
import AppAreaHeader from '/@/components/AppAreaHeader.vue'
import AppDialog from '/@/components/AppDialog.vue'
import AcgAreaHeader from '/@/components/AcgAreaHeader.vue'
import AcgGallery from '/@/components/AcgGallery.vue'
import AcgRatioDiv from '/@/components/AcgRatioDiv.vue'
import AcgApiResult from '/@/components/AcgApiResult.vue'

const components = [
  AppAreaHeader,
  AppDialog,
  AcgAreaHeader,
  AcgGallery,
  AcgRatioDiv,
  AcgApiResult
]

export default function(app: App) {
  app.mixin(commonMixin)

  Object.keys(directives).forEach(key => {
    app.directive(hyphenate(key), directives[key as keyof typeof directives])
  })
  components.forEach(component => {
    app.component(component.name, component)
  })
}
