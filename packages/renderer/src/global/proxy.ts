import { useLocalStorage, get } from '@vueuse/core'

const PROXY_LIST = 'PROXY_LIST'

const proxy = useLocalStorage(PROXY_LIST, [] as ProxyItem[])

export default get(proxy)
