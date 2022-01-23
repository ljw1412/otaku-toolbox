import Player from 'xgplayer'
import { formatDuration } from '/@/utils/date'
const { createDom } = Player.util
import './live-time.css'

export default {
  name: 'live-time',
  method(player: Player) {
    const container = createDom('live-time', '', {}, 'player-live-time')
    const time = createDom('span', '00:00', {}, 'current-live-time')
    const tips = createDom(
      'xg-tips',
      '<span class="xgplayer-tip-playnext">直播持续时间</span>',
      {},
      'xgplayer-tips'
    )
    container.appendChild(time)
    container.appendChild(tips)

    const timer = window.setInterval(() => {
      const duration = formatDuration(
        // @ts-ignore
        +new Date() / 1000 - (player.config.liveTime || +new Date() / 1000)
      )
      time.innerHTML = duration
    }, 1000)

    player.once('ready', () => {
      if (player.controls) {
        player.controls.appendChild(container)
      }
    })

    function onDestroy() {
      clearInterval(timer)
      player.off('destroy', onDestroy)
    }
    player.once('destroy', onDestroy)
  }
}
