export default class BaseIDBTable<T> {
  db: IDBDatabase

  get tableName() {
    return ''
  }

  constructor(db: IDBDatabase) {
    this.db = db
    if (!this.tableName) {
      throw new Error('未设置表格名称')
    }
  }

  // @overwrite
  static upgrade(db: IDBDatabase, event: IDBVersionChangeEvent) {}

  getObjectStore(mode: IDBTransactionMode) {
    return this.db.transaction(this.tableName, mode).objectStore(this.tableName)
  }

  requestResultFormat(
    request: IDBRequest,
    resolve: (value: any) => void,
    reject: (reason?: any) => void
  ) {
    request.onsuccess = function(e) {
      // @ts-ignore
      resolve(e.target.result)
    }
    request.onerror = function(e) {
      // @ts-ignore
      reject(e.target.error)
    }
  }

  add(data: Record<string, any>): Promise<T> {
    return new Promise((resolve, reject) => {
      const request = this.getObjectStore('readwrite').add(data)
      this.requestResultFormat(request, resolve, reject)
    })
  }

  update(data: Record<string, any>): Promise<T> {
    return new Promise((resolve, reject) => {
      const request = this.getObjectStore('readwrite').put(data)
      this.requestResultFormat(request, resolve, reject)
    })
  }

  async remove(name: string, query: IDBValidKey | IDBKeyRange): Promise<any> {
    const objectStore = this.getObjectStore('readwrite')
    let key = name
    if (query !== undefined) {
      const data: any = await new Promise((resolve, reject) => {
        const readRequest = objectStore.index(name).get(query)
        this.requestResultFormat(readRequest, resolve, reject)
      })
      key = data.id
    }
    return new Promise((resolve, reject) => {
      const request = objectStore.delete(key)
      this.requestResultFormat(request, resolve, reject)
    })
  }

  read(query: IDBValidKey | IDBKeyRange): Promise<T> {
    return new Promise((resolve, reject) => {
      const request = this.getObjectStore('readonly').get(query)
      this.requestResultFormat(request, resolve, reject)
    })
  }

  readIndex(name: string, query: IDBValidKey | IDBKeyRange): Promise<T> {
    return new Promise((resolve, reject) => {
      const request = this.getObjectStore('readonly')
        .index(name)
        .get(query)
      this.requestResultFormat(request, resolve, reject)
    })
  }

  readAll(query?: IDBValidKey | IDBKeyRange): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const request = this.getObjectStore('readonly').getAll(query)
      this.requestResultFormat(request, resolve, reject)
    })
  }
}
