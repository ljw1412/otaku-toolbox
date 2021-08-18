import { ipcMain, BrowserWindow } from 'electron'
import { loadView } from '../views'

const channel = 'window.action'

function bind(): void {
  ipcMain.on(channel, (e, type, data) => {
    const { tabId } = data
    const mWin = BrowserWindow.fromId(tabId)
    console.log('[Tab]', type, tabId)

    if (!mWin) {
      console.log('[指令错误]', type, data)
      return
    }

    if (type === 'min') {
      mWin.minimize()
    } else if (type === 'close') {
      mWin.destroy()
    } else if (type === 'child') {
      if (typeof data === 'object' && data.url) {
        loadView(data)
      }
    }
  })
}

function unbind(): void {
  ipcMain.off(channel, () => {
    console.log(`${channel} 结束监听`)
  })
}

export default {
  bind,
  unbind
}
