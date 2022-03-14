import { ipcMain } from 'electron'
import { getConfig, setConfig } from '../utils/storage'

const channel = 'config'

function bind(): void {
  ipcMain.handle(channel, async (e, type, data) => {
    if (type === 'getAppConfig') {
      const config = getConfig()
      return config
    } else if (type === 'setOption') {
      setConfig(data)
      return Object.assign({ success: true }, data)
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
