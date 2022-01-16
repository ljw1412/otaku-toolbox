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
