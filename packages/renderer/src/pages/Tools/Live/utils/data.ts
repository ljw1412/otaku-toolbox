export function defaultLiveConfig(isMulti = false): LiveRoomConfig {
  return {
    qn: 150,
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
  const monitor: LiveMonitor = {
    id: +new Date(),
    name: '监控台',
    mode: 0,
    roomList: [],
    roomConfigList: []
  }
  for (let i = 0; i < 10; i++) {
    monitor.roomList.push({} as LiveInfo)
    monitor.roomConfigList.push(defaultLiveConfig(true))
  }
  return monitor
}

const modeAndCount = [2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 6, 6, 8, 8, 8, 9]

export function getModeLiveCount(mode: number) {
  return modeAndCount[mode]
}
