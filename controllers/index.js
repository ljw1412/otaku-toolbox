const fs = require('fs')
const path = require('path')

function loadControllers() {
  const controllers = {}

  const list = fs
    .readdirSync(__dirname)
    .filter(filename => filename.includes('.js') && filename !== 'index.js')

  list.forEach(filename => {
    const { name } = path.parse(filename)
    const controller = require(path.join(__dirname, filename))
    if (typeof controller === 'object') {
      controllers[name] = controller
    }
  })

  global.controllers = controllers
}

module.exports = loadControllers
