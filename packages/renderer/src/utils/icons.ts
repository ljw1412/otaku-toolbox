import mGlobal from '/@/global'

const logoIcons = {
  Acfun: 'acfun.png',
  Baha: 'baha.ico',
  Bangumi: 'bangumi.ico',
  Bilibili: 'bilibili.svg',
  Desney: 'desney.svg',
  YouTube: 'youtube.svg',
  YouKu: 'youku.svg',
  TV: 'tv.svg',
  IQiyi: 'iqiyi.svg',
  QQVideo: 'qqvideo.svg',
  Niconico: 'niconico.svg',
  Netflix: 'netflix.svg',
  Viu: 'viu.png',
  Mgtv: 'mgtv.png',
  PPTV: 'pptv.svg',
  Letv: 'letv.svg',
  Sohu: 'sohu.svg',
  MyTVSuper: 'mytvsuper.png',
  Nowplayer: 'nowplayer.svg'
}

function getPath() {
  return mGlobal.env.DEV ? '/icons/' : 'icons/'
}

export function getLogoIcon(name: string) {
  if (name.startsWith('http') || name.startsWith('//')) return name
  const icon = logoIcons[name as keyof typeof logoIcons]
  if (!icon) return
  return getPath() + icon
}

export default logoIcons
