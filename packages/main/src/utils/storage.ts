import fs from 'fs'
import { basename } from 'path'
import * as storage from 'electron-json-storage'
import { only } from './object'
import acgAppConfig from '../default/config'
import initRules from '../dataCenter/init'
const fsp = fs.promises

export async function init(path: string): Promise<void> {
  storage.setDataPath(path)
  // 同步基础配置
  await getConfig()
  // 初始化规则，如果未初始化的话
  if (!acgAppConfig.initialized_rule) {
    await initRules()
  } else {
    console.log('[规则初始化]', '无需再次初始化')
  }
}

const BASE_CONFIG_NAME = 'config'

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
    data = Object.assign(acgAppConfig, data)
    storage.set(BASE_CONFIG_NAME, data, error => {
      if (error) return reject(error)
      resolve(true)
    })
  })
}

const BASE_RULE_NAME = 'rule'

export async function getRuleList(type: string) {
  const dataPath = storage.getDataPath()
  const fileNameList = await fsp.readdir(dataPath)
  const keyword = `${BASE_RULE_NAME}-${type}`
  const keys = fileNameList
    .filter(name => name.includes(keyword))
    .map(name => basename(name, '.json'))
  return new Promise((resolve, reject) => {
    storage.getMany(keys, (error, data) => {
      if (error) return reject(error)
      resolve(Object.values(data))
    })
  })
}

export async function getRule(
  type: string,
  origin: string
): Promise<DataCenter.Rule> {
  const key = `${BASE_RULE_NAME}-${type}-${origin}`
  return new Promise((resolve, reject) => {
    storage.get(key, (error, data) => {
      if (error) return reject(error)
      resolve(data as DataCenter.Rule)
    })
  })
}

export async function setRule(rule: DataCenter.Rule) {
  return new Promise((resolve, reject) => {
    const key = `${BASE_RULE_NAME}-${rule.type}-${rule.namespace}`
    storage.set(key, rule, error => {
      if (error) return reject(error)
      resolve(true)
    })
  })
}
