import type { BrowserView, BrowserWindow } from 'electron'
import { shell } from 'electron'
import { loadView } from '../views'
import acgAppConfig from '../default/config'

async function openExternal(url: string) {
  const HTTP_REGEXP = /^https?:\/\//
  // 非http协议不打开，防止出现自定义协议等导致的安全问题
  if (!HTTP_REGEXP) {
    return false
  }
  try {
    await shell.openExternal(url)
    return true
  } catch (error) {
    console.error('open external error: ', error)
    return false
  }
}

export default function(browerWindow: BrowserWindow | BrowserView): void {
  browerWindow.webContents.on(
    'new-window',
    (event, url, frameName, disposition) => {
      console.log(url, frameName, disposition)

      if (['foreground-tab', 'new-window'].includes(disposition)) {
        // 阻止鼠标点击链接
        event.preventDefault()
        if (acgAppConfig.use_system_browser) {
          openExternal(url)
        } else {
          loadView({ url })
        }
      }
    }
  )
}
