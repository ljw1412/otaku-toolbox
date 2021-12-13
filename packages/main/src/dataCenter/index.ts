import { ipcMain } from 'electron'
import ruleRunner from './parser'

import dmzj from './rules/anime/dmzj.json'

const channel = 'data-center'

function bind(): void {
  ipcMain.handle(channel, async (e, origin, config) => {
    if (origin === 'dmzj') {
      return await ruleRunner(dmzj as DataCenter.Rule, config)
    }
    return { list: [], pageTotal: -1 }
  })
}

function unbind(): void {
  ipcMain.removeHandler(channel)
}

export default { bind, unbind }
