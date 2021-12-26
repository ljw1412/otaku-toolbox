import BaseIDBTable from '../BaseTable'

export default class Favorites extends BaseIDBTable<ComicItem> {
  get tableName() {
    return 'favorites'
  }

  static upgrade(db: IDBDatabase, event: IDBVersionChangeEvent) {
    if (!db.objectStoreNames.contains('favorites')) {
      const objectStore = db.createObjectStore('favorites', {
        keyPath: 'key'
      })
    }
    const { newVersion, oldVersion } = event
    console.log(this)
  }
}
