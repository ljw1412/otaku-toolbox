import API from '/@/utils/api'
const { apiGet, apiPost, apiDelete, apiPut } = API

const API_BASE = 'user'

/**
 * 获取当前用户信息
 * @returns
 */
export async function whoami() {
  return apiGet(`${API_BASE}/whoami`)
}

export async function login(user: { username: string; password: string }) {
  return apiPost(`${API_BASE}/login`, { data: user })
}

export async function logout() {
  return apiPost(`${API_BASE}/logout`)
}
