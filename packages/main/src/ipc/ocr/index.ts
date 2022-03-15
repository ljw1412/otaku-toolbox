import { ipcMain, app } from 'electron'
import { join } from 'path'
import fsp from 'fs/promises'
import * as Tessdata from './tessdata'
import * as OCR from './ocr'

export const channel = 'ocr'
export const tessdataPath = join(app.getAppPath(), 'tessdata')
fsp.mkdir(tessdataPath, { recursive: true })

OCR.initWorker()

const listener: IpcListener = async (e, type, data) => {
  console.log(`[${channel}Action]`, type, data)
  // const { tabId } = data
  if (type === 'recognize') {
    const { id, lang, image, options } = data
    OCR.addJob(lang, image, result => {
      e.sender.send('ocr-recognize', 'result', Object.assign(result, { id }))
    })
  } else if (type === 'download') {
    Tessdata.downloadLangData(data, e.sender)
  }
}

function bind(): void {
  ipcMain.on(channel, listener)
}

function unbind(): void {
  ipcMain.off(channel, listener)
  console.log(`${channel} 结束监听`)
  OCR.terminate()
}

export default {
  bind,
  unbind
}
