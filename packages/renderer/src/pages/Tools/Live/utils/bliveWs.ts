// 改包内引用 'buffer' -> 'buffer/' | 'events' -> 'events/events'
import { KeepLiveWS as KLWS, WSOptions } from 'bilibili-live-ws/browser'
import * as logger from '/@/utils/logger'

interface ConnectOptions {
  wsOptions?: WSOptions
  on?: {
    open?: () => void
    live?: () => void
    close?: () => void
    heartbeat?: (online: number) => void
    danmu?: (danmu: LivePlayer.BLiveMessageDanmaku) => void
    // TODO
    gift?: (gift: LivePlayer.BLiveGiftDanmaku) => void
    sc?: (sc: LivePlayer.BLiveSCMessageDanmaku) => void
  }
  roomUid?: number | string
}

export type KeepLiveWS = KLWS

export default function connectLiveWs(
  roomid: number | string,
  opt: ConnectOptions = {}
) {
  if (typeof roomid === 'string') roomid = parseInt(roomid)
  const ws = new KLWS(roomid, opt.wsOptions)

  const events = opt.on || {}
  ws.on('open', () => {
    logger.success('BLiveWs', '已连接直播弹幕服务器')
    events.open && events.open()
  })

  ws.on('live', () => {
    logger.success('BLiveWs', `已连接直播间${roomid}`)
    events.live && events.live()
  })

  ws.on('close', () => {
    logger.error('BLiveWs', '已断开与直播弹幕服务器的连接')
    events.close && events.close()
  })

  ws.on('heartbeat', online => {
    logger.message('BLiveWs', `当前人气值${online}`)
    events.heartbeat && events.heartbeat(online)
  })

  ws.on(
    'DANMU_MSG',
    ({ info: [, message, [uid, uname, isOwner], , , , , , , { ts, ct }] }) => {
      const danmaku: LivePlayer.BLiveMessageDanmaku = {
        type: 'message',
        uid,
        uname,
        message,
        ts,
        ct,
        isAnchor: uid === opt.roomUid,
        isOwner: !!isOwner
      }
      events.danmu && events.danmu(danmaku)
    }
  )

  return ws
}
