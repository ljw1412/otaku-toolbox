declare interface AcgAppConfig {
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
}
