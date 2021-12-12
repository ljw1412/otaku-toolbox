import { ipcMain, BrowserWindow } from 'electron'

const channel = 'window.message'

function bind(): void {
  ipcMain.on(channel, (e, type, data) => {
    console.log('[Tab]', type, data)

    const { tabId } = data
    let targetWindows = BrowserWindow.getAllWindows()
    if (tabId) {
      targetWindows = targetWindows.filter(win => win.id !== tabId)
    }

    targetWindows.forEach(win => {
      win.webContents.send(channel, type, data)
      // e.sender.sendToFrame(win.id, channel, type, data)
    })
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
