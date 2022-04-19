import { toRaw } from 'vue'
import { ipcInvoke } from '/@/utils/electron'
import * as logger from '/@/utils/logger'

const channel = 'data-center'

async function invoke(action: string, params: Record<string, any> = {}) {
  const result = await ipcInvoke(channel, action, params)
  logger.message(channel, action, '参数:', params, '结果:', result)
  return result
}

export async function saveRule(rule: Record<string, any>) {
  return await invoke('saveRule', { rule: toRaw(rule) })
}

export async function removeRule(rule: Record<string, any>) {
  const data = { type: rule.type, namespace: rule.namespace }
  return await invoke('removeRule', { rule: data })
}

export async function listRules(type = '') {
  return await invoke('listRules', { type })
}

export async function showRule(type: string, origin: string) {
  return await invoke('showRule', { type, origin })
}

export async function runRule(
  rule: DataCenter.NewsRule | DataCenter.ComicRule | DataCenter.RulePageParams,
  page = 1,
  config: DataCenter.RunnerOptions = { replacer: {} }
) {
  if (!config.replacer) config.replacer = {}
  if (config.replacer.page === undefined) config.replacer.page = page
  return await invoke('runRule', { rule, config })
}
