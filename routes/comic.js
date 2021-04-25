const { controllers } = global

module.exports = {
  prefix: '/comic',
  routes: { 'GET /': controllers.comic.index },
  routes: { 'GET /:website': controllers.comic.website }
}
