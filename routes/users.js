const { controllers } = global

module.exports = {
  prefix: '/users',
  routes: {
    'GET /': controllers.users.index
  }
}
