interface CompressConfig {
  w: number
  h: number
  ext?: 'webp' | 'jpg' | 'png'
}

const compressSize = {
  mini: '@120w_120h_1e.webp',
  small: '@360w.webp',
  medium: '@640w.webp'
}

export function compressImage(
  src: any,
  config?: 'mini' | 'small' | 'medium' | CompressConfig
) {
  if (
    typeof src === 'string' &&
    (src.includes('hdslb.com') || src.includes('article.biliimg.com')) &&
    !src.includes('@')
  ) {
    if (
      typeof config === 'string' &&
      Object.keys(compressSize).includes(config)
    ) {
      return src + compressSize[config]
    }
    if (typeof config === 'object' && config.w && config.h) {
      const ext = config.ext || 'webp'
      return `${src}@${config.w}w_${config.h}h.${ext}`
    }
    return src + '@450w_600h.webp'
  }
  return src
}

export function imgUrl2img(url: string) {
  const image = new Image()
  image.src = url
  image.referrerPolicy = 'no-referrer'
  image.crossOrigin = 'anonymous'
  return image
}

export async function imgUrl2blob(url: string): Promise<Blob | null> {
  const image = imgUrl2img(url)
  return new Promise((resolve, reject) => {
    image.onload = () => {
      resolve(img2blob(image))
    }
    image.onerror = reject
  })
}

export async function img2blob(img: HTMLImageElement): Promise<Blob | null> {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.drawImage(img, 0, 0)
  }
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      resolve(blob)
      canvas.remove()
    })
  })
}
