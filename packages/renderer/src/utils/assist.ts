export function noop() {}

export function typeOf(obj: any) {
  const toString = Object.prototype.toString
  const map: Record<string, string> = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
    '[object Error]': 'error'
  }
  return map[toString.call(obj)]
}

export function simpleCopy<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}
