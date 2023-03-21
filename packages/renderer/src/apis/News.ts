import API from '/@/utils/api'
const { apiGet, apiPost, apiDelete, apiPut } = API

const API_BASE = 'news'

export async function index(page: Common.Page = { index: 1, size: 20 }) {
  return apiGet(API_BASE, { data: { ...page } })
}
