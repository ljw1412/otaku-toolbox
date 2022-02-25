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

interface ToolPluginBase {
  desc: string
  icon: string
  name: string
  plugin: string
  version: number
  css?: boolean

  order?: number
  isAdded?: boolean
  isNeedUpdate?: boolean
  isDev?: boolean
  serve?: string
}

declare namespace DataCenter {
  interface Query {
    query: string
    modifiers: string[]
  }

  interface RuleBase {
    name: string
    namespace: string
    type: string
    version: string
    icon?: string
    url?: string
  }

  interface RulePageParams {
    url: string
    mode: 'html' | 'json'
    data?: {
      pageTotal?: string | number
      [key: string]: string
    }
    items: string
    itemData: Record<string, string>

    // 前端tab懒加载
    loaded?: boolean
  }

  interface NewsRule extends RuleBase {
    news: RulePageParams
  }

  interface ComicRule extends RuleBase {
    pages: (RulePageParams & { name: string })[]
    details: RulePageParams
    chapter: RulePageParams
  }

  type Rule = NewsRule & ComicRule & RulePageParams

  interface RunnerOptions {
    replacer?: Replacer
    proxy?: string
  }

  interface Replacer {
    page?: number | string
    [key: string]: number | string
  }
}
