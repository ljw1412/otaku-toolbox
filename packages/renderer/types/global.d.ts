interface HTMLElement {
  _ripple?: {
    enabled?: boolean
    centered?: boolean
    class?: string
    circle?: boolean
    touched?: boolean
    isTouch?: boolean
  }
  _watchScroll?: {
    listener: Funciton
    position: {
      left: number
      top: number
    }
  }
}

interface ThemeItem {
  name: string
  value: string
  type: string
  variable: string
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
  set(value?: string): void
  update(value?: string): void
}

interface PageNavigationItem {
  name: string
  to?: RouteLocationRaw
  url?: string
}
