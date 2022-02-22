import { BrowserWindow } from 'electron'

declare global {
  type IpcListener = (event: Electron.IpcMainEvent, ...args: any[]) => void
  type IpcInvokeListener = (
    event: Electron.IpcMainInvokeEvent,
    ...args: any[]
  ) => void

  namespace NodeJS {
    interface Global {
      quickWindows: Record<string, BrowserWindow>
    }
  }
}
