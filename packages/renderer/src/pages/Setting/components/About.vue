<template>
  <div class="app-about">
    <div class="d-inline-block">
      <img class="logo mb-10"
        height="60"
        src="../../../../assets/logo-text.svg">
      <p class="m-auto"
        style="width:200px">
        <a-button long>检查更新</a-button>
      </p>
      <p class="mt-20">版本: {{ appVersion }}</p>
      <a-descriptions :data="descData"
        title="组件版本"
        class="d-inline-block mt-20"
        size="small"
        :align="{value:'center'}"
        :column="1" />
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
    }
  }
})
</script>

<style lang="scss">
.app-about {
  text-align: center;
  padding-top: 40px;
  text-shadow: 1px 0 1px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(0, 0, 0, 0.5),
    0 -1px 1px rgba(0, 0, 0, 0.5), -1px 0 1px rgba(0, 0, 0, 0.5);

  .arco-descriptions {
    * {
      color: #cccccc !important;
      font-weight: normal;
      font-size: 14px;
    }
  }
}
</style>
