import { ipcMain } from 'electron'
import ruleRunner from './parser'

import anime_dmzj from './rules/anime/dmzj.json'
import comic_dmzj from './rules/comic/dmzj.json'
import game_dmzj from './rules/game/dmzj.json'
import game_ali213 from './rules/game/ali213.json'
import game_3dm from './rules/game/3dm.json'

const typeRuleMap = {
  'anime-news': {
    dmzj: anime_dmzj
  },
  'comic-news': {
    dmzj: comic_dmzj
  },
  'game-news': {
    dmzj: game_dmzj,
    ali213: game_ali213,
    '3dm': game_3dm
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
