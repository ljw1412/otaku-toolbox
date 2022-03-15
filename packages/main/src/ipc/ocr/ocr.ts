import { createWorker, createScheduler, recognize } from 'tesseract.js'
import { tessdataPath } from './index'

const scheduler = createScheduler()
let worker: Tesseract.Worker

export function initWorker() {
  worker = createWorker({
    logger: m => console.log(m),
    gzip: false,
    cachePath: tessdataPath,
    langPath: 'https://gitee.com/ljw1412/tessdata_best/raw/main'
  })
  scheduler.addWorker(worker)
}

export async function addJob(
  lang: string,
  image: any,
  done: (result: any) => void
) {
  await worker.load()
  await worker.loadLanguage(lang)
  await worker.initialize(lang)
  await worker.setParameters({
    preserve_interword_spaces: '1'
  })
  const result = await scheduler.addJob('recognize', image)
  console.log(result)
  done(result)
  return result
}

// recognize(image, lang, {
//   logger: m => console.log(m),
//   gzip: false,
//   cachePath: tessdataPath,
//   langPath: 'https://gitee.com/ljw1412/tessdata_best/raw/main'
// })

export function terminate() {
  scheduler.terminate()
}
