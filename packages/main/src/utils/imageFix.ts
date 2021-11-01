import { session } from 'electron'
import match from './url-match-patterns'

const ruleMap: Record<string, string> = {
  '*://*.dmzj.com/*': 'https://www.dmzj.com'
}

const filter = {
  urls: Object.keys(ruleMap)
}

function getReferer(url: string) {
  const rule = filter.urls.find(rule => match(rule, url))
  if (!rule) return
  return ruleMap[rule]
}

session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, cb) => {
  const { url, requestHeaders, resourceType } = details
  const referer = getReferer(url)
  if (resourceType !== 'image' || !referer) return cb({})
  requestHeaders.Referer = referer
  requestHeaders['User-Agent'] =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36 Edg/95.0.1020.30'
  cb({ requestHeaders })
})
