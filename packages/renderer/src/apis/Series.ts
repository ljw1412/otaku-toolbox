import API from '/@/utils/api'
const { apiGet, apiPost, apiDelete, apiPut } = API

const API_BASE = 'series'

/**
 * 获取对应番剧的关联系列作品
 * @param id
 * @returns
 */
export async function showSeries(id: string) {
  return apiGet(`${API_BASE}/${id}`)
}
