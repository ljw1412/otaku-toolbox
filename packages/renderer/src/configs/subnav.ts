const moduleSubnavMap = {
  anime: [
    { name: '首页', routeName: 'AppAnimeHome' },
    { name: '索引', routeName: 'AppAnimeIndex' }
  ]
}

export default function getSubnav(module: keyof typeof moduleSubnavMap) {
  return moduleSubnavMap[module] || []
}
