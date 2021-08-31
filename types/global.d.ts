declare interface AcgAppConfig {
  use_system_browser: boolean
}

interface NewBrowerConfig {
  url: string
  title?: string
  width?: number
  height?: number
  minimizable?: boolean
  maximizable?: boolean
  resizable?: boolean
  frame?: boolean
  singleInstance?: boolean
}
