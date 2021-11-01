import { BrowserWindow } from 'electron'

declare global {
  namespace NodeJS {
    interface Global {
      quickWindows: Record<string, BrowserWindow>
    }
  }
}
