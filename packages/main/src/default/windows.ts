import { BrowserWindow } from 'electron'
import { getPageUrl } from '../utils/pageUrl'
import { createBrowser } from '../window'

const windowConfigs = {
  exitApp: {
    url: getPageUrl('/exit-app'),
    parent: true,
    modal: true,
    width: 300,
    height: 150,
    title: '退出程序'
  },
  setting: {
    url: getPageUrl('/setting'),
    width: 729,
    height: 540,
    title: '系统设置'
  },
  theme: {
    url: getPageUrl('/theme'),
    width: 640,
    height: 480,
    title: '主题'
  }
} as Record<string, NewBrowerConfig>

function createWindow(config: NewBrowerConfig) {
  return createBrowser({
    autoShow: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    singleInstance: true,
    ...config
  })
}

export default function(mainWin: BrowserWindow) {
  return Object.keys(windowConfigs).reduce((obj, key) => {
    const config = windowConfigs[key]
    if (config.parent) {
      config.parent = mainWin
    }
    obj[key] = createWindow(config)
    return obj
  }, {} as Record<string, BrowserWindow>)
}
