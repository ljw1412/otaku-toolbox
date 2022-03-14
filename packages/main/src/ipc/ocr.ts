import { ipcMain, app } from 'electron'
import { join } from 'path'
import { createWorker, createScheduler, recognize } from 'tesseract.js'
import fsp from 'fs/promises'

const channel = 'ocr'
const tessdataPath = join(app.getAppPath(), 'tessdata')
fsp.mkdir(tessdataPath, { recursive: true })

const scheduler = createScheduler()
const worker = createWorker({
  logger: m => console.log(m),
  gzip: false,
  cachePath: tessdataPath,
  langPath: 'https://gitee.com/ljw1412/tessdata_best/raw/main'
})
scheduler.addWorker(worker)

let loaded = false

async function addJob(lang: string, image: any, done: (result: any) => void) {
  if (!loaded) {
    await worker.load()
    await worker.loadLanguage(lang)
    await worker.initialize(lang)
    await worker.setParameters({
      preserve_interword_spaces: '1'
    })
    loaded = true
  }
  const result = await scheduler.addJob('recognize', image)
  console.log(result)
  done(result)
  return result
}

const listener: IpcListener = async (e, type, data) => {
  console.log(`[${channel}Action]`, type, data)
  // const { tabId } = data
  if (type === 'recognize') {
    const { id, lang, image, options } = data
    addJob(lang, image, result => {
      e.sender.send('ocr', 'recognize-result', Object.assign(result, { id }))
    })
    // recognize(image, lang, {
    //   logger: m => console.log(m),
    //   gzip: false,
    //   cachePath: tessdataPath,
    //   langPath: 'https://gitee.com/ljw1412/tessdata_best/raw/main'
    // })
  }
}

function bind(): void {
  ipcMain.on(channel, listener)
}

function unbind(): void {
  ipcMain.off(channel, listener)
  console.log(`${channel} 结束监听`)
  scheduler.terminate()
}

export default {
  bind,
  unbind
}
