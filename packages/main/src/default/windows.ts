import { BrowserWindow } from 'electron'
import { getPageUrl } from '../utils/pageUrl'
import { createBrowser } from '../window'

export default function(mainWin: BrowserWindow) {
  const exitAppWin = createBrowser({
    autoShow: false,
    parent: mainWin,
    modal: true,
    width: 300,
    height: 150,
    url: getPageUrl('/exit-app'),
    resizable: false,
    minimizable: false,
    maximizable: false,
    singleInstance: true,
    title: '退出程序'
  })
  return { exitAppWin }
}
