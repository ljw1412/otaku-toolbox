import { useLocalStorage, toReactive } from '@vueuse/core'

const GLOBAL_CONFIG = 'GLOBAL_CONFIG'

const defaultConfig = {
  theme: '',
  themeBefore: '',
  timeZone: 8,
  hourSystem: 24,
  allowDevTools: false,
  weekBangumiDirection: 'vertical',
  weather: { city: '', cityId: '' },
  bangumi: { newOpenTrailer: true }
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

export const configRef = config

export default toReactive(config) as typeof defaultConfig
