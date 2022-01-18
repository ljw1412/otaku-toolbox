const dayjs = require('dayjs')
const date = dayjs().format('YYMMDD')
const buildVersion = `0.25.${date}`

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  directories: {
    output: 'dist',
    buildResources: 'buildResources'
  },
  files: ['packages/**/dist/**'],
  extraMetadata: {
    version: buildVersion
  }
}

module.exports = config
