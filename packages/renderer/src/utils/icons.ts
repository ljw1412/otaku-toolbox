import Baha from '/@/../assets/icons/baha.ico'
import Bangumi from '/@/../assets/icons/bangumi.ico'
import Bilibili from '/@/../assets/icons/bilibili.svg'
import YouTube from '/@/../assets/icons/youtube.svg'
import YouKu from '/@/../assets/icons/youku.svg'
import TV from '/@/../assets/icons/tv.svg'
import IQiyi from '/@/../assets/icons/iqiyi.svg'
import QQVideo from '/@/../assets/icons/qqvideo.svg'
import Netflix from '/@/../assets/icons/netflix.svg'

const logoIcons = {
  Baha,
  Bangumi,
  Bilibili,
  YouKu,
  TV,
  YouTube,
  QQVideo,
  IQiyi,
  Netflix
}

export function getLogoIcon(name: string) {
  if (name.startsWith('http') || name.startsWith('//')) return name
  return logoIcons[name as keyof typeof logoIcons]
}

export default logoIcons
