import API from '/@/utils/api'
const { apiGet, apiPost, apiDelete, apiPut } = API

const API_BASE = 'character'

export async function listCharacter(bid: string, size = 999, index = 1) {
  return apiGet(API_BASE, { data: { bid, size, index } })
}
