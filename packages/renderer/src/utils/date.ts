export const dayList = [
  { en: 'Sunday', jp: '日', cn: '日' },
  { en: 'Monday', jp: '月', cn: '一' },
  { en: 'Tuesday', jp: '火', cn: '二' },
  { en: 'Wednesday', jp: '水', cn: '三' },
  { en: 'Thursday', jp: '木', cn: '四' },
  { en: 'Friday', jp: '金', cn: '五' },
  { en: 'Saturday', jp: '土', cn: '六' }
]

const daysCN = ['日', '一', '二', '三', '四', '五', '六']

export function weekdayName(number: number) {
  return daysCN[number]
}

export function betterWeekdayName(number: number, short = false) {
  const prefix = short ? '周' : '星期'
  return prefix + daysCN[number]
}

function prefixZore(n: number | string, digit = 2) {
  return `000000000${n}`.slice(-digit)
}

const TIME_FORMAT_MAP = {
  12: 'hh:mmA',
  24: 'HH:mm',
  30: 'HH:mm'
}
export const DATE_FORMAT = 'M/D'
export const FULL_DATE_FORMAT = 'YYYY/M/D'
export const DATE_FORMAT_CH = 'M月D日'
export const FULL_DATE_FORMAT_CH = 'YYYY年M月D日'

export function formatUnixTime(
  datetime: number | Date | string,
  hourSystem: 12 | 24 | 30 = 24
) {
  if (!datetime) return null
  let d = window.$dayjs(datetime)
  const { years, hours, minutes } = d.toObject()
  let time = d.format(TIME_FORMAT_MAP[hourSystem])
  if (hourSystem === 30 && hours < 6) {
    d = d.subtract(1, 'day')
    time = prefixZore(hours + 24) + ':' + prefixZore(minutes)
  }
  const date = d.format(DATE_FORMAT)

  const day = d.day()
  return {
    unix: d.unix() * 1000,
    years: '' + years,
    time,
    date,
    dateCH: d.format(DATE_FORMAT_CH),
    datetime: `${date} ${time}`,
    day,
    dayCH: weekdayName(day),
    fullDate: d.format(FULL_DATE_FORMAT),
    fullDateCH: d.format(FULL_DATE_FORMAT_CH)
  }
}

export function formatDuration(duration: number) {
  const list = [
    Math.floor(duration / 3600) % 24,
    ('0' + (Math.floor(duration / 60) % 60)).substr(-2),
    ('0' + Math.floor(duration % 60)).substr(-2)
  ]
  return list.filter((item, index) => item > 0 || index >= 1).join(':')
}
