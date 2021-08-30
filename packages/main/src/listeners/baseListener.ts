import { BrowserWindow, IpcMainEvent } from 'electron'

export default function baseListerner(win: BrowserWindow) {
  win.on('ready-to-show', () => {
    win.webContents.executeJavaScript(`window.tabId=${win.id}`)
  })

  win.on('maximize', (e: IpcMainEvent) => {
    e.sender.send('windowx', 'max', { isMaximized: true, tabId: e.sender.id })
  })

  win.on('unmaximize', (e: IpcMainEvent) => {
    e.sender.send('windowx', 'max', { isMaximized: false, tabId: e.sender.id })
  })
}
