import { ipcMain, BrowserWindow } from 'electron'

const channel = 'window.message'

const listener: IpcListener = (e, type, data) => {
  console.log('[messageAction]', type, data)

  const { tabId } = data
  let targetWindows = BrowserWindow.getAllWindows()
  if (tabId) {
    targetWindows = targetWindows.filter(win => win.id !== tabId)
  }

  targetWindows.forEach(win => {
    win.webContents.send(channel, type, data)
    // e.sender.sendToFrame(win.id, channel, type, data)
  })
}

function bind(): void {
  ipcMain.on(channel, listener)
}

function unbind(): void {
  ipcMain.off(channel, listener)
  console.log(`${channel} 结束监听`)
}

export default {
  bind,
  unbind
}
