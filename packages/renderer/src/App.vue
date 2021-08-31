<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ipcOn } from './utils/electron'

export default defineComponent({
  name: 'App',

  created() {
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
