import fs from 'fs'
const fsp = fs.promises

export async function init(path: string) {
  fsp.mkdir(path, { recursive: true })
}
