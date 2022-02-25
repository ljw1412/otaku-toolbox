import { ipcMain, BrowserWindow } from 'electron'
import { openExternal } from '../utils/newWindow'
import {
  createBrowser,
  createBuiltInBrowser,
  getWindowByTitle,
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

const listener: IpcListener = (e, type, data) => {
  const { tabId } = data
  const mWin = BrowserWindow.fromId(tabId)
  console.log('[windowAction]', type, tabId)

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
}

const handleListener: IpcInvokeListener = (e, type, data) => {
  const { title } = data
  if (type === 'check-exists') {
    return !!getWindowByTitle(title)
  } else if (type === 'close') {
    const win = getWindowByTitle(title)
    if (win) win.close()
    return !!win
  }
}

function bind(): void {
  ipcMain.on(channel, listener)
  ipcMain.handle(channel, handleListener)
}

function unbind(): void {
  ipcMain.off(channel, listener)
  ipcMain.removeHandler(channel)
  console.log(`${channel} 结束监听`)
}

export default {
  bind,
  unbind
}
