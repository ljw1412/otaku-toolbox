import request from '../../../utils/request'
import logger from '/@/utils/logger'

// 解析url，替换 {:???}
function parseUrl(url: string, replacer: DataCenter.Replacer = { page: 1 }) {
  let newUrl = url
  if (!replacer.page) replacer.page = 1
  Object.keys(replacer).forEach(key => {
    newUrl = newUrl.replace(`{:${key}}`, replacer[key] + '')
  })
  logger.info('[parseUrl]', `规则:${url}`, `结果:${newUrl}`)
  return newUrl
}

function parseMethodAndType(methodAndType = 'GET') {
  const [method, type = 'json'] = methodAndType.split(':')
  return { method, type }
}

export async function parseApi(
  rule: DataCenter.RulePageParams,
  options: DataCenter.RunnerOptions
) {
  const url = parseUrl(rule.url, options.replacer)
  const { method, type } = parseMethodAndType(rule.method)
  const resp = await request(method, url)
  let result = {}
  if (type === 'json') {
    try {
      result = JSON.parse(resp.text)
    } catch (error) {
      logger.error('[parseApi]', error)
    }
  }
  console.log(result)
  return {}
}
