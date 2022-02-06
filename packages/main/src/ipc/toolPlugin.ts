import { app, ipcMain } from 'electron'
import { join } from 'path'
import request from '../dataCenter/request'
import fs from 'fs'
const fsp = fs.promises

const BASE_PLUGIN_DIR = join(app.getAppPath(), 'plugins')
const channel = 'tool-plugin'

function getPluginUrl(pluginName: string) {
  return `https://gitee.com/ljw1412/otaku-toolbox-plugins/raw/main/plugins/${pluginName}/index.js`
}

function getPluginFilePath(pluginName: string) {
  return join(BASE_PLUGIN_DIR, pluginName + '.js')
}

async function downloadPlugin(plugin: ToolPluginBase) {
  const data = await request.get(getPluginUrl(plugin.plugin))
  await fsp.writeFile(getPluginFilePath(plugin.plugin), data.text)
}

async function removePlugin(plugin: ToolPluginBase) {
  await fsp.rm(getPluginFilePath(plugin.plugin))
}

function bind(): void {
  fsp.mkdir(BASE_PLUGIN_DIR, { recursive: true })
  ipcMain.handle(channel, async (e, type, data) => {
    try {
      if (type === 'download' || type === 'update') {
        await downloadPlugin(data)
        return {}
      } else if (type === 'remove') {
        await removePlugin(data)
        return {}
      } else if (type === 'getPath') {
        return getPluginFilePath(data.plugin)
      }
    } catch (error) {
      return { error }
    }
  })
}

function unbind(): void {
  ipcMain.removeHandler(channel)
}

export default {
  bind,
  unbind
}
