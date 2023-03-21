import { Router } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
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
    $global: typeof mGlobal & {
      router: Router
      IDB: {
        opend: boolean
        error: boolean
      }
    }
    $message: typeof Message
    $modal: typeof Modal

    // global mixin
    isLaptopSize: boolean
    isMobileSize: boolean
    isSecretMode: boolean
    hourSystem: 24 | 30
    isLogined: boolean
    user: BaseUserInfo
    getLogoIcon: typeof getLogoIcon
    compressImage: typeof compressImage
    formatDateTime: (date: string | Date, formater?: string) => string
  }
}

export {}
