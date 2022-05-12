<template>
  <div class="plugin-page">
    <app-mini-header v-if="!$route.query.hideHeader" :title="mTitle">
      <template #title>
        <app-favicon :icon="icon" :size="16" class="mr-4" />
        <span class="title">{{ mTitle }}</span>
        <span v-if="version" class="version mx-4">[Ver.{{ version }}]</span>
        <a-tag v-if="isDev" color="orange" size="small">开发版</a-tag>
      </template>
    </app-mini-header>
    <main v-show="!incomplete" id="plugin-main"></main>
    <div v-if="incomplete" class="plugin-error d-flex">
      <a-card :bordered="false" class="mx-auto mt-20" style="width:400px;height:130px">
        <h3>错误</h3>
        <p class="mb-20">检测到插件文件不完整</p>
        <a-button :loading="downloading" @click="fix">尝试修复</a-button>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRaw } from 'vue'
import AppMiniHeader from '/@/containers/components/AppMiniHeader.vue'
import './index'
import { ipcInvoke } from '../utils/electron'
import { pluginStore } from '/@/stores/index'

export default defineComponent({
  name: 'PluginPage',

  components: { AppMiniHeader },

  data() {
    return {
      incomplete: false,
      downloading: false
    }
  },

  computed: {
    currentPlugin() {
      return pluginStore.list.find(item => item.plugin === this.$route.query.plugin)
    },
    isDev(): boolean {
      return this.currentPlugin ? (this.currentPlugin.isDev || false) : false
    },
    version(): string {
      return this.currentPlugin ? (this.currentPlugin.version + '') : ''
    },
    mTitle(): string {
      if (this.currentPlugin) {
        return this.currentPlugin.name
      }
      return (this.$route.query.title || this.$route.query.name || '') as string
    },
    icon(): string {
      return this.currentPlugin ? this.currentPlugin.icon : ''
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    async init() {
      this.incomplete = false
      if (!this.currentPlugin) { return }
      const { isDev, plugin: pluginName, css } = this.currentPlugin
      const getUrl = isDev ? this.getDevPluginUrl : this.getPluginUrl
      const loadList: ['.js'] | ['.js', '.css'] = css
        ? ['.js', '.css']
        : ['.js']

      loadList.forEach(async (ext: '.css' | '.js') => {
        const truthUrl = await getUrl(pluginName as string, ext)
        const url = await this.getBlobUrl(truthUrl, ext)
        this.appendElement(ext, url)
      })
    },

    async getPluginUrl(plugin: string, ext: '.css' | '.js') {
      const filePath = await ipcInvoke('tool-plugin', 'getPath', {
        plugin,
        ext
      })
      return new URL(filePath).href
    },

    async getDevPluginUrl(plugin: string, ext: '.css' | '.js') {
      return `${pluginStore.devUrl}/plugins/${plugin}/index${ext}`
    },

    async getBlobUrl(url: string, ext: '.css' | '.js') {
      try {
        const resp = await fetch(url)
        const text = await resp.text()
        const blob = new Blob([text], {
          type: ext === '.js' ? 'text/javascript' : 'text/css'
        })
        return URL.createObjectURL(blob)
      } catch (error) {
        this.incomplete = true
        throw error
      }
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
    },

    async fix() {
      this.downloading = true
      const { error } = await ipcInvoke(
        'tool-plugin',
        'download',
        toRaw(this.$route.query)
      )
      if (error) {
        this.$message.error(`修复插件失败：${error.message}`)
        this.downloading = false
        return
      }
      this.downloading = false
      this.init()
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

  .plugin-error {
    position: relative;
    flex-grow: 1;
    background-color: var(--color-mask-bg);
  }
}
</style>
