import { reactive } from 'vue'

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
    this.set(this.get())
  },
  get(): string {
    return localStorage.getItem(STORE_KEY) || ''
  },
  set(name: string): void {
    const rootDataset = document.documentElement.dataset
    rootDataset.theme = name
    localStorage.setItem(STORE_KEY, name)
    this.data.current = name
  }
}

export default themeHelper
