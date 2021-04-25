const { controllers } = global

module.exports = {
  routes: { 'GET /': controllers.root.index }
}
