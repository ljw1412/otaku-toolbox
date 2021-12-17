import { ipcMain } from 'electron'
import ruleRunner from './parser'
import { getRule, getRuleList, setRule } from '../utils/storage'

const channel = 'data-center'

function bind(): void {
  ipcMain.handle(channel, async (e, action, { type, origin, config, rule }) => {
    if (action === 'listRules') {
      return await getRuleList(type)
    } else if (action === 'saveRule') {
      return await setRule(rule)
    } else if (action === 'fetch') {
      const rule = await getRule(type, origin)
      if (!rule.name) {
        return { list: [], pageTotal: -1 }
      }
      return await ruleRunner(rule, config)
    }
  })
}

function unbind(): void {
  ipcMain.removeHandler(channel)
}

export default { bind, unbind }
