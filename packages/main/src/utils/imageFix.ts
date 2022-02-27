import { session } from 'electron'
import match from './url-match-patterns'

const ruleMap: Record<string, string> = {
  '*://*.dmzj.com/*': 'https://www.dmzj.com',
  '*://*.cdndm5.com/*': 'https://m.dm5.com/m{:cid}/'
}

const filter = {
  urls: Object.keys(ruleMap)
}

const paramRegEx = /\{:(\w+)\}+/g

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

session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, cb) => {
  const { url, requestHeaders, resourceType } = details
  if (resourceType !== 'image') return cb({})
  const filterRule = getFilterRule(url)
  if (!filterRule) return cb({})
  const referer = parseParamsReferer(url, ruleMap[filterRule])
  requestHeaders.Referer = referer
  requestHeaders['User-Agent'] =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36 Edg/95.0.1020.30'
  cb({ requestHeaders })
})
