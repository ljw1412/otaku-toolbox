import API from '/@/utils/api'
const { apiGet, apiPost, apiDelete, apiPut } = API

const API_BASE = 'banner'
/**
 * 获取横幅列表
 * @param page
 * @param where 展示位置
 * @returns
 */
export async function listBanner(
  page: {
    index: number
    size: number
  },
  where = 'PCAPP'
): Promise<{ list: Banner[]; total: number }> {
  return apiGet(API_BASE, { data: { ...page, where } })
}
