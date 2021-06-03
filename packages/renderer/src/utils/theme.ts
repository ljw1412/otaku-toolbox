const STORE_KEY = 'app-theme'

const themes = [
  { name: '默认主题', value: '', type: 'default' },
  { name: '黑暗主题', value: 'dark', type: 'dark' }
]

const themeHelper: ThemeHelper = {
  themes,
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
  }
}

themes.forEach(theme => {
  const { value, type } = theme
  themeHelper[type as ThemeTypes] = function() {
    themeHelper.set(value)
  }
})

export default themeHelper
