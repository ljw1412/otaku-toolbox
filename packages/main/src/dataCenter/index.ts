import { ipcMain } from 'electron'
import ruleRunner from './parser'

import anime_dmzj from './rules/anime/dmzj.json'
import comic_dmzj from './rules/comic/dmzj.json'
import game_dmzj from './rules/game/dmzj.json'

const typeRuleMap = {
  'anime-news': {
    dmzj: anime_dmzj
  },
  'comic-news': {
    dmzj: comic_dmzj
  },
  'game-news': {
    dmzj: game_dmzj
  }
} as Record<string, Record<string, DataCenter.Rule>>

const channel = 'data-center'

function bind(): void {
  ipcMain.handle(channel, async (e, type, origin, config) => {
    const typeRules = typeRuleMap[type]
    if (typeRules && typeRules[origin]) {
      return await ruleRunner(typeRules[origin], config)
    }

    return { list: [], pageTotal: -1 }
  })
}

function unbind(): void {
  ipcMain.removeHandler(channel)
}

export default { bind, unbind }
