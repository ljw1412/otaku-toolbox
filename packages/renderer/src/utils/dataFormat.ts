import { formatUnixTime } from './date'

export function computeBangumiTime(bangumi: BangumiBasicWithTime) {
  const result24 = formatUnixTime(bangumi.onair) || ({} as any)
  const result30 = formatUnixTime(bangumi.onair, 30) || ({} as any)
  bangumi.formatOnair = { 24: result24, 30: result30 }
  return bangumi
}

export function computeMark(bangumi: BangumiBasicWithTime) {
  bangumi.markState = { isBan: (bangumi.mark || []).includes('ban') }
  return bangumi
}

const now = new Date()

export function onairMessage(onair: FormatedAnimeDatetime, prefix = '') {
  if (!onair) return ''
  if (!onair.time) return '暂未定档'
  const { dateCH, fullDateCH, dayCH, time, years } = onair
  const date = years == now.getFullYear() + '' ? dateCH : fullDateCH
  return `${prefix}${date}起 每周${dayCH} ${time}`
}
