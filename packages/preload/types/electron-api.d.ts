interface ElectronApi {
  readonly ipcRenderer: Readonly<Electron.IpcRenderer> & {
    on(
      channel: string,
      listener: (event: IpcRendererEvent, ...args: any[]) => void
    ): this
    off(
      channel: string,
      listener: (event: IpcRendererEvent, ...args: any[]) => void
    ): this
  }
  readonly versions: Readonly<NodeJS.ProcessVersions>
}

declare interface Window {
  tabId: number
  electron: Readonly<ElectronApi>
  electronRequire?: NodeRequire
}
