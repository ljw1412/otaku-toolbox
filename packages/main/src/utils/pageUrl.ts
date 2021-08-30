import { URL } from 'url'
const env = import.meta.env

/**
 * 获取页面地址
 * @param path 路由地址，不用加上'#/'(函数自动会加的)
 */
export function getPageUrl(path?: string): string {
  if (path && !path.startsWith('/')) path = `/${path}`
  const hash = path ? `#${path}` : ''
  if (env.MODE === 'development') {
    return (env.VITE_DEV_SERVER_URL || 'http://localhost:3000/') + hash
  }
  return new URL(
    `../renderer/dist/index.html${hash}`,
    'file://' + __dirname
  ).toString()
}
