export function useElectron(): Readonly<ElectronApi> {
  return window.electron
}

export function ipcSend(
  action: string,
  type: string,
  data: Record<string, any> = {}
) {
  const { ipcRenderer } = useElectron()
  data.tabId = window.tabId
  ipcRenderer.send(action, type, data)
}
