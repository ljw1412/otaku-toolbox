import { RouteLocationRaw } from 'vue-router'
import { ipcInvoke, ipcSend } from '/@/utils/electron'
import * as logger from '/@/utils/logger'
import mGlobal from '/@/global'

export const config = {
  channel: 'config',
  /**
   * 获取app配置
   * @returns 配置
   */
  async get() {
    const action = 'getAppConfig'
    const result = await ipcInvoke(this.channel, action)
    logger.message(this.channel, action, result)
    return result
  },
  /**
   * 修改部分配置项
   * @param params
   */
  async set(params: Record<string, any>) {
    const action = 'setOption'
    const result = await ipcInvoke(this.channel, action, params)
    logger.message(this.channel, action, params, result)
    return result
  }
}

export const win = {
  channel: 'window.action',
  /**
   * 创建独立窗体
   * @param config 浏览器配置
   */
  create(config: NewBrowerConfig) {
    ipcSend(this.channel, 'createBrowser', config)
  },
  /**
   * 用内置或系统浏览器打开页面
   * @param url
   * @param config
   */
  open(
    url: string,
    config?: NewBrowerConfigBase & { url?: string; useSystemBrowser?: boolean }
  ) {
    const action =
      config && config.useSystemBrowser
        ? 'openSystemBrowser'
        : 'openInnerBrowser'
    ipcSend(this.channel, action, { ...config, url })
  },
  /**
   * 打开Vue路由页面窗体
   * @param to
   * @param appConfig
   * @returns
   */
  openVue(
    to: RouteLocationRaw,
    appConfig: Record<string, any> = { minWidth: 1280, minHeight: 720 }
  ) {
    if (typeof to === 'string') return
    const query = Object.assign(
      { app: 'otakutools', 'app-config': JSON.stringify(appConfig) },
      to.query
    )
    const mTo = Object.assign({}, to, { query })
    console.log(mTo)
    const route = mGlobal.router.resolve(mTo)
    window.open(route.href, '_blank')
  },
  /**
   * 打开程序系统内置的二级窗体
   * @param title 可选值: 退出程序 系统设置
   */
  openAppSystem(title: string) {
    ipcSend(this.channel, 'openAppSystemWindow', { title })
  },
  /**
   * 检测窗体是否存在（无论是否前台显示）
   * @param title
   */
  checkExists(title: string) {
    return ipcInvoke(this.channel, 'check-exists', { title })
  },
  /**
   * 操作当前窗体
   * @param action
   * @param mode
   */
  control(
    action: 'min' | 'max' | 'close' | 'hide' | 'toggleDevTools',
    mode?: string
  ) {
    ipcSend(this.channel, action, { mode })
  },
  /**
   * 操作其它窗体
   * @param action
   * @param title
   */
  controlOther(action: 'min' | 'max' | 'close' | 'hide', title: string) {
    ipcInvoke(this.channel, action, { title })
  }
}

export const ocr = {
  channel: 'ocr',
  recognize(params: {
    id: number
    lang: string
    image: any
    options: Record<string, any>
  }) {
    ipcSend(this.channel, 'recognize', params)
  },
  lang(action: string, data: ToolsOCR.LangItem) {
    ipcSend(this.channel, action, data)
  }
}
