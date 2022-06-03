import { ipcMain } from 'electron'
import ruleRunner from './parser/index'
import { getRule, getRuleList, removeRule, setRule } from '../utils/storage'

const channel = 'data-center'

function bind(): void {
  ipcMain.handle(
    channel,
    async (e, action, { type, origin, config, rule, tabId }) => {
      if (action === 'listRules') {
        return await getRuleList(type)
      } else if (action === 'saveRule') {
        return await setRule(rule)
      } else if (action === 'removeRule') {
        return await removeRule(rule)
      } else if (action === 'showRule') {
        return await getRule(type, origin)
      } else if (action === 'runRule') {
        try {
          return await ruleRunner(rule, config)
        } catch (error) {
          console.error(error)
          return { list: [], pageTotal: -1, error }
        }
      }
    }
  )
}

function unbind(): void {
  ipcMain.removeHandler(channel)
}

export default { bind, unbind }
