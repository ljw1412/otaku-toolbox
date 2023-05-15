import API from '/@/utils/api'
const { apiGet, apiPost, apiDelete, apiPut } = API
import { formatBangumi } from '/@/utils/dataFormat'

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
  status: string,
  tags: string[] | string,
  keyword = '',
  sort: Record<string, string | number> = {}
): Promise<{ list: BangumiBasic[]; total: number }> {
  if (Array.isArray(tags)) {
    tags = tags.join(',')
  }
  const data = (await apiGet(API_BASE, {
    data: { ...page, tags, status, type, keyword, ...sort }
  })) as { list: BangumiBasic[]; total: number }
  data.list.forEach((item) => formatBangumi(item as FormatedBangumiBasic))
  return data
}

/**
 * 获取指定id的番剧
 * @param id
 * @returns
 */
export async function showBangumi(
  id: string,
  opts: { mode?: 'simple'; fields?: string } = {}
) {
  const data = await apiGet(`${API_BASE}/${id}`, { data: opts })
  return formatBangumi(data)
}

/**
 * 随机获取一部番剧的基本信息
 * @param id
 * @returns
 */
export async function randomOne(onlyid?: boolean) {
  const data = await apiGet(`${API_BASE}/random`, { data: { onlyid } })
  return formatBangumi(data)
}

/**
 * 获取一周番剧
 * @returns
 */
export async function listWeekBangumi(): Promise<FormatedBangumiBasic[]> {
  const data = await apiGet<BangumiBasic[]>(`${API_BASE}/week`)
  data.forEach((item) => formatBangumi(item))
  return data as FormatedBangumiBasic[]
}

/**
 * 获取一天番剧(可以额外附加明天)
 * @param opts
 * @param opts.withNextDay 是否包含第二天的
 * @returns
 */
export async function listDayBangumi(
  opts: { withNextDay?: boolean } = {}
): Promise<FormatedBangumiBasic[]> {
  const result = await apiGet<BangumiBasic[]>(`${API_BASE}/today`, {
    data: { t: +new Date(), ...opts }
  })
  result.forEach((item) => formatBangumi(item))
  return result as FormatedBangumiBasic[]
}
