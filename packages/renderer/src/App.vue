<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { clearNavigationCache } from '/@/utils/cache'
import { ipcOn } from '/@/utils/electron'

export default defineComponent({
  name: 'App',

  created() {
    // 监听全局主题切换
    ipcOn('window.message', (e, type) => {
      if (type === 'theme-updated') {
        window.$theme.init()
      } else if (type === 'clear-navigation-cache') {
        clearNavigationCache()
      }
    })
  }
})
</script>

<style>
body {
  color: var(--app-color-text);
  background-color: var(--app-color-bg);
}
</style>
