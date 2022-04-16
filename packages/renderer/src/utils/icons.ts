import mGlobal from '/@/global'

const logoIcons = {
  Baha: 'baha.ico',
  Bangumi: 'bangumi.ico',
  Bilibili: 'bilibili.svg',
  Desney: 'desney.svg',
  YouTube: 'youtube.svg',
  YouKu: 'youku.svg',
  TV: 'tv.svg',
  IQiyi: 'iqiyi.svg',
  QQVideo: 'qqvideo.svg',
  Netflix: 'netflix.svg',
  Viu: 'viu.png',
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
