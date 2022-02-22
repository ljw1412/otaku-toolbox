import { IpcRendererEvent } from 'electron'
import { RouteLocationRaw } from 'vue-router'
import mGlobal from '/@/global'

const CHANNEL_WINDOW_ACTION = 'window.action'
const CHANNEL_APP_CONFIG = 'config'

export function useElectron(): Readonly<ElectronApi> {
  return window.electron
}

export function ipcInvoke(
  channel: string,
  type: string,
  data: Record<string, any> = {}
) {
  const { ipcRenderer } = useElectron()
  data.tabId = window.tabId
  return ipcRenderer.invoke(channel, type, data)
}

export function ipcSend(
  channel: string,
  type: string,
  data: Record<string, any> = {}
) {
  const { ipcRenderer } = useElectron()
  data.tabId = window.tabId
  ipcRenderer.send(channel, type, data)
}

export function ipcOn(
  channel: string,
  listener: (
    event: IpcRendererEvent,
    type: string,
    data: Record<string, any>
  ) => void
) {
  const { ipcRenderer } = useElectron()

  ipcRenderer.on(channel, function(
    event: IpcRendererEvent,
    type: string,
    data: Record<string, any> = {}
  ) {
    console.log(type, data)

    listener(event, type, data)
  })
}

export function ipcOff(
  channel: string,
  listener: (event: IpcRendererEvent, ...args: any[]) => void = function() {}
) {
  const { ipcRenderer } = useElectron()
  ipcRenderer.off(channel, listener)
}

export function checkWinExists(title: string) {
  return ipcInvoke(CHANNEL_WINDOW_ACTION, 'check-exists', { title })
}

export function openAppSystemWindow(title: string) {
  ipcSend(CHANNEL_WINDOW_ACTION, 'openAppSystemWindow', { title })
}

/**
 * 创建独立窗体
 * @param config 浏览器配置
 */
export function createBrowser(config: NewBrowerConfig) {
  ipcSend(CHANNEL_WINDOW_ACTION, 'createBrowser', config)
}

/**
 * 创建内置浏览器
 * @param url 地址
 * @param config 参数
 */
export function createBuiltInBrowser(
  url: string,
  config?: Record<string, any>
) {
  ipcSend(CHANNEL_WINDOW_ACTION, 'built-in-browser', { ...config, url })
}

/**
 * 使用系统默认浏览器打开
 * @param url
 */
export function openSystemBrower(url: string) {
  ipcSend(CHANNEL_WINDOW_ACTION, 'openSystemBrowser', { url })
}

/**
 * 打开Vue路由页面
 * @param to
 * @param appConfig
 * @returns
 */
export function openVueView(
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
}

/**
 * 获取app配置
 * @returns 配置
 */
export function getAppConfig() {
  return ipcInvoke(CHANNEL_APP_CONFIG, 'getAppConfig')
}

/**
 * 修改单个配置项
 * @param params
 */
export function setAppConfigOption(data: Record<string, any>) {
  return ipcInvoke(CHANNEL_APP_CONFIG, 'setOption', data)
}
