import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import BaseAction from './ipc/index'
import baseListerner from './listeners/baseListener'
import newWindowHandler from './utils/newWindow'
import createQuickWindows from './default/windows'
import { getPageUrl } from './utils/pageUrl'
import * as storage from './utils/storage'
import DataCenter from './dataCenter/index'

storage.init(join(app.getAppPath(), 'data'))

app.setAppUserModelId(import.meta.env.VITE_APP_TITLE)
const isSingleInstance = app.requestSingleInstanceLock()

if (!isSingleInstance) {
  app.quit()
  process.exit(0)
}

app.disableHardwareAcceleration()

/**
 * Workaround for TypeScript bug
 * @see https://github.com/microsoft/TypeScript/issues/41468#issuecomment-727543400
 */
const env = import.meta.env

// Install "Vue.js devtools"
if (env.MODE === 'development') {
  app
    .whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({ default: installExtension, VUEJS3_DEVTOOLS }) =>
      installExtension(VUEJS3_DEVTOOLS, {
        loadExtensionOptions: {
          allowFileAccess: true
        }
      })
    )
    .catch(e => console.error('Failed install extension:', e))
}

let mainWindow: BrowserWindow | null = null

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    minWidth: 1280,
    minHeight: 720,
    show: false, // Use 'ready-to-show' event to show window
    frame: false,
    title: '御宅工具箱',
    webPreferences: {
      preload: join(__dirname, '../../preload/dist/index.cjs'),
      contextIsolation: env.MODE !== 'test', // Spectron tests can't work with contextIsolation: true
      webSecurity: false,
      disableHtmlFullscreenWindowResize: true,
      allowRunningInsecureContent: true
    }
  })

  baseListerner(mainWindow)

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    BaseAction.bind()
    DataCenter.bind()

    if (env.MODE === 'development') {
      mainWindow?.webContents.openDevTools()
    }
  })

  mainWindow.on('closed', () => {
    BrowserWindow.getAllWindows().forEach(win => {
      win.close()
    })
  })

  newWindowHandler(mainWindow)
  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl = getPageUrl('main')

  await mainWindow.loadURL(pageUrl)

  global.quickWindows = createQuickWindows(mainWindow)
}

app.on('second-instance', () => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

app.on('window-all-closed', () => {
  BaseAction.unbind()
  DataCenter.unbind()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.whenReady().then(() => import('./utils/requestFix'))

app
  .whenReady()
  .then(createWindow)
  .catch(e => console.error('Failed create window:', e))

// Auto-updates
if (env.PROD) {
  app
    .whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch(e => console.error('Failed check updates:', e))
}
