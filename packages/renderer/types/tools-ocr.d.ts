declare namespace ToolsOCR {
  interface ImageFileItem {
    file: File
    url: string
    name: string
    selected: boolean
    x: number
    y: number
    scale: number
    rectList: CroppedRect[]
  }

  interface TwoPointRect {
    show?: boolean
    startX: number
    startY: number
    endX: number
    endY: number
    preview: string
  }

  interface CroppedRect {
    id?: number
    x: number
    y: number
    width: number
    height: number
    preview: string
    selected: boolean
    text: string
    translation: string
  }
}
