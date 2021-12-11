import { Message } from '@arco-design/web-vue'
import mGlobal from '/@/global/index'
import API from '/@/apis/index'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    apiGet: MyFetch
    apiPost: MyFetch
    apiPut: MyFetch
    apiDelete: MyFetch
    $dayjs: dayjsFn
    $theme: ThemeHelper
    $API: typeof API
    $global: typeof mGlobal
    $imagePreview: (current: string, srcList: string[]) => void
    $message: typeof Message

    // global mixin
    isLaptopSize: boolean
    isMobileSize: boolean
    hourSystem: 24 | 30
  }
}

export {}
