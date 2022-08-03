import { formatUnixTime } from './date'

const statusMap: Record<number, string> = {
  0: '计划中',
  1: '连载中',
  2: '已完结'
}

export function formatBangumi(bangumi: FormatedBangumiBasic) {
  const result24 = formatUnixTime(bangumi.onair) || ({} as any)
  const result30 = formatUnixTime(bangumi.onair, 30) || ({} as any)
  bangumi.formatOnair = { 24: result24, 30: result30 }
  bangumi.markState = { isBan: (bangumi.mark || []).includes('ban') }
  bangumi.statusCH = statusMap[bangumi.status] || ''
  return bangumi as FormatedBangumiBasic
}

const now = new Date()

export function onairMessage(onair: FormatedAnimeDatetime, prefix = '') {
  if (!onair) return ''
  if (!onair.time) return '首播未定'
  const { dateCH, fullDateCH, dayCH, time, years } = onair
  const date = years == now.getFullYear() + '' ? dateCH : fullDateCH
  return `${prefix}${date}起 每周${dayCH} ${time}`
}
