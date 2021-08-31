interface ThemeItem {
  name: string
  value: string
  type: string
}

interface ThemeData {
  current: string
  themes: ThemeItem[]
}

type ThemeHelper = {
  themes: ThemeItem[]
  data: ThemeData
  init(): void
  get(): string
  set(name?: string): void
  update(name?: string): void
}

interface Window {
  $theme: ThemeHelper
  $dayjs: dayjs
}
