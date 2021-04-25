const { services } = global

module.exports = {
  index: async function(ctx, next) {
    await ctx.render('comic/index', {
      title: '二次元工具箱 - 漫画',
      websites: [{ id: 'zorebyz', name: 'zore搬运站' }]
    })
  },
  website: async function(ctx, next) {
    const { website } = ctx.params
    const { p = 1 } = ctx.query
    const data = await services.comic.getList(website, p)

    await ctx.render('comic/website', {
      title: `二次元工具箱 - 漫画 - ${website}`,
      data
    })
  }
}
