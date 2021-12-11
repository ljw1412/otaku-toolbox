import { reactive } from 'vue'

export function compressImage(src: string, mini = false) {
  if (src.includes('hdslb.com') && !src.includes('@')) {
    if (mini) return src + '80w_80h_1e_1c.webp'
    return src + '@450w_600h.webp'
  }
  return src
}

export const imagePreviewProps = reactive({
  visible: false,
  current: 0,
  srcList: [] as string[]
})

export function imagePreview(current: string, srcList: string[]) {
  const index = srcList.indexOf(current)
  imagePreviewProps.current = index === -1 ? 0 : index
  imagePreviewProps.srcList = srcList
  imagePreviewProps.visible = true
}
