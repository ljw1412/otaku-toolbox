import Player from 'xgplayer'
// import ReloadPlugin from './reload'
import LiveTimePlugin from './live-time'

const plugins = [LiveTimePlugin] // [ReloadPlugin,LiveTimePlugin]

export default function(Player: Player) {
  plugins.forEach(plugin => {
    // @ts-ignore
    Player.install(plugin.name, plugin.method)
  })
}
