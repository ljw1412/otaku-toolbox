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
      const { isDev, plugin: pluginName, css } = this.$route.query
      const getUrl = isDev ? this.getDevBlobUrl : this.getPluginUrl
      const jsUrl = await getUrl(pluginName as string, '.js')
      this.appendElement('.js', jsUrl)
      if (css) {
        const cssUrl = await getUrl(pluginName as string, '.css')
        this.appendElement('.css', cssUrl)
      }
    },

    async getDevBlobUrl(pluginName: string, ext: '.css' | '.js') {
      const url = `${pluginStore.devUrl}/plugins/${pluginName}/index${ext}`
      const resp = await fetch(url)
      const text = await resp.text()
      const blob = new Blob([text], {
        type: ext === '.js' ? 'text/javascript' : 'text/css'
      })
      return URL.createObjectURL(blob)
    },

    async getPluginUrl(plugin: string, ext: '.css' | '.js') {
      const filePath = await ipcInvoke('tool-plugin', 'getPath', {
        plugin,
        ext
      })
      return new URL(filePath).href
    },

    appendElement(ext: '.css' | '.js', url: string) {
      let el
      if (ext === '.js') {
        el = document.createElement('script')
        el.src = url
      } else {
        el = document.createElement('link')
        el.rel = 'stylesheet'
        el.href = url
      }
      document.body.appendChild(el)
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
