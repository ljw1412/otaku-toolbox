declare interface AcgAppConfig {
  initialized_rule: boolean
  use_system_browser: boolean
}

interface NewBrowerConfig {
  url: string
  title?: string
  width?: number
  height?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  minimizable?: boolean
  maximizable?: boolean
  resizable?: boolean
  frame?: boolean
  singleInstance?: boolean
  parent?: BrowserWindow
  modal?: boolean
  autoShow?: boolean
  alwaysOnTop?: boolean
}

declare namespace DataCenter {
  interface Query {
    query: string
    modifiers: string[]
  }

  interface Rule {
    name: string
    namespace: string
    type: string
    version: string
    url: string
    mode: 'html' | 'json'
    data?: {
      pageTotal?: string | number
      [key: string]: string
    }
    items: string
    itemData: Record<string, string>
  }

  interface RunnerOptions {
    replacer?: Replacer
    proxy?: string
  }

  interface Replacer {
    page?: number | string
    [key: string]: number | string
  }
}
