import * as storage from 'electron-json-storage'
import { only } from './object'
import acgAppConfig from '../default/config'

const BASE_CONFIG_NAME = 'config'

export function init(path: string): void {
  storage.setDataPath(path)
  // 同步基础配置
  getConfig()
}

export async function getConfig(keys?: string | string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    storage.get(BASE_CONFIG_NAME, (error, data) => {
      if (error) return reject(error)
      if (!keys) {
        resolve(Object.assign(acgAppConfig, data))
      } else {
        if (!Array.isArray(keys)) keys = [keys]
        resolve(only(data, keys))
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
