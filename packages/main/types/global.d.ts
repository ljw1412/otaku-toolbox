import { BrowserWindow } from 'electron'

declare global {
  namespace NodeJS {
    interface Global {
      quickWindows: Record<string, BrowserWindow>
    }
  }

  namespace DataCenter {
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
}
