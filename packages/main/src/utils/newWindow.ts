import type { BrowserWindow } from 'electron'

import { shell } from 'electron'
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

export default function (browerWindow:BrowserWindow):void {
  browerWindow.webContents.on('new-window', (event, url, frameName, disposition) =>{
    if (disposition === 'foreground-tab') {
      // 阻止鼠标点击链接
      event.preventDefault()
      openExternal(url)
  }
  })
}