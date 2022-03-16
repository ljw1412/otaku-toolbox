import { computed, reactive } from 'vue'

export const state = reactive({
  layout: {
    imagePanel: { show: true },
    guide: { show: true, allowClose: false }
  },
  dragging: false,
  // 定位目标
  targetId: 0,
  imageFileList: [] as ToolsOCR.ImageFileItem[]
})

export const currentImage = computed(() =>
  state.imageFileList.find(item => item.selected)
)

export const allRectList = computed(() => {
  const allRectList = state.imageFileList.map(item => item.rectList)
  return ([] as ToolsOCR.CroppedRect[]).concat(...allRectList)
})

export function createImageItem(file: File) {
  return {
    file,
    url: URL.createObjectURL(file),
    name: file.name,
    selected: !state.imageFileList.length,
    x: 0,
    y: 0,
    scale: 1,
    preX: 0,
    preY: 0,
    rectList: [] as ToolsOCR.CroppedRect[]
  }
}
