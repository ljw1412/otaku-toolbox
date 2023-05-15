import { Message } from '@arco-design/web-vue'
import { toTitleCase } from './string'
import { currentUser } from '/@/global/user'
import qs from 'qs'

const timeout = 10 * 1000

const BASE_URL = import.meta.env.VITE_API_SERVER_URL
// const BASE_URL = location.origin + '/api/'

function createFetch(method: string) {
  const config = {
    method,
    query: '',
    timeout,
    silent: true,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    resultType: 'json'
  } as MyRequestInit
  return function baseFetch<T = any>(api: string, init: MyRequestInit = {}) {
    const controller = new AbortController()
    const signal = controller.signal

    const mConfig = Object.assign({ signal }, config, init)
    if (currentUser.value.token) {
      if (!mConfig.headers) {
        mConfig.headers = {}
      }
      Object.assign(mConfig.headers, { auth: currentUser.value.token })
    }

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
      if (mConfig.query && !mConfig.query.startsWith('?')) {
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
      .then<T>(async (resp) => {
        if (resp.status >= 400) {
          return Promise.reject(await resp.json())
        }
        if (init.transform) {
          return init.transform(resp as Response)
        }
        if (init.resultType === 'text') {
          return resp.text()
        }
        return resp.json()
      })
      .catch((e) => {
        const apiHeader = `[接口"${api}"]`
        const configStr = JSON.stringify(mConfig, null, 2)
        let message = e.message
        let content: any = ''

        if (e.name === 'AbortError') {
          message = `请求超时(${mConfig.timeout! / 1000}s)`
        }
        if (e.validate === 'fail' && Array.isArray(e.errors)) {
          const errMsg = e.errors
            .map((error: any) => `入参"${error.field}"${error.message}`)
            .join(',')
          message = errMsg
          content = e.errors
        }

        const finalMessage = `${apiHeader} ${message}`
        console.groupCollapsed(finalMessage)
        console.log(configStr)
        console.log(content)
        console.groupEnd()

        if (!mConfig.silent && message) {
          Message.error(finalMessage)
        }

        return Promise.reject(e)
      })
  }
}

type APIRequestKeys = 'apiGet' | 'apiPost' | 'apiPut' | 'apiDelete'
type APIRequest = {
  [key in APIRequestKeys]: MyFetch
}

const methods = ['GET', 'POST', 'PUT', 'DELETE']
const fetchMethods = methods.reduce((obj, item) => {
  const key = `api${toTitleCase(item)}` as APIRequestKeys
  obj[key] = createFetch(item)
  return obj
}, {} as APIRequest)

export default fetchMethods
