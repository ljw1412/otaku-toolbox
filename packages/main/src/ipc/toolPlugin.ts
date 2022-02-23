import { app, ipcMain } from 'electron'
import { join } from 'path'
import request from '../dataCenter/request'
import fs from 'fs'
const fsp = fs.promises

const BASE_PLUGIN_DIR = join(app.getAppPath(), 'plugins')
const channel = 'tool-plugin'

function getPluginUrl(pluginName: string, ext = '.js') {
  return `https://gitee.com/ljw1412/otaku-toolbox-plugins/raw/main/plugins/${pluginName}/index${ext}`
}

function getDevPluginUrl(pluginName: string, serve: string) {
  return `${serve}/plugins/${pluginName}/index.js`
}

function getPluginFilePath(pluginName: string, ext = '.js') {
  return join(BASE_PLUGIN_DIR, pluginName + ext)
}

async function downloadPlugin(plugin: ToolPluginBase) {
  const url = getPluginUrl(plugin.plugin)
  const data = await request.get(url)
  await fsp.writeFile(getPluginFilePath(plugin.plugin), data.text || data.body)
  if (plugin.css) {
    const cssUrl = getPluginUrl(plugin.plugin, '.css')
    const cssData = await request.get(cssUrl)
    await fsp.writeFile(
      getPluginFilePath(plugin.plugin, '.css'),
      cssData.text || cssData.body
    )
  }
}

async function removePlugin(plugin: ToolPluginBase) {
  await fsp.rm(getPluginFilePath(plugin.plugin))
}

function bind(): void {
  fsp.mkdir(BASE_PLUGIN_DIR, { recursive: true })
  ipcMain.handle(channel, async (e, type, data) => {
    try {
      if (data.isDev) return {}
      if (type === 'download' || type === 'update') {
        await downloadPlugin(data)
        return {}
      } else if (type === 'remove') {
        await removePlugin(data)
        return {}
      } else if (type === 'getPath') {
        return getPluginFilePath(data.plugin, data.ext || '.js')
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
