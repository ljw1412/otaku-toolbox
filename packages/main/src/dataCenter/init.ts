import glob from 'glob'
import { join } from 'path'
import { setConfig, setRule } from '../utils/storage'

export default async function() {
  const files = glob.sync(`${join(__dirname, 'rules')}/**/*.json`)
  console.log(files)
  await Promise.all(
    files.map(async file => {
      const rule = require(file)
      await setRule(rule)
    })
  )
  console.log('[规则初始化]', '完成')
  setConfig({ initialized_rule: true })
}
