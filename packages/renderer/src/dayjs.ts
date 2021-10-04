import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import toObject from 'dayjs/plugin/toObject'

dayjs.extend(isoWeek)
dayjs.extend(toObject)

window.$dayjs = dayjs
