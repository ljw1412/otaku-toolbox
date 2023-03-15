import { BrowserView, BrowserWindow } from 'electron'
import { shell } from 'electron'
import { createBrowser, createBuiltInBrowser } from '../window'
import acgAppConfig from '../default/config'
import { nin } from './object'
import qs from 'qs'

export async function openExternal(url: string) {
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
  browerWindow.webContents.setWindowOpenHandler(datails => {
    const {
      url: oUrl,
      frameName,
      disposition,
      referrer,
      features,
      postBody
    } = datails
    if (
      ['foreground-tab', 'background-tab', 'new-window'].includes(disposition)
    ) {
      let url = oUrl
      let serachParams: Record<string, any> = {}
      const temp = oUrl.split('?')
      if (temp.length > 1) {
        serachParams = qs.parse(temp[1])
      }

      // query带app=otakutools的用内置浏览器打开
      if (serachParams.app === 'otakutools') {
        let appConfig = { minWidth: 1280, minHeight: 720 }
        if (serachParams['app-config']) {
          try {
            appConfig = JSON.parse(serachParams['app-config'])
          } catch (error) {
            console.error('appConfig 解析失败')
          }
        }
        url = temp[0] + '?' + qs.stringify(nin(serachParams, 'app-config'))
        createBrowser({ ...appConfig, url })
      } else if (acgAppConfig.use_system_browser) {
        openExternal(url)
      } else {
        createBuiltInBrowser({ url })
      }
    }
    return { action: 'deny' }
  })
}
