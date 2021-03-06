// 驼峰转横杠分隔
const hyphenateRE = /\B([A-Z])/g
export function hyphenate(str: string, hyphenate = '-') {
  return str.replace(hyphenateRE, `${hyphenate}$1`).toLowerCase()
}

/**
 * 分隔转驼峰
 * @param str 字符串
 * @param lower 是否为小驼峰
 * @returns
 */
export function capitalized(str: string, lower = false) {
  let first = true
  return str.replace(/\b\w+\b[-_]?/g, function(word) {
    word = word.replace(/[-_]/g, '')
    let initial = word.substring(0, 1).toUpperCase()
    if (lower && first) {
      initial = initial.toLowerCase()
      first = false
    }
    return initial + word.substring(1)
  })
}

/**
 * 首字母大写
 * @param str 字符串
 * @returns 首字母大写
 */
export function toTitleCase(str: string) {
  return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase()
}
