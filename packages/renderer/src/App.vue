<template>
  <router-view />
  <app-font-loader></app-font-loader>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppFontLoader from './components/AppFontLoader.vue'
import { ipcOn } from './utils/electron'

export default defineComponent({
  name: 'App',
  components: { AppFontLoader },

  created() {
    // 监听全局主题切换
    ipcOn('window.message', (e, type) => {
      if (type === 'theme-updated') {
        window.$theme.init()
      }
    })
  }
})
</script>

<style>
body {
  color: var(--text-color);
  background-color: var(--bg-color);
}
</style>
