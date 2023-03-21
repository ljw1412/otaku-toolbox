import API from '/@/utils/api'
const { apiGet, apiPost, apiDelete, apiPut } = API

const API_BASE = 'wechat'

export async function getBindMpQrcode() {
  return apiPost(`${API_BASE}/mp_bind_qrcode`, {
    transform: async (resp) => {
      const blob = await resp.blob()
      if (blob.type.includes('json')) {
        return Promise.reject(JSON.parse(await blob.text()))
      }
      return { url: URL.createObjectURL(blob) }
    }
  })
}
