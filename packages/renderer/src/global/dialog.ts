import { reactive, watch, nextTick } from 'vue'

export const $iframePlayer = reactive({
  isDisplay: false,
  autoplay: false,
  from: '',
  name: '',
  src: '',
  options: {}
})

export const defaultOptions = {
  frameborder: 'no',
  framespacing: '0',
  border: '0',
  scrolling: 'no',
  allowfullscreen: 'true',
  allow:
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
}

export function showIframePlayer(
  src: string,
  base: { name?: string; from?: string; autoplay?: boolean } = {},
  options: Record<string, string> = {}
) {
  const { name = '', from = '', autoplay = false } = base
  $iframePlayer.src = src
  $iframePlayer.name = name
  $iframePlayer.from = from
  $iframePlayer.autoplay = autoplay
  $iframePlayer.options = Object.assign(defaultOptions, options)
  $iframePlayer.isDisplay = true
}

export const $imagePreviewer = reactive({
  visible: false,
  current: 0,
  srcList: [] as string[]
})
// 修复跨域但支持no-referrer的图片
watch(
  [() => $imagePreviewer.visible, () => $imagePreviewer.current],
  ([visible, current]) => {
    if (visible) {
      nextTick(() => {
        const img = document.querySelector<HTMLImageElement>(
          'body > .arco-image-preview img'
        )
        if (img) {
          const src = img.src
          img.src = ''
          img.referrerPolicy = 'no-referrer'
          img.onerror = () => {
            // console.log('onerror')
            img.src = src
          }
        }
      })
    }
  }
)

export function imagePreview(current: string, srcList: string[]) {
  const index = srcList.indexOf(current)
  $imagePreviewer.current = index === -1 ? 0 : index
  $imagePreviewer.srcList = srcList
  $imagePreviewer.visible = true
}
