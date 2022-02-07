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
      console.log('init')
      const filePath = await ipcInvoke('tool-plugin', 'getPath', {
        plugin: this.$route.query.plugin
      })
      const url = new URL(filePath)

      const script = document.createElement('script')
      script.src = url.href
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
