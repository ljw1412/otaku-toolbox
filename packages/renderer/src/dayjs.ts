import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import toObject from 'dayjs/plugin/toObject'
import customParseFormat from 'dayjs/plugin/CustomParseFormat'

import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
dayjs.extend(isoWeek)
dayjs.extend(toObject)
dayjs.extend(customParseFormat)

window.$dayjs = dayjs

export default dayjs
