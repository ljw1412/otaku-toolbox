interface ElectronApi {
  readonly ipcRenderer: Readonly<Electron.IpcRenderer>
  readonly versions: Readonly<NodeJS.ProcessVersions>
}

declare interface Window {
  electron: Readonly<ElectronApi>
  electronRequire?: NodeRequire
}
