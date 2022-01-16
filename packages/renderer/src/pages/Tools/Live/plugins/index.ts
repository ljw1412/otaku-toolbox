import Player from 'xgplayer'
import ReloadPlugin from './reload'

const plugins = [ReloadPlugin]

export default function(Player: Player) {
  plugins.forEach(plugin => {
    // @ts-ignore
    Player.install(plugin.name, plugin.method)
  })
}
