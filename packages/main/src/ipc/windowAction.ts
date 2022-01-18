import { ipcMain, BrowserWindow } from 'electron'
import { openExternal } from '../utils/newWindow'
import {
  createBrowser,
  createBuiltInBrowser,
  openAppSystemWindow,
  toggleDevTools
} from '../window'

const channel = 'window.action'

function closeApp(win: BrowserWindow, mode: string) {
  if (mode === 'main-close') {
    const parentWin = win.getParentWindow()
    if (parentWin) {
      win.close()
      parentWin.close()
      return
    }
  } else {
    win.close()
  }
}

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
    } else if (type === 'max') {
      if (mWin.isMaximized()) {
        mWin.unmaximize()
      } else {
        mWin.maximize()
      }
    } else if (type === 'close') {
      closeApp(mWin, data.mode)
    } else if (type === 'hide') {
      mWin.hide()
    } else if (type === 'built-in-browser') {
      if (typeof data === 'object' && data.url) {
        createBuiltInBrowser(data)
      }
    } else if (type === 'createBrowser') {
      if (typeof data === 'object' && data.url) {
        createBrowser(data)
      }
    } else if (type === 'openAppSystemWindow') {
      if (typeof data === 'object' && data.title) {
        openAppSystemWindow(data)
      }
    } else if (type === 'openSystemBrowser') {
      if (typeof data === 'object' && data.url) {
        openExternal(data.url)
      }
    } else if (type === 'toggleDevTools') {
      toggleDevTools(mWin)
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
