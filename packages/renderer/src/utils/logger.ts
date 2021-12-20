const baseStyles = 'font-size:12px;padding:1px 10px;font-weight:700;'

const baseLog = (
  type: string,
  bgcolor?: string,
  color = '#fff',
  bgcolor2 = '#666',
  color2 = '#fff'
) => (info: string, ...data: any) => {
  const leftStyles = `${baseStyles};background-color:${bgcolor};border-radius:5px 0 0 5px;color:${color}`
  const rightStyles = `${baseStyles};background-color:${bgcolor2};border-radius:0 5px 5px 0;color:${color2}`

  console.log(`%c${type}%c${info}\n`, leftStyles, rightStyles, ...data)
}

export const message = baseLog('message', '#409EFF')

export const success = baseLog('success', '#67C23A')

export const error = baseLog('error', '#F56C6C')

export const warning = baseLog('warning', '#f5a623')

export const request = baseLog('request', '#2f9395')

export const response = baseLog('response', '#1adacf')
