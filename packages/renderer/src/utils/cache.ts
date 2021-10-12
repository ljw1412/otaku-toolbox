import { RouteLocationRaw } from 'vue-router'

const APP_NAVIGATION_KEY = 'app-navigation'

export function getNavigationCache(key?: string) {
  const cache = sessionStorage.getItem(APP_NAVIGATION_KEY) || '{}'
  const data = JSON.parse(cache)
  if (key) {
    return data[key]
  }
  return data
}

export function setNavigationCache(key: string, value: RouteLocationRaw) {
  const cache = getNavigationCache()
  cache[key] = value
  sessionStorage.setItem(APP_NAVIGATION_KEY, JSON.stringify(cache))
}
