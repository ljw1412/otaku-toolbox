import BaseIDBTable from '../BaseTable'

class Favorites extends BaseIDBTable<ComicItem> {
  get tableName() {
    return 'favorites'
  }

  static upgrade(db: IDBDatabase, event: IDBVersionChangeEvent) {
    if (!db.objectStoreNames.contains('favorites')) {
      const objectStore = db.createObjectStore('favorites', {
        keyPath: 'id',
        autoIncrement: true
      })
      objectStore.createIndex('key', 'key', { unique: true })
      // objectStore.createIndex('title', 'title')
      // objectStore.createIndex('cover', 'cover')
      objectStore.createIndex('origin', 'origin')
      // objectStore.createIndex('pageOption', 'pageOption')
    }
    const { newVersion, oldVersion } = event
    console.log(this)
  }
}

export default Favorites
