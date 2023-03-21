import API from '/@/utils/api'
const { apiGet, apiPost, apiDelete, apiPut } = API

const API_BASE = 'favourite'

export async function saveFavouriteStatus(
  bangumiId: string,
  status = 1,
  progress = 1
) {
  return apiPost(API_BASE, { data: { bangumi: bangumiId, status, progress } })
}

export async function showFavouriteStatus(bangumiId: string) {
  return apiGet(`${API_BASE}/${bangumiId}`)
}

export async function getAmountStatus(
  bangumiId: string
): Promise<{ _id: number; count: number }[]> {
  return apiGet(`${API_BASE}/amount_status`, { data: { bangumiId } })
}
