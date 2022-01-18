import request from 'superagent'

export async function getRoomPlayInfo(
  room_id: number | string,
  qn: number | string = 10000
) {
  try {
    const res = await request
      .get(
        'https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo'
      )
      .query({
        room_id,
        protocol: '0,1',
        format: '0,1,2',
        codec: '0,1',
        qn,
        platform: 'web',
        ptype: '8'
      })
    const { code, data, message } = res.body
    if (code === 0) {
      const { uid, live_status, playurl_info } = data

      let qnDesc: Record<string, any>[] = []
      const formatStream: Record<string, any> = {}

      if (live_status === 1) {
        const { g_qn_desc, stream } = playurl_info.playurl
        if (Array.isArray(g_qn_desc)) {
          qnDesc = g_qn_desc.map(item => {
            return {
              qn: item.qn,
              name: item.desc,
              hdr_desc: item.hdr_desc,
              url: ''
            }
          })
        }

        if (Array.isArray(stream)) {
          stream.forEach(item => {
            formatStream[item.protocol_name] = {}
            if (Array.isArray(item.format)) {
              item.format.forEach(
                (fItem: { format_name: string | number; codec: any }) => {
                  formatStream[item.protocol_name][fItem.format_name] =
                    fItem.codec
                }
              )
            }
          })
        }
      }

      return { uid, live_status, qnDesc, stream: formatStream }
    }
    return Promise.reject(new Error(message))
  } catch (error) {
    return Promise.reject(error)
  }
}

export async function getLiveRoomPlayUrl(
  room_id: number | string,
  qn: number | string = 10000
) {
  try {
    const res = await request
      .get('https://api.live.bilibili.com/room/v1/Room/playUrl')
      .query({ cid: room_id, qn, platform: 'h5' })

    const { code, data, message } = res.body
    if (code === 0) {
      const { durl, quality_description, current_qn } = data
      const qnDesc = quality_description.map(
        (item: { qn: number; desc: string }) => {
          return { qn: item.qn, name: item.desc, url: '' }
        }
      )
      return { durl, qnDesc, current_qn }
    }

    return Promise.reject(new Error(message))
  } catch (error) {
    return Promise.reject(error)
  }
}

export async function getRoomStatusByUids(uids: (number | string)[]) {
  try {
    const res = await request
      .post(
        'https://api.live.bilibili.com/room/v1/Room/get_status_info_by_uids'
      )
      .send({ uids })

    const { code, data, message } = res.body
    if (code === 0) {
      return data as Record<string, any>
    }
    return Promise.reject(new Error(message))
  } catch (error) {
    return Promise.reject(error)
  }
}

export async function getRoomInit(room_id: number | string) {
  try {
    const res = await request
      .get('https://api.live.bilibili.com/room/v1/Room/room_init')
      .query({ id: room_id })

    const { code, data, message } = res.body
    if (code === 0) {
      return data as Record<string, any>
    }
    return Promise.reject(new Error(message))
  } catch (error) {
    return Promise.reject(error)
  }
}

export async function getRoomInfo(room_id: number | string) {
  try {
    const res = await request
      .get('https://api.live.bilibili.com/room_ex/v1/RoomNews/get')
      .query({ roomid: room_id })

    const { code, data, message } = res.body
    if (code === 0) {
      return data as Record<string, any>
    }
    return Promise.reject(new Error(message))
  } catch (error) {
    return Promise.reject(error)
  }
}
