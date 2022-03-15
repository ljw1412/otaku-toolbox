import request from '../../utils/request'
import { channel, tessdataPath } from './index'
import { join } from 'path'
import fsp from 'fs/promises'

interface TessdataFile {
  path: string
  size: number
  url: string
}

let cacheTessdataList: TessdataFile[] = []
const treeUrl =
  'https://gitee.com/api/v5/repos/ljw1412/tessdata_best/git/trees/main'
async function fetchTessdataList() {
  if (cacheTessdataList.length) return
  const resp = await request.get(treeUrl)
  cacheTessdataList = (resp.body.tree as TessdataFile[]).filter(item =>
    item.path.endsWith('.traineddata')
  )
}

function getLangData(name: string) {
  const tessdataName = `${name}.traineddata`
  const item = (cacheTessdataList.find(item => item.path === tessdataName) ||
    {}) as TessdataFile
  return {
    name,
    ...item
  }
}

export async function downloadLangData(
  data: Record<string, any>,
  sender: Electron.WebContents
) {
  await fetchTessdataList()
  const langData = data.file.map(getLangData)
  let successCount = 0
  for (const lang of langData) {
    if (!lang.path) {
      sender.send('ocr-lang-data', 'error', {
        ...data,
        error: new Error('下载地址获取失败')
      })
      break
    }
    console.log(`[${channel}Action:Download]`, lang)
    try {
      const resp = await request.get(lang.url).on('progress', e => {
        sender.send('ocr-lang-data', 'progress', { ...data, ...e, langData })
      })
      await fsp.writeFile(join(tessdataPath, lang.path), resp.body.content, {
        encoding: 'base64'
      })
      successCount++
    } catch (error) {
      lang.error = error
    }
  }
  sender.send(
    'ocr-lang-data',
    successCount === langData.length ? 'success' : 'error',
    { ...data, langData }
  )
}
