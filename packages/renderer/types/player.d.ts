declare module 'xgplayer-hls.js' {
  import Player from 'xgplayer'
  class HlsPlayer extends Player {}
}

declare namespace LivePlayer {
  import { DanmuCommentOptions } from 'xgplayer'
  type BLiveDanmaku = BLiveInfoDanmaku | BLiveMessageDanmaku | BLiveGiftDanmaku

  interface BLiveInfoDanmaku {
    type: 'info'
    message: string
    stay: number
  }

  interface BLiveSCMessageDanmaku {
    type: 'sc'
    uid: number
    uname: string
    message: string
    value: number
  }

  interface BLiveMessageDanmaku {
    type: 'message'
    uid: number
    uname: string
    message: string
    ts: number
    ct: string
    isAnchor: boolean
    isOwner: boolean
  }

  interface BLiveGiftDanmaku {
    type: 'gift'
    uid: number
    uname: string
    action: string
    giftName: string
    num: number
  }

  interface XGDanmaku extends DanmuCommentOptions {}
}
