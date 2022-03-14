import { computed, reactive } from 'vue'

export const store = reactive({
  layout: {
    imagePanel: { show: true },
    guide: { show: true, allowClose: false }
  },
  dragging: false,
  imageFileList: [] as ToolsOCR.ImageFileItem[]
})

export const currentImage = computed(() =>
  store.imageFileList.find(item => item.selected)
)

export const allRectList = computed(() => {
  const allRectList = store.imageFileList.map(item => item.rectList)
  return ([] as ToolsOCR.CroppedRect[]).concat(...allRectList)
})

export function createImageItem(file: File) {
  return {
    file,
    url: URL.createObjectURL(file),
    name: file.name,
    selected: !store.imageFileList.length,
    x: 0,
    y: 0,
    scale: 1,
    preX: 0,
    preY: 0,
    rectList: [] as ToolsOCR.CroppedRect[]
  }
}
