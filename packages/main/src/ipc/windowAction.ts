import { ipcMain } from 'electron'
import { loadView } from '../views'

export default function(mainWindow?: Electron.BrowserWindow | null): void {
  if (!mainWindow) return
  ipcMain.on('window.action', (e, type, data) => {
    if (type === 'min') {
      mainWindow.minimize()
    } else if (type === 'close') {
      mainWindow.destroy()
    } else if (type === 'child') {
      console.log(type, data)
      loadView(mainWindow)
    }
  })
}
