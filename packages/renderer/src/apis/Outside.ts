import API from '/@/utils/api'
const { apiGet, apiPost, apiDelete, apiPut } = API

interface ApiWeather {
  city: string
  updatetime: string
  wendu: string
  shidu: string
  sunrise_1: string
  sunset_1: string
  daytype: string
  nighttype: string
}

export async function weather(city: string) {
  const xmlResult = await fetch(
    `http://wthrcdn.etouch.cn/WeatherApi?city=${city}`
  )
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))

  const fields: Record<keyof ApiWeather, string> = {
    city: 'city',
    updatetime: 'updatetime',
    wendu: 'wendu',
    shidu: 'shidu',
    sunrise_1: 'sunrise_1',
    sunset_1: 'sunset_1',
    daytype: 'forecast weather day type',
    nighttype: 'forecast weather night type'
  }

  const result = {} as ApiWeather
  Object.keys(fields).forEach(key => {
    const el = xmlResult.querySelector(fields[key as keyof ApiWeather])
    result[key as keyof ApiWeather] = el ? el.textContent || '' : ''
  })

  return result
}

export async function ipInfo() {
  const resp = await apiGet(
    'https://api.bilibili.com/x/player/v2?cid=280356&bvid=BV17x411w7gX'
  )

  const { code, data, message } = resp
  if (code === 0) {
    return data.ip_info || {}
  } else {
    return Promise.reject(message)
  }
}
