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

// export async function weather(city: string) {
//   const xmlResult = await fetch(
//     `http://wthrcdn.etouch.cn/WeatherApi?city=${city}`
//   )
//     .then(response => response.text())
//     .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))

//   const fields: Record<keyof ApiWeather, string> = {
//     city: 'city',
//     updatetime: 'updatetime',
//     wendu: 'wendu',
//     shidu: 'shidu',
//     sunrise_1: 'sunrise_1',
//     sunset_1: 'sunset_1',
//     daytype: 'forecast weather day type',
//     nighttype: 'forecast weather night type'
//   }

//   const result = {} as ApiWeather
//   Object.keys(fields).forEach(key => {
//     const el = xmlResult.querySelector(fields[key as keyof ApiWeather])
//     result[key as keyof ApiWeather] = el ? el.textContent || '' : ''
//   })

//   return result
// }

// http://m.weather.com.cn
export async function weather(cityId: string) {
  const api = `https://d1.weather.com.cn/weather_index/${cityId}.html?_=${+new Date()}`
  try {
    const text = await apiGet(api, { resultType: 'text' })
    return new Function(
      `${text};dataSK.max = fc.f[0].fc; dataSK.min = fc.f[0].fd; return dataSK;`
    )()
  } catch (error) {
    throw new Error('[天气] 城市天气获取失败')
  }
}

const chinaCityApi =
  'https://i.tq121.com.cn/j/wap2016/news/city_data.js?2022042521'
const externalCityApi =
  'https://i.tq121.com.cn/j/wap2016/news/city_ex.js?2022042521'

export async function weatherCityList(isChina = true) {
  const api = isChina ? chinaCityApi : externalCityApi
  const callbackName = isChina ? 'city_data' : 'exdata'
  try {
    const text = await apiGet(api, { resultType: 'text' })
    return new Function(`${text}return ${callbackName};`)()
  } catch (error) {
    throw new Error('[天气] 城市列表获取失败')
  }
}

export async function ipInfo() {
  const text = await apiGet(
    `https://wgeo.weather.com.cn/ip/?_=${+new Date()}`,
    { resultType: 'text' }
  )
  return new Function(`${text}return {ip,id,addr};`)()
}
