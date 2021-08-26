import * as storage from 'electron-json-storage'
import { only } from './object'
import acgAppConfig from '../default/config'

const BASE_CONFIG_NAME = 'config'

export function init(path: string): void {
  storage.setDataPath(path)
  // 同步基础配置
  getConfig().then(data => {
    Object.assign(acgAppConfig, data)
  })
}

export async function getConfig(keys?: string | string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    storage.get(BASE_CONFIG_NAME, (error, data) => {
      if (error) return reject(error)
      if (!keys) {
        resolve(data)
      } else {
        resolve(
          Array.isArray(keys)
            ? only(data, keys)
            : data[keys as keyof typeof data]
        )
      }
    })
  })
}

export async function setConfig(data: Record<string, any>): Promise<boolean> {
  return new Promise((resolve, reject) => {
    storage.set(BASE_CONFIG_NAME, data, error => {
      if (error) return reject(error)
      resolve(true)
    })
  })
}
