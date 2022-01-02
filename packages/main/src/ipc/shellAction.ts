import { app } from 'electron'
import path from 'path'
import { ipcMain, shell } from 'electron'

const env = import.meta.env
const DesktopDir = app.getPath('desktop')
const shortcutLinkPath = path.join(DesktopDir, env.VITE_APP_TITLE + '.lnk')
const appPath = app.getPath('exe')

const channel = 'shell'

function bind(): void {
  ipcMain.handle(channel, async (e, type, data) => {
    console.log(type)
    if (type === 'createAppShortcutLink') {
      return shell.writeShortcutLink(shortcutLinkPath, 'create', {
        target: appPath
      })
    }
  })
}

function unbind(): void {
  ipcMain.removeHandler(channel)
}

export default {
  bind,
  unbind
}
