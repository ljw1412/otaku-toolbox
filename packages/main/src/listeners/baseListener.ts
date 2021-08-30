import { BrowserWindow, IpcMainEvent } from 'electron'

export default function baseListerner(win: BrowserWindow) {
  win.on('ready-to-show', () => {
    win.webContents.executeJavaScript(`window.tabId=${win.id}`)
  })

  win.on('maximize', (e: IpcMainEvent) => {
    console.log('maximize')

    e.sender.send('windowx', 'max', { isMaximized: true, tabId: e.sender.id })
  })

  win.on('unmaximize', (e: IpcMainEvent) => {
    console.log('unmaximize')

    e.sender.send('windowx', 'max', { isMaximized: false, tabId: e.sender.id })
  })
}
