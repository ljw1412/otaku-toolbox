<template>
  <div class="plugin-page">
    <app-mini-header v-if="!$route.query.hideHeader"
      :title="mTitle"></app-mini-header>
    <main id="plugin-main"></main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppMiniHeader from '/@/containers/components/AppMiniHeader.vue'
import './index'
import { ipcInvoke } from '../utils/electron'
import { pluginStore } from '/@/stores/index'

export default defineComponent({
  name: 'PluginPage',

  components: { AppMiniHeader },

  computed: {
    mTitle() {
      return this.$route.query.title || ''
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    async init() {
      const { isDev, plugin: pluginName } = this.$route.query
      let url = null
      const script = document.createElement('script')
      if (isDev) {
        console.log('使用插件开发模式运行')
        url = new URL(`${pluginStore.devUrl}/plugins/${pluginName}/index.js`)
        const resp = await fetch(url.href)
        const text = await resp.text()
        const blob = new Blob([text], { type: 'text/javascript' })
        url = URL.createObjectURL(blob)
        script.src = url
      } else {
        const filePath = await ipcInvoke('tool-plugin', 'getPath', {
          plugin: pluginName
        })
        url = new URL(filePath)
        script.src = url.href
      }
      document.body.appendChild(script)
    }
  }
})
</script>

<style lang="scss">
.plugin-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .app-mini-header {
    flex-shrink: 0;
  }

  #plugin-main {
    flex-grow: 1;
    overflow: auto;
  }
}
</style>
