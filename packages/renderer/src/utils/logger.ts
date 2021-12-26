const baseStyles = 'font-size:12px;padding:1px 10px;font-weight:700;'

export const baseLog = (
  type: string,
  bgcolor?: string,
  color = '#fff',
  bgcolor2 = '#666',
  color2 = '#fff'
) => (info: string, message: any = '', ...data: any[]) => {
  const leftStyles = `${baseStyles};background-color:${bgcolor};border-radius:5px 0 0 5px;color:${color}`
  const rightStyles = `${baseStyles};background-color:${bgcolor2};border-radius:0 5px 5px 0;color:${color2}`
  if (!data.length) {
    console.log(`%c${type}%c${info}`, leftStyles, rightStyles, message)
    return
  }
  console.group(`%c${type}%c${info}`, leftStyles, rightStyles, message)
  data.forEach(item => {
    console.log(item)
  })
  console.groupEnd()
}

export const message = baseLog('message', '#409EFF')

export const success = baseLog('success', '#67C23A')

export const error = baseLog('error', '#F56C6C')

export const warning = baseLog('warning', '#f5a623')

export const request = baseLog('request', '#2f9395')

export const response = baseLog('response', '#1adacf')
