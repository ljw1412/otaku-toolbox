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
  login: {
    url: getPageUrl('/login'),
    width: 540,
    height: 330,
    title: '登录'
  },
  setting: {
    url: getPageUrl('/setting'),
    width: 729,
    height: 540,
    title: '系统设置'
  },
  about: {
    url: getPageUrl('/about'),
    parent: true,
    modal: true,
    width: 480,
    height: 400,
    title: '关于'
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

export function createDefaultWinByTitle(title?: string, autoShow = false) {
  const config = Object.values(windowConfigs).find(
    (item) => item.title === title
  )
  return config ? createWindow({ ...config, autoShow }) : null
}

export default function (mainWin: BrowserWindow) {
  return Object.keys(windowConfigs).reduce((obj, key) => {
    const config = windowConfigs[key]
    if (config.parent) {
      config.parent = mainWin
    }
    obj[key] = createWindow(config)
    return obj
  }, {} as Record<string, BrowserWindow>)
}
