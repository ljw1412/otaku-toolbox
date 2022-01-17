import { URL } from 'url'
import qs from 'qs'
const env = import.meta.env

/**
 * 获取页面地址
 * @param path 路由地址，不用加上'#/'(函数自动会加的)
 */
export function getPageUrl(
  path?: string,
  query: Record<string, any> = {}
): string {
  if (path && !path.startsWith('/')) path = `/${path}`
  let hashPath = path ? `#${path}` : ''
  if (Object.keys(query).length) {
    const querystring = qs.stringify(query)
    hashPath += `?${querystring}`
  }
  if (env.MODE === 'development') {
    return (env.VITE_DEV_SERVER_URL || 'http://localhost:3000/') + hashPath
  }
  return new URL(
    `../renderer/dist/index.html${hashPath}`,
    'file://' + __dirname
  ).toString()
}
