import * as logger from '/@/utils/logger'

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
    reject: (reason?: any) => void,
    action?: string
  ) {
    request.onsuccess = e => {
      // @ts-ignore
      const result = e.target.result
      resolve(result)
      logger.success(`IndexedDB[${this.tableName}]`, action, result)
    }
    request.onerror = e => {
      // @ts-ignore
      const error = e.target.error
      reject(error)
      logger.error(`IndexedDB[${this.tableName}]`, action, error)
    }
  }

  add(data: Record<string, any>): Promise<T> {
    return new Promise((resolve, reject) => {
      const request = this.getObjectStore('readwrite').add(data)
      this.requestResultFormat(request, resolve, reject, '新增')
    })
  }

  update(data: Record<string, any>): Promise<T> {
    return new Promise((resolve, reject) => {
      const request = this.getObjectStore('readwrite').put(data)
      this.requestResultFormat(request, resolve, reject, '更新')
    })
  }

  async addOrUpdate(data: Record<string, any>, keyName = 'key'): Promise<T> {
    const key = data[keyName]
    if (!key) {
      logger.error(
        `IndexedDB[${this.tableName}]`,
        'addOrUpdate',
        '传入对象中未找到对应的key'
      )
      return Promise.reject(new Error('传入对象中未找到对应的key'))
    }
    const isExists = !!(await this.count(key))
    return isExists ? this.update(data) : this.add(data)
  }

  async remove(name: string, query?: IDBValidKey | IDBKeyRange): Promise<any> {
    const objectStore = this.getObjectStore('readwrite')
    let key = name
    if (query !== undefined) {
      const data: any = await new Promise((resolve, reject) => {
        const readRequest = objectStore.index(name).get(query)
        this.requestResultFormat(
          readRequest,
          resolve,
          reject,
          '根据索引查询，等待删除'
        )
      })
      key = data.id
    }
    return new Promise((resolve, reject) => {
      const request = objectStore.delete(key)
      this.requestResultFormat(request, resolve, reject, '删除')
    })
  }

  read(query: IDBValidKey | IDBKeyRange): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      const request = this.getObjectStore('readonly').get(query)
      this.requestResultFormat(request, resolve, reject, '查询')
    })
  }

  readIndex(
    name: string,
    query: IDBValidKey | IDBKeyRange
  ): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      const request = this.getObjectStore('readonly')
        .index(name)
        .get(query)
      this.requestResultFormat(request, resolve, reject, '根据索引查询')
    })
  }

  readAll(query?: IDBValidKey | IDBKeyRange): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const request = this.getObjectStore('readonly').getAll(query)
      this.requestResultFormat(request, resolve, reject, '查询全部')
    })
  }

  count(query?: IDBValidKey | IDBKeyRange): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const request = this.getObjectStore('readonly').count(query)
      this.requestResultFormat(request, resolve, reject, `${query}数量查询`)
    })
  }
}
