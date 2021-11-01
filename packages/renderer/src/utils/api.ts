import { toTitleCase } from './string'
import qs from 'qs'

const BASE_URL = import.meta.env.VITE_API_SERVER_URL

type CreateFetch = (api: string, init?: MyRequestInit) => Promise<Response>

interface MyRequestInit extends RequestInit {
  data?: BodyInit
  query?: string | Record<string, any>
}

function createFetch(method: string) {
  const config = { method, query: '' } as MyRequestInit
  return function baseFetch(api: string, init: MyRequestInit = {}) {
    const mConfig = Object.assign({}, config, init)
    // 对传入的data进行处理
    if (init.data) {
      if (method === 'GET') {
        mConfig.query = init.data
      } else {
        mConfig.body = init.data
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

    const url = `${BASE_URL}${api}${mConfig.query}`

    return fetch(url, mConfig).then(resp => resp.json())
  }
}

const methods = ['GET', 'POST', 'PUT', 'DELETE']

const fetchMethods = methods.reduce((obj, item) => {
  const key = `api${toTitleCase(item)}`
  obj[key] = createFetch(item)
  return obj
}, {} as Record<string, CreateFetch>)

export default fetchMethods
