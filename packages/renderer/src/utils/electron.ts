import { IpcRendererEvent } from 'electron'

export function useElectron(): Readonly<ElectronApi> {
  return window.electron
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
    if (data.tabId === window.tabId) {
      listener(event, type, data)
    }
  })
}

export function ipcOff(
  channel: string,
  listener: (event: IpcRendererEvent, ...args: any[]) => void = function() {}
) {
  const { ipcRenderer } = useElectron()
  ipcRenderer.off(channel, listener)
}

export function createBrowser(config: NewBrowerConfig) {
  ipcSend('window.action', 'createBrowser', config)
}

export function createBuiltInBrowser(
  url: string,
  config?: Record<string, any>
) {
  ipcSend('window.action', 'built-in-browser', { ...config, url })
}

export function getAppConfig() {
  const { ipcRenderer } = useElectron()
  return ipcRenderer.invoke('config', 'getAppConfig')
}
