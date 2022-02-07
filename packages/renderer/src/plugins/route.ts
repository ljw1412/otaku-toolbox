export default [
  {
    path: '/plugin-page',
    name: 'PluginPage',
    component: () => import('./PluginPage.vue'),
    meta: { maximizable: false }
  }
]
