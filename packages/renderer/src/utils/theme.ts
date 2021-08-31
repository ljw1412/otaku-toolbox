import { reactive } from 'vue'
import { ipcSend } from './electron'

const STORE_KEY = 'app-theme'

const themes = [
  { name: '', value: '', type: 'ligth' },
  { name: '黑暗', value: 'dark', type: 'dark' }
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
  set(name = ''): void {
    this.update(name)
    localStorage.setItem(STORE_KEY, name)
    ipcSend('window.message', 'theme-updated')
  },
  // 更新UI
  update(name = '') {
    const rootDataset = document.documentElement.dataset
    rootDataset.theme = name
    this.data.current = name
  }
}

export default themeHelper
