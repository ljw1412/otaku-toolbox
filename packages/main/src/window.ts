import { BrowserView, BrowserWindow } from 'electron'
import { join } from 'path'
import { getPageUrl } from './utils/pageUrl'
import newWindowHandler from './utils/newWindow'
import baseListerner from './listeners/baseListener'

const env = import.meta.env

export function createBuiltInBrowser(data: Record<string, any>): BrowserWindow {
  console.log(data)

  const newWin = new BrowserWindow({
    minWidth: 1280,
    minHeight: 720,
    frame: false,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../../preload/dist/index.cjs'),
      contextIsolation: env.MODE !== 'test', // Spectron tests can't work with contextIsolation: true
      enableRemoteModule: env.MODE === 'test', // Spectron tests can't work with enableRemoteModule: false
      webSecurity: false,
      allowRunningInsecureContent: true
    }
  })

  const pageUrl = getPageUrl('browser')
  newWin.loadURL(pageUrl)
  baseListerner(newWin)
  newWin.once('ready-to-show', () => {
    newWin.show()
    if (env.MODE === 'development') {
      newWin.webContents.openDevTools()
    }
  })
  newWin.on('close', () => {
    //@ts-ignore
    view.webContents.destroy()
  })

  const view = new BrowserView()
  newWin.setBrowserView(view)
  view.setBounds({ x: 0, y: 40, width: 800, height: 600 - 40 })
  view.setAutoResize({ width: true, height: true })
  view.webContents.loadURL(data.url)
  view.webContents.on('page-title-updated', (e, title) => {
    console.log(title)
    newWin.webContents.executeJavaScript(`document.title='${title}'`)
  })
  newWindowHandler(view)
  return newWin
}

function safeBoolean(b?: boolean): boolean {
  return b === undefined ? true : b
}

export function createBrowser(config: NewBrowerConfig): BrowserWindow {
  if (config.singleInstance && config.title) {
    const allWindows = BrowserWindow.getAllWindows()
    const win = allWindows.find(win => win.getTitle() === config.title)
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
      return win
    }
  }

  const newWin = new BrowserWindow({
    width: config.width || 1280,
    height: config.height || 720,
    frame: config.frame || false,
    minWidth: config.minWidth,
    minHeight: config.minHeight,
    maxWidth: config.maxWidth,
    maxHeight: config.maxHeight,
    resizable: safeBoolean(config.resizable),
    minimizable: safeBoolean(config.minimizable),
    maximizable: safeBoolean(config.maximizable),
    title: config.title,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../../preload/dist/index.cjs'),
      contextIsolation: env.MODE !== 'test', // Spectron tests can't work with contextIsolation: true
      enableRemoteModule: env.MODE === 'test', // Spectron tests can't work with enableRemoteModule: false
      webSecurity: false,
      allowRunningInsecureContent: true
    }
  })
  baseListerner(newWin)
  newWin.loadURL(config.url)
  newWin.once('ready-to-show', () => {
    newWin.show()
    if (env.MODE === 'development') {
      newWin.webContents.openDevTools()
    }
  })
  return newWin
}
