import { toRaw } from 'vue'
import { useElectron } from '/@/utils/electron'
import * as logger from '/@/utils/logger'

const { ipcRenderer } = useElectron()

const channel = 'data-center'

export async function saveRule(rule: Record<string, any>) {
  const result = await ipcRenderer.invoke(channel, 'saveRule', {
    rule: toRaw(rule)
  })
  logger.message('saveRule', '\n规则:', rule, '\n结果:', result)
  return result
}

export async function removeRule(rule: Record<string, any>) {
  const result = await ipcRenderer.invoke(channel, 'removeRule', {
    rule: toRaw(rule)
  })
  logger.message('removeRule', '\n规则:', rule, '\n结果:', result)
  return result
}

export async function listRules(type = '') {
  const result = await ipcRenderer.invoke(channel, 'listRules', { type })
  logger.message('listRules', '\n类型:', type, '\n结果:', result)
  return result
}

export async function showRule(type: string, origin: string) {
  const params = { type, origin }
  const result = await ipcRenderer.invoke(channel, 'showRule', params)
  logger.message('showRule', '\n参数:', params, '\n结果:', result)
  return result
}

export async function runRule(
  rule: DataCenter.NewsRule | DataCenter.ComicRule | DataCenter.RulePageParams,
  page?: number,
  config: DataCenter.RunnerOptions = { replacer: { page: 1 } }
) {
  if (!config.replacer) config.replacer = { page: page || 1 }
  else if (config.replacer.page === undefined) config.replacer.page = page
  const params = { rule, config }
  const result = await ipcRenderer.invoke(channel, 'runRule', params)
  logger.message('runRule', '\n规则:', rule, '\n结果:', result)
  return result
}

export async function listNews(
  type = '',
  origin: string,
  page?: number,
  config: DataCenter.RunnerOptions = { replacer: {} }
) {
  if (!config.replacer) config.replacer = { page: page || 1 }
  else if (config.replacer.page === undefined) config.replacer.page = page
  const params = { type, origin, config }
  const result = await ipcRenderer.invoke(channel, 'fetch', params)
  logger.message('listNews', '\n参数:', params, '\n结果:', result)
  return result
}
