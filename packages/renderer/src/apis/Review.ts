import API from '/@/utils/api'
const { apiGet, apiPost, apiDelete, apiPut } = API

const API_BASE = 'review'

export async function save(bangumi: string, review: Record<string, any>) {
  return apiPost(API_BASE, {
    data: { review: Object.assign({ bangumi }, review) }
  })
}

export async function index(
  bid: string,
  index: number,
  size: number
): Promise<{ list: MediaReview[]; total: number }> {
  return apiGet(API_BASE, { data: { bid, index, size } })
}

export async function show(bangumiId: string) {
  return apiGet(`${API_BASE}/${bangumiId}`)
}

export async function update(review: MediaReview) {
  return apiPut(`${API_BASE}/${review._id}`, { data: { review } })
}

export async function stats(
  bangumiId: string
): Promise<{ count: number; score: number }[]> {
  return apiGet(`${API_BASE}/stats`, { data: { bangumiId } })
}
