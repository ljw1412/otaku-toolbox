import { BrowserView, BrowserWindow } from 'electron'
import { join } from 'path'
import { getPageUrl } from './utils/pageUrl'

const env = import.meta.env

export function loadView(data: Record<string, any>): BrowserWindow {
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

  const pageUrl = getPageUrl('view')
  newWin.loadURL(pageUrl)
  newWin.on('ready-to-show', () => {
    newWin.webContents.executeJavaScript(`window.tabId=${newWin.id}`)
  })
  newWin.once('ready-to-show', () => {
    newWin.show()
    if (env.MODE === 'development') {
      newWin.webContents.openDevTools()
    }
  })

  const view = new BrowserView()
  newWin.setBrowserView(view)
  view.setBounds({ x: 0, y: 36, width: 800, height: 600 - 36 })
  view.setAutoResize({ width: true, height: true })
  view.webContents.loadURL(data.url)
  view.webContents.on('page-title-updated', (e, title) => {
    console.log(title)
    newWin.webContents.executeJavaScript(`document.title='${title}'`)
  })
  return newWin
}
