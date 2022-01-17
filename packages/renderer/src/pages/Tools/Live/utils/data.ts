export function defaultLiveConfig(isMulti = false): LiveRoomConfig {
  return {
    volume: 0.6,
    showDanmaku: true,
    danmaku: {
      aside: !isMulti,
      showBoard: isMulti,
      bg: '#000000',
      opacity: 50,
      blur: 2,
      x: 0,
      y: 240
    }
  }
}

export function defaultMonitor(): LiveMonitor {
  return {
    id: +new Date(),
    mode: 0,
    roomList: [],
    roomConfigList: [{} as LiveRoomConfig]
  }
}

const modeAndCount = [2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 6, 6, 8, 8, 8, 9]

export function getModeLiveCount(mode: number) {
  return modeAndCount[mode]
}
