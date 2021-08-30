import { ipcMain } from 'electron'
import { getConfig } from '../utils/storage'

const channel = 'config'

function bind(): void {
  ipcMain.handle(channel, async (e, type) => {
    if (type === 'getAppConfig') {
      const config = getConfig()
      return config
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
