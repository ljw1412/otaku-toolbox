const { services } = global

module.exports = {
  prefix: '/users',
  routes: {
    'GET /': services.users.index
  }
}
