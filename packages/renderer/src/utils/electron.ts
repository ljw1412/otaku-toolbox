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
    console.log('!!!!!')

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
