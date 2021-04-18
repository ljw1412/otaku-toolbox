const { services } = global

module.exports = {
  routes: { 'GET /': services.root.index }
}
