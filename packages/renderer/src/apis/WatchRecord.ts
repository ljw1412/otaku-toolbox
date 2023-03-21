import API from '/@/utils/api'
const { apiGet, apiPost, apiDelete, apiPut } = API

const API_BASE = 'watch_record'

export async function getTop10() {
  return apiGet(`${API_BASE}/top10`)
}
