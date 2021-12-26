import { reactive } from 'vue'
import Favorites from './comic/Favorites'
import History from './comic/History'
import { globalAdd } from '/@/global'
import * as logger from '/@/utils/logger'

const stateIDB = reactive({ opend: false, error: false })

globalAdd('IDB', stateIDB)

const request = window.indexedDB.open('otaku_tools', 1)
const table = {} as IDBTables

request.onerror = function(event) {
  stateIDB.error = true
  logger.error('IndexedDB', '[otaku_tools]数据库打开报错')
}

let db: IDBDatabase

request.onsuccess = function(event) {
  stateIDB.opend = true
  db = request.result
  table.favorites = new Favorites(db)
  table.history = new History(db)
  logger.success('IndexedDB', '[otaku_tools]数据库打开成功')
}

request.onupgradeneeded = function(event) {
  // @ts-ignore
  db = event.target.result
  Favorites.upgrade(db, event)
  History.upgrade(db, event)
  logger.success('IndexedDB', '[otaku_tools]数据库版本更新结束', event)
}

window.$db = table
