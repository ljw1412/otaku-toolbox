import API from '/@/utils/api'
const { apiGet, apiPost, apiDelete, apiPut } = API

const API_BASE = 'episode'

/**
 * 获取对应番剧的关联系列作品
 * @param animeId
 * @returns
 */
export async function showEpisodeInfo(
  animeId: string,
  data?: Record<string, any>
): Promise<EpisodesInfo> {
  return apiGet(`${API_BASE}/${animeId}`, { data, silent: true })
}

/**
 * 获取单集基础信息
 * @param episodeId
 * @returns
 */
export async function showOneEpisode(episodeId: string) {
  return apiGet(`${API_BASE}/one_episode`, {
    data: { episodeId },
    silent: true
  })
}

export async function listOneEpisodeMessage(
  episodeId: string,
  type = 'comments',
  index = 1,
  size = 20
): Promise<{
  list: (EpisodeComment & EpisodeReview)[]
  total: number
}> {
  return apiGet(API_BASE, { data: { episodeId, type, index, size } })
}

export async function saveComment(episodeId: string, comment: BaseComment) {
  return apiPost(`${API_BASE}/comment`, { data: { episodeId, comment } })
}

export async function delComment(episodeId: string, commentId: string) {
  return apiDelete(`${API_BASE}/comment`, { data: { episodeId, commentId } })
}

export async function showMyReview(episodeId: string) {
  return apiGet(`${API_BASE}/my_review`, { data: { episodeId } })
}

export function showUserEpisodeReviews(index: number, size: number) {
  return apiGet(`${API_BASE}/all_episode_reviews`, { data: { index, size } })
}

export async function saveMyReview(episodeId: string, review: EpisodeReview) {
  if (review._id) {
    return apiPut(`${API_BASE}/my_review`, { data: { episodeId, review } })
  } else {
    return apiPost(`${API_BASE}/my_review`, { data: { episodeId, review } })
  }
}
