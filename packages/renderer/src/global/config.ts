import { useLocalStorage, get } from '@vueuse/core'

const GLOBAL_CONFIG = 'GLOBAL_CONFIG'

const defaultConfig = {
  timeZone: 8,
  hourSystem: 24,
  allowDevTools: false,
  weekBangumiDirection: 'vertical',
  weatherCity: ''
}

const config = useLocalStorage(GLOBAL_CONFIG, defaultConfig, {
  serializer: {
    read: (v: any) => {
      try {
        const obj = JSON.parse(v)
        for (const key in defaultConfig) {
          if (!(key in obj)) {
            obj[key] = defaultConfig[key as keyof typeof defaultConfig]
          }
        }
        return obj
      } catch (error) {
        return {}
      }
    },
    write: (v: any) => JSON.stringify(v)
  }
})

export default get(config) as typeof defaultConfig
