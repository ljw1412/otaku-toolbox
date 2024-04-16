import request from '../../../utils/request'
import cheerio, { CheerioAPI, Cheerio, Node } from 'cheerio'
import Logger from '../../../utils/logger'
import modifierParser from '../../parser/html/modifierParser'

export const isDebugger = false
const logger = {} as typeof Logger
Object.keys(Logger).forEach((key) => {
  const state = key as keyof typeof Logger
  logger[state] = (tag: string, ...data: any[]) => {
    if (isDebugger) {
      Logger[state](tag, ...data)
    }
  }
})

const _timeout = 20000
const _headers = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
}

// 解析url，替换 {:???}
function parseUrl(url: string, replacer: DataCenter.Replacer = { page: 1 }) {
  let newUrl = url
  if (!replacer.page) replacer.page = 1
  Object.keys(replacer).forEach((key) => {
    newUrl = newUrl.replace(`{:${key}}`, replacer[key] + '')
  })
  logger.info('[parseUrl]', `规则:${url}`, `结果:${newUrl}`)
  return newUrl
}

// 加载网页并解析为cheerio对象
async function loadUrl(url: string) {
  const resp = await request.get(url).timeout(_timeout).set(_headers)
  const $ = cheerio.load(resp.text)
  if (isDebugger) console.log(resp.text)
  logger.info('[loadUrl]', $('head > title').text())
  return $
}

// 格式化选择器
function formatQuery(ruleStr: string): DataCenter.Query | null {
  if (!ruleStr) return null
  const temp = ruleStr.split('|')
  const query = temp.shift()
  if (query) return { query, modifiers: temp }
  logger.error('parseQuery', `"${ruleStr}"\n数据规则存在问题!`)
  return null
}

function parseBase(el: Cheerio<Node>, modifier: string) {
  let result: any = ''
  let action = ''
  if (modifier.startsWith('map')) {
    const spIndex = modifier.indexOf('-')
    const nextModifier = modifier.substr(spIndex + 1)
    action = `获取每个元素[${modifier}]`
    result = el
      .map((i, el) => parseBase(cheerio(el), nextModifier).result)
      .toArray()
  } else if (modifier.startsWith('@')) {
    const name = modifier.substr(1)
    action = `获取元素[${name}]属性`
    result = el.attr(name) || ''
  } else if (modifier === 'text') {
    action = '获取元素文本'
    result = el.text()
  } else if (modifier === 'html') {
    action = '获取元素源码'
    result = el.html() || ''
  } else if (modifier === 'val') {
    action = '获取元素的值'
    let val = el.val() || ''
    if (Array.isArray(val)) {
      val = val[0]
    }
    result = val
  }
  return { action, result }
}

// 解析选择器
function parseQuery($: CheerioAPI | Cheerio<Node>, _query: DataCenter.Query) {
  const { query, modifiers: _modifiers } = _query
  const modifiers = [..._modifiers]

  // 不解析，直接输出
  if (query.startsWith('=')) {
    return query.substr(1)
  }

  const el = ($ as Cheerio<Node>).find
    ? ($ as Cheerio<Node>).find(query)
    : ($ as CheerioAPI)(query)

  logger.info('[parseQuery]', `获取元素"${query}", 数量:${el.length}`)
  // 如果没有修饰符，则返回查询元素
  if (!modifiers.length) {
    return el
  }

  // 初次解析
  const modifier = modifiers.shift() as string
  const { action, result } = parseBase(el, modifier)
  logger.info('[parseQuery]', modifier, `${action}结果:${result}`)
  return parseModifiers(result, modifiers)
}

// 解析修饰符
function parseModifiers(str: string | string[], modifiers: string[]): any {
  if (!str || !modifiers.length) return str
  const modifier = modifiers.shift() as string
  const result = modifierParser(str, modifier)
  if (modifiers.length) {
    return parseModifiers(result, modifiers)
  }
  return result
}

// 解析全局数据
function parseGlobalData($: CheerioAPI, data: Record<string, string> = {}) {
  return Object.keys(data).reduce(
    (obj, key) => {
      const query = formatQuery(data[key])
      if (query) obj[key] = parseQuery($, query) as string
      return obj
    },
    { pageTotal: -1 } as Record<string, string | number>
  )
}

// 解析列表
function parseItem(
  $: CheerioAPI,
  items: string,
  itemData: Record<string, string>
) {
  if (!items) return []
  const query = formatQuery(items)
  if (!query) {
    logger.error('[parseItem]', `[${items}]选择器异常`)
    return []
  }
  const el = parseQuery($, query)
  if (typeof el === 'string' || !el.length) return []
  return parseItemData($, el, itemData)
}

function parseItemData(
  $: CheerioAPI,
  node: Cheerio<Node>,
  data: Record<string, string> = {}
) {
  return node
    .map((_i, el) => {
      return Object.keys(data).reduce((obj, key) => {
        const query = formatQuery(data[key])
        if (query) obj[key] = parseQuery($(el), query)
        return obj
      }, {} as Record<string, any>)
    })
    .get()
}

export async function parseHTML(
  rule: DataCenter.RulePageParams,
  options: DataCenter.RunnerOptions
) {
  const url = parseUrl(rule.url, options.replacer)
  const $ = await loadUrl(url)
  const globalData = parseGlobalData($, rule.data)
  if (typeof globalData.pageTotal === 'string') {
    globalData.pageTotal = parseInt(globalData.pageTotal)
  }
  const list = parseItem($, rule.items, rule.itemData)
  return { url, list, ...globalData }
}
