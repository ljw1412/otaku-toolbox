import { useElectron } from '/@/utils/electron'

const { ipcRenderer } = useElectron()

const channel = 'data-center'

export async function saveRule(rule: Record<string, any>) {
  return ipcRenderer.invoke(channel, 'saveRule', { rule })
}

export async function listRules(type = '') {
  return ipcRenderer.invoke(channel, 'listRules', { type })
}

export async function listNews(
  type = '',
  origin: string,
  page?: number,
  config: Record<string, any> = { replacer: {} }
) {
  if (!config.replacer) config.replacer = { page }
  else if (config.replacer.page === undefined) config.replacer.page = page
  return ipcRenderer.invoke(channel, 'fetch', { type, origin, config })
}
