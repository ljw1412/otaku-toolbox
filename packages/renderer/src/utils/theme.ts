import { reactive } from 'vue'
import { ipcSend } from './electron'

const STORE_KEY = 'app-theme'

export const themes = [
  { name: '蓝色', value: '', type: 'ligth', variable: '--skin-blue' },
  { name: '黑暗', value: 'dark', type: 'dark', variable: '--skin-dark' },
  { name: '红色', value: 'red', type: 'ligth', variable: '--skin-red' },
  { name: '橙色', value: 'orange', type: 'ligth', variable: '--skin-orange' },
  { name: '粉色', value: 'pink', type: 'ligth', variable: '--skin-pink' },
  { name: '绿色', value: 'green', type: 'ligth', variable: '--skin-green' }
]

const themeData = reactive({ current: '', themes })

const themeHelper: ThemeHelper = {
  themes,
  data: themeData,
  init(): void {
    this.update(this.get())
  },
  // 获取本地存储的主题名称
  get(): string {
    return localStorage.getItem(STORE_KEY) || ''
  },
  // 更新UI并保存主题名称到本地存储
  set(value = ''): void {
    this.update(value)
    localStorage.setItem(STORE_KEY, value)
    ipcSend('window.message', 'theme-updated')
  },
  // 更新UI
  update(value = '') {
    const rootDataset = document.documentElement.dataset
    rootDataset.theme = value
    this.data.current = value
  }
}

export default themeHelper
