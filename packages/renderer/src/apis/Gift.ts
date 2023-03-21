import API from '/@/utils/api'
const { apiGet, apiPost, apiDelete, apiPut } = API

const API_BASE = 'gift'

/**
 * 用户的领取记录
 * @param page { index, size }
 * @returns
 */
export async function listUserRecord({
  index,
  size
}: Common.Page): Promise<{ list: GiftRecord[]; total: number }> {
  return apiGet(`${API_BASE}/user_record`, { data: { index, size } })
}

/**
 * 领取兑换码礼包
 * @param mode 模式
 * @param code 代码
 * @returns
 */
export async function collect(mode: string, code: string) {
  return apiPost(`${API_BASE}/collect`, { data: { mode, code } })
}
