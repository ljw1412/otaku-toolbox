interface ElectronApi {
  readonly ipcRenderer: Readonly<Electron.IpcRenderer>
  readonly versions: Readonly<NodeJS.ProcessVersions>
}

declare interface Window {
  tabId: number
  electron: Readonly<ElectronApi>
  electronRequire?: NodeRequire
}
