import { BrowserView, BrowserWindow } from 'electron'
import { join } from 'path'
import { getPageUrl } from './utils/pageUrl'
import newWindowHandler from './utils/newWindow'
import baseListerner from './listeners/baseListener'
import { createDefaultWinByTitle } from './default/windows'

const env = import.meta.env

function safeBoolean(b?: boolean): boolean {
  return b === undefined ? true : b
}

/**
 * 创建内置浏览器
 * @param data {url:string}
 * @returns
 */
export function createBuiltInBrowser(data: Record<string, any>): BrowserWindow {
  console.log(data)

  const newWin = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 640,
    minHeight: 480,
    frame: false,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../../preload/dist/index.cjs'),
      contextIsolation: env.MODE !== 'test', // Spectron tests can't work with contextIsolation: true
      webSecurity: false,
      allowRunningInsecureContent: true
    }
  })

  const pageUrl = getPageUrl('browser', { outlink: data.url })
  newWin.loadURL(pageUrl)
  baseListerner(newWin)

  const view = new BrowserView()
  view.setBounds({ x: 0, y: 40, width: 1280, height: 720 - 40 })
  view.setAutoResize({ width: true, height: true })

  newWin.once('ready-to-show', () => {
    view.webContents.loadURL(data.url)
    view.webContents.on('page-title-updated', (e, title) => {
      console.log(title)
      newWin.webContents.send('window-page-updated', 'title', { title })
    })
    view.webContents.on('page-favicon-updated', (e, favicons) => {
      console.log(favicons)
      newWin.webContents.send('window-page-updated', 'favicon', { favicons })
    })
    newWindowHandler(view)
    newWin.setBrowserView(view)
    newWin.show()
    if (env.MODE === 'development') {
      newWin.webContents.openDevTools()
    }
  })
  newWin.on('close', () => {
    if (!view.webContents.isDestroyed()) {
      //@ts-ignore
      view.webContents.destroy()
    }
  })

  return newWin
}

/**
 * 创建窗体
 * @param config
 * @returns
 */
export function createBrowser(config: NewBrowerConfig): BrowserWindow {
  if (config.singleInstance && config.title) {
    const win = getWindowByTitle(config.title)
    if (win) {
      if (!win.isVisible()) win.show()
      if (win.isMinimized()) win.restore()
      win.focus()
      return win
    }
  }

  const newWin = new BrowserWindow({
    parent: config.parent || false,
    modal: config.modal || false,
    width: config.width || 1280,
    height: config.height || 720,
    frame: config.frame || false,
    alwaysOnTop: config.alwaysOnTop || false,
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
      webSecurity: false,
      webviewTag: config.webview,
      allowRunningInsecureContent: true
    }
  })
  newWindowHandler(newWin)
  baseListerner(newWin)
  newWin.loadURL(config.url)

  if (config.autoShow || config.autoShow === undefined) {
    newWin.once('ready-to-show', () => {
      newWin.show()
    })
  }

  newWin.on('show', () => {
    if (env.MODE === 'development') {
      newWin.webContents.openDevTools()
    }
  })

  newWin.on('hide', () => {
    if (env.MODE === 'development') {
      newWin.webContents.closeDevTools()
    }
  })

  return newWin
}

/**
 * 窗体是否存在
 * @param title
 */
export function getWindowByTitle(title?: string) {
  const allWindows = BrowserWindow.getAllWindows()
  const win = allWindows.find(win => win.getTitle() === title) || null
  return win
}

/**
 * 打开APP默认窗体
 * @param config { title: string }
 * @returns
 */
export function openAppSystemWindow(
  config: NewBrowerConfig
): BrowserWindow | null {
  const { title } = config
  const win = getWindowByTitle(title)
  if (win) {
    if (!win.isVisible()) {
      win.center()
      win.show()
    }
    if (win.isMinimized()) win.restore()
    win.focus()
    return win
  }
  return createDefaultWinByTitle(title, true)
}

/**
 * 开关开发者工具
 * @param win 目标窗体
 */
export function toggleDevTools(win: BrowserWindow) {
  try {
    const view = win.getBrowserView()
    if (view) {
      view.webContents.toggleDevTools()
    }
  } catch (error) {
    console.error(error)
  }
}
