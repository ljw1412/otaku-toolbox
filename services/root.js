module.exports = {
  index: async function(ctx, next) {
    await ctx.render('index', {
      title: 'Hello Koa 2!'
    })
  }
}
