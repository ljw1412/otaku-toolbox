const days = ['日', '一', '二', '三', '四', '五', '六']

export function betterWeekdayName(number: number, short = false) {
  const prefix = short ? '周' : '星期'
  return prefix + days[number]
}
