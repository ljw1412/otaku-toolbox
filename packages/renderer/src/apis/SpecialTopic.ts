import API from '/@/utils/api'
const { apiGet, apiPost, apiDelete, apiPut } = API
import { formatBangumi } from '/@/utils/dataFormat'

const API_BASE = 'special_topic'

/**
 * 获取特殊专题列表
 * @returns
 */
export async function listSpecialTopic(type?: string): Promise<SpecialTopic[]> {
  return apiGet(API_BASE, { data: { type } })
}

/**
 * 展示专题内的动画
 * @param code
 * @returns
 */
export async function preview(code: string): Promise<FormatedBangumiBasic[]> {
  const data = (await apiGet(`${API_BASE}/preview`, {
    data: { code }
  })) as FormatedBangumiBasic[]
  return data.map(item => formatBangumi(item))
}
