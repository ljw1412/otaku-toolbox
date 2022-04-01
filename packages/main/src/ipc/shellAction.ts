import { app, dialog, ipcMain, shell } from 'electron'
import fsp from 'fs/promises'
import path from 'path'

const env = import.meta.env
const DesktopDir = app.getPath('desktop')
const shortcutLinkPath = path.join(DesktopDir, env.VITE_APP_TITLE + '.lnk')
const appPath = app.getPath('exe')

const channel = 'shell'

function bind(): void {
  ipcMain.handle(channel, async (e, type, data) => {
    console.log('[shellAction]', type, data)
    if (type === 'createAppShortcutLink') {
      return shell.writeShortcutLink(shortcutLinkPath, 'create', {
        target: appPath
      })
    } else if (type === 'saveFile') {
      try {
        const { content = '', filters } = data
        const result = await dialog.showSaveDialog({
          title: '保存文件',
          filters
        })
        if (!result.canceled && result.filePath) {
          await fsp.writeFile(result.filePath, content)
        }
        return result
      } catch (error) {
        return { err: true, error }
      }
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
