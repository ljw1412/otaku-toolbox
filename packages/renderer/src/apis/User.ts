import API from '/@/utils/api'
const { apiGet, apiPost, apiDelete, apiPut } = API

const API_BASE = 'user'

/**
 * 获取当前用户信息
 * @returns
 */
export async function whoami(mode?: string) {
  return apiGet(`${API_BASE}/whoami`, { data: { mode }, silent: true })
}

export async function register(user: Record<string, string>) {
  return apiPost(`${API_BASE}/register`, { data: user })
}

export async function login(user: { username: string; password: string }) {
  return apiPost(`${API_BASE}/login`, { data: user })
}

export async function logout() {
  return apiPost(`${API_BASE}/logout`)
}

export async function clockInConfig() {
  return apiGet(`${API_BASE}/today_clockin_config`)
}

export async function clockIn() {
  return apiPost(`${API_BASE}/clockIn`)
}
