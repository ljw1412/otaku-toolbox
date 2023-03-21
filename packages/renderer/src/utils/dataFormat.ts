import { formatUnixTime } from './date'
import { toTitleCase } from './string'

const BANGUMI_STATUS_MAP: Record<number, string> = {
  0: '计划中',
  1: '连载中',
  2: '已完结'
}

export function formatBangumi(bangumi: BangumiBasic) {
  const result24 = formatUnixTime(bangumi.onair) || ({} as any)
  const result30 = formatUnixTime(bangumi.onair, 30) || ({} as any)
  const mBangumi: FormatedBangumiBasic = Object.assign(bangumi, {
    formatOnair: { 24: result24, 30: result30 },
    markState: (bangumi.mark || []).reduce((obj, mark) => {
      obj[`is${toTitleCase(mark)}`] = true
      return obj
    }, {} as Record<string, boolean>),
    statusCH: BANGUMI_STATUS_MAP[bangumi.status] || ''
  })
  return mBangumi
}

const now = new Date()

export function onairMessage(onair: FormatedAnimeDatetime, prefix = '') {
  if (!onair) return ''
  if (!onair.time) return '首播未定'
  const { dateCH, fullDateCH, dayCH, time, years } = onair
  const date = years == now.getFullYear() + '' ? dateCH : fullDateCH
  return `${prefix}${date}起 每周${dayCH} ${time}`
}
