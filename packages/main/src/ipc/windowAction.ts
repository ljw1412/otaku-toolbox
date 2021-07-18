import { ipcMain } from 'electron'

export default function(mainWindow?: Electron.BrowserWindow | null): void {
  if (!mainWindow) return
  ipcMain.on('window.action', (e, type) => {
    if (type === 'min') {
      mainWindow.minimize()
    } else if (type === 'close') {
      mainWindow.destroy()
    }
  })
}
