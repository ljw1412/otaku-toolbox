import { useElectron } from '/@/utils/electron'

const { ipcRenderer } = useElectron()

const channel = 'data-center'

export async function listNews(
  type = '',
  origin: string,
  page?: number,
  config: Record<string, any> = { replacer: {} }
) {
  if (!config.replacer) config.replacer = { page }
  else if (config.replacer.page === undefined) config.replacer.page = page
  return ipcRenderer.invoke(channel, type, origin, config)
}
