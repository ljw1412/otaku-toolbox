import { toTitleCase } from './string'
import qs from 'qs'

const timeout = 10 * 1000

console.log(import.meta.env)

const BASE_URL = import.meta.env.VITE_API_SERVER_URL
// const BASE_URL = location.origin + '/api/'

function createFetch(method: string) {
  const config = {
    method,
    query: '',
    timeout,
    headers: new Headers({
      'Content-Type': 'application/json; charset=utf-8'
    })
  } as MyRequestInit
  return function baseFetch(api: string, init: MyRequestInit = {}) {
    const controller = new AbortController()
    const signal = controller.signal

    const mConfig = Object.assign({ signal }, config, init)
    // 对传入的data进行处理
    if (init.data) {
      if (method === 'GET') {
        mConfig.query = init.data
      } else {
        mConfig.body =
          init.data instanceof Object ? JSON.stringify(init.data) : init.data
      }
    }
    // 解析为querystring
    if (mConfig.query) {
      if (typeof mConfig.query === 'object') {
        mConfig.query = qs.stringify(mConfig.query)
      }
      if (!mConfig.query.startsWith('?')) {
        mConfig.query = '?' + mConfig.query
      }
    }

    const url = api.startsWith('http')
      ? `${api}${mConfig.query}`
      : `${BASE_URL}${api}${mConfig.query}`

    setTimeout(() => {
      controller.abort()
    }, config.timeout)

    return fetch(url, mConfig)
      .then(async resp => {
        if (resp.status >= 400) {
          const text = await resp.text()
          try {
            const json = JSON.parse(text)
            return Promise.reject(json)
          } catch (error) {
            return Promise.reject(new Error(text))
          }
        }
        const json = resp.json()
        return json
      })
      .catch(e => {
        if (e.name === 'AbortError') {
          const configStr = JSON.stringify(mConfig, null, 2)
          const message = `接口"${api}"请求超时(${mConfig.timeout! / 1000}s)`
          console.log(
            `[${message}]\n/************\n${configStr}\n************/`
          )
        }
        return Promise.reject(e)
      })
  }
}

const methods = ['GET', 'POST', 'PUT', 'DELETE']

const fetchMethods = methods.reduce((obj, item) => {
  const key = `api${toTitleCase(item)}`
  obj[key] = createFetch(item)
  return obj
}, {} as Record<string, MyFetch>)

export default fetchMethods as {
  apiGet: MyFetch
  apiPost: MyFetch
  apiPut: MyFetch
  apiDelete: MyFetch
}
