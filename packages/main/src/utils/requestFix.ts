import { session } from 'electron'
import match from './url-match-patterns'

interface FilterRuleMap {
  types: string[] | '*'
  referer: string
}

const ruleMap: Record<string, FilterRuleMap> = {
  '*://*.dmzj.com/*': {
    types: ['image'],
    referer: 'https://www.dmzj.com'
  },
  '*://*.cdndm5.com/*': {
    types: ['image'],
    referer: 'https://m.dm5.com/m{:cid}/'
  },
  '*://*.bilivideo.com/*': {
    types: '*',
    referer: 'https://www.bilibili.com/'
  },
  '*://*.weather.com.cn/*': {
    types: '*',
    referer: 'https://www.weather.com.cn/'
  }
}

const filter = {
  urls: Object.keys(ruleMap)
}

const paramRegEx = /\{:(\w+)\}+/g

// 匹配referer中的变量 {:param}
function parseParamsReferer(url: string, referer: string) {
  if (!paramRegEx.test(referer)) return referer
  const mUrl = new URL(url)
  const paramNames = Array.from(referer.matchAll(/\{:(\w+)\}+/g), m => m[1])
  paramNames.forEach(item => {
    if (item) {
      const paramValue = mUrl.searchParams.get(item)
      if (paramValue) referer = referer.replace(`{:${item}}`, paramValue)
    }
  })
  // 没有完全匹配，为了隐藏行为，只传递 url 的 origin
  if (paramRegEx.test(referer)) {
    const refererUrl = new URL(referer)
    return refererUrl.origin
  }
  return referer
}

function getFilterRule(url: string) {
  const rule = filter.urls.find(rule => match(rule, url))
  return rule
}

session.defaultSession.webRequest.onBeforeRequest((details, cb) => {
  const { url } = details

  if (url.startsWith('file://') && !url.startsWith('file:///')) {
    let protocol = 'http:'
    if (url.includes('bilibili')) {
      protocol = 'https:'
    }
    return cb({ redirectURL: url.replace('file:', protocol) })
  }
  cb({})
})

session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, cb) => {
  const { url, requestHeaders, resourceType } = details

  const filterRule = getFilterRule(url)
  if (!filterRule) return cb({})
  const { types, referer: targetReferer } = ruleMap[filterRule]
  if (types !== '*' && !types.includes(resourceType)) return cb({})
  const referer = parseParamsReferer(url, targetReferer)
  requestHeaders.Referer = referer
  requestHeaders['User-Agent'] =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36 Edg/95.0.1020.30'
  cb({ requestHeaders })
})
