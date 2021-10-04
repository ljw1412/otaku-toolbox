const days = ['日', '一', '二', '三', '四', '五', '六']

export function weekdayName(number: number) {
  return days[number]
}

export function betterWeekdayName(number: number, short = false) {
  const prefix = short ? '周' : '星期'
  return prefix + days[number]
}

function prefixZore(n: number | string, digit = 2) {
  return `000000000${n}`.slice(-digit)
}

const TIME_FORMAT_MAP = {
  12: 'hh:mmA',
  24: 'HH:mm',
  30: 'HH:mm'
}
const DATE_FORMAT = 'M/D'
const DATE_FORMAT_CH = 'M月D日'

export function formatUnixTime(unix: number, hourSystem: 12 | 24 | 30 = 24) {
  if (!unix) return null
  let d = window.$dayjs(unix)
  const { years, hours, minutes } = d.toObject()
  let time = d.format(TIME_FORMAT_MAP[hourSystem])
  if (hourSystem === 30 && hours < 6) {
    d = d.subtract(1, 'day')
    time = prefixZore(hours + 24) + ':' + prefixZore(minutes)
  }
  const date = d.format(DATE_FORMAT)
  const dateCH = d.format(DATE_FORMAT_CH)
  const day = d.day()
  return {
    years: '' + years,
    time,
    date,
    dateCH,
    datetime: `${date} ${time}`,
    day,
    dayCH: weekdayName(day)
  }
}
