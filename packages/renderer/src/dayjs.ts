import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import toObject from 'dayjs/plugin/toObject'
import customParseFormat from 'dayjs/plugin/CustomParseFormat'
import updateLocale from 'dayjs/plugin/updateLocale'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
dayjs.extend(isoWeek)
dayjs.extend(toObject)
dayjs.extend(customParseFormat)
dayjs.extend(updateLocale)
dayjs.updateLocale('zh-cn', { weekStart: 0 })

window.$dayjs = dayjs

export default dayjs
