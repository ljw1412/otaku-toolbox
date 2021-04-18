const fs = require('fs')
const path = require('path')

function loadServices() {
  const services = {}

  const list = fs
    .readdirSync(__dirname)
    .filter(filename => filename.includes('.js') && filename !== 'index.js')

  list.forEach(filename => {
    const { name } = path.parse(filename)
    const service = require(path.join(__dirname, filename))
    if (typeof service === 'object') {
      services[name] = service
    }
  })

  global.services = services
}

module.exports = loadServices
