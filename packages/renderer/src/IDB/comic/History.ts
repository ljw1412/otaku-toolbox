import BaseIDBTable from '../BaseTable'

export default class History extends BaseIDBTable<ComicHistory> {
  get tableName() {
    return 'history'
  }

  static upgrade(db: IDBDatabase, event: IDBVersionChangeEvent) {
    if (!db.objectStoreNames.contains('history')) {
      const objectStore = db.createObjectStore('history', {
        keyPath: 'key'
      })

      // objectStore.createIndex('title', 'title')
      // objectStore.createIndex('cover', 'cover')
      // objectStore.createIndex('origin', 'origin')
      // objectStore.createIndex('pageOption', 'pageOption')
    }
    const { newVersion, oldVersion } = event
    console.log(this)
  }
}
