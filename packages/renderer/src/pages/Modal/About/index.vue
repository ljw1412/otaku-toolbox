<template>
  <div class="app-about">
    <header class="app-about-header app-drag">
      <app-close-btn size="mini" fixed="tr" style="top:1px; right:1px;" />
      <img class="logo mb-10" height="60" src="/logo-text.svg" />
      <p class="mb-8 text-stroke">
        <span class="mr-12">版本: {{ appVersion }}</span>
        <a-button class="app-no-drag" size="mini">检查更新</a-button>
      </p>
    </header>
    <div class="d-inline-block mt-20">
      <a-descriptions :data="descData" :align="{ value: 'right' }" :column="1" title="组件版本" size="small" />
    </div>
    <a-divider style="margin-bottom: 8px" />
    <div class="layout-lr px-16">
      <div>开发者:<a-link>灬茫然丶</a-link>
      </div>
      <a-button @click="toGithub">
        <icon-github />
        Github
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, version as VueVersion } from 'vue'
import { useElectron } from '/@/utils/electron'
import { only } from '/@/utils/object'

export default defineComponent({
  name: 'AppAboutModal',

  data() {
    return {
      appVersion: '',
      versions: {
        vue: '',
        electron: '',
        chromium: '',
        node: '',
        v8: ''
      } as Record<string, string>
    }
  },

  computed: {
    descData(): { label: string; value: string }[] {
      return Object.keys(this.versions).map(key => ({
        label: key,
        value: this.versions[key]
      }))
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.getAppVersion()
      this.getCoreVersion()
    },

    getCoreVersion() {
      const appVersions = { ...useElectron().versions }
      appVersions.chromium = appVersions.chrome
      Object.assign(
        this.versions,
        only(appVersions, 'electron chromium node v8'),
        { vue: VueVersion }
      )
    },

    getAppVersion() {
      const match = window.navigator.userAgent.match(/otaku-toolbox\/(\S+)/)
      if (match && match.length > 1) {
        this.appVersion = match[1]
      }
    },

    toGithub() {
      this.$API.Electron.win.open('https://github.com/ljw1412/otaku-toolbox', { useSystemBrowser: true })
    }
  }
})
</script>

<style lang="scss">
.app-about {
  user-select: none;
  height: 100%;
  text-align: center;

  background-color: rgba(var(--app-theme-rgb), 0.1);

  .app-about-header {
    position: relative;
    padding-top: 30px;
    padding-bottom: 12px;
    background-color: rgba(var(--app-theme-rgb), 0.65);
    color: #ffffff;
  }


  .arco-descriptions {
    * {
      font-weight: normal;
      font-size: 14px;
    }
  }
}
</style>
