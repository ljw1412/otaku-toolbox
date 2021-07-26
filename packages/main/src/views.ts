import { BrowserWindow } from 'electron'

export function loadView(mainWindow: Electron.BrowserWindow): BrowserWindow {
  const view = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    show: false
  })
  view.loadURL('')
  view.once('ready-to-show', () => {
    view.show()
  })
  return view
}
