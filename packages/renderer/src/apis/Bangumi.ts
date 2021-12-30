import API from '/@/utils/api'
const { apiGet, apiPost, apiDelete, apiPut } = API
import { computeBangumiTime, computeMark } from '/@/utils/dataFormat'

const API_BASE = 'bangumi'

/**
 * 获取番剧列表
 * @param page {index,size}
 * @param tags 筛选标签
 * @param keyword 筛选关键词
 * @returns
 */
export async function listBangumi(
  page = { index: 1, size: 20 },
  type: string,
  tags: string[] | string,
  keyword = '',
  sort: Record<string, string | number> = {}
): Promise<{ list: BangumiBasic[]; total: number }> {
  if (Array.isArray(tags)) {
    tags = tags.join(',')
  }
  const data = (await apiGet(API_BASE, {
    data: { ...page, tags, type, keyword, ...sort }
  })) as { list: BangumiBasic[]; total: number }
  data.list.forEach(item =>
    computeMark(computeBangumiTime(item as BangumiBasicWithTime))
  )
  return data
}

/**
 * 获取指定id的番剧
 * @param id
 * @returns
 */
export async function showBangumi(id: string) {
  const data = await apiGet(`${API_BASE}/${id}`)
  return computeMark(computeBangumiTime(data))
}

/**
 * 获取一周番剧
 * @returns
 */
export async function listWeekBangumi(): Promise<BangumiBasicWithTime[]> {
  const data = (await apiGet(`${API_BASE}/week`)) as BangumiBasicWithTime[]
  data.forEach(item => computeMark(computeBangumiTime(item)))
  return data
}

/**
 * 获取一日番剧
 * @returns
 */
export async function listTodayBangumi(): Promise<BangumiBasicWithTime[]> {
  const data = (await apiGet(`${API_BASE}/today`, {
    data: { t: +new Date() }
  })) as BangumiBasicWithTime[]
  data.forEach(item => computeMark(computeBangumiTime(item)))
  return data
}
