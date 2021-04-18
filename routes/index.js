const fs = require('fs')
const path = require('path')
const Router = require('koa-router')

function createRoute(config) {
  if (typeof config !== 'object') return
  const { prefix, routes = [] } = config
  route = Router()
  if (prefix) route.prefix(prefix)
  Object.keys(routes).forEach(key => {
    let [method, pathname] = key.split(' ')
    if (method && pathname) {
      method = method.toLowerCase()
      if (route[method]) {
        route[method](pathname, routes[key])
      }
    }
  })

  return route
}

module.exports = function loadRoutes(app) {
  if (!app) throw new Error('app is undefined.')
  const list = fs
    .readdirSync(__dirname)
    .filter(filename => filename.includes('.js') && filename !== 'index.js')
  console.log('Load Routers:', list)
  list.forEach(filename => {
    const routerConfig = require(path.join(__dirname, filename))
    const router = createRoute(routerConfig)
    if (router instanceof Router) {
      app.use(router.routes(), router.allowedMethods())
    }
  })
}
