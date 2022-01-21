<template>
  <div class="app-mini-header app-drag layout-lr">
    <div class="header-left pl-12 fs-14">
      <slot name="title"
        :title="title">
        <span class="title">{{ title }}</span>
      </slot>
    </div>
    <div class="header-right pr-4">
      <app-controls>
        <template v-if="$route.meta.hasView">
          <div v-if="$route.meta.hasView && $global.config.allowDevTools"
            title="开发者工具"
            class="app-control-btn btn-developer-tools"
            @click="toggleDevTools">
            <icon-code-square />
          </div>
          <div v-if="$route.query.outlink"
            class="app-control-btn btn-system-browser"
            title="以系统浏览器方式打开"
            @click="openSystemBrower">
            <icon-desktop />
          </div>
          <a-divider direction="vertical" />
        </template>
      </app-controls>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppControls from '/@/components/AppControls.vue'
import { ipcSend, openSystemBrower } from '/@/utils/electron'

export default defineComponent({
  name: 'AppMiniHeader',
  components: {
    AppControls
  },
  props: { title: { type: String, default: '' } },

  methods: {
    openSystemBrower() {
      openSystemBrower(this.$route.query.outlink as string)
    },

    toggleDevTools() {
      ipcSend('window.action', 'toggleDevTools')
    }
  }
})
</script>

<style lang="scss">
.app-mini-header {
  position: relative;
  width: 100%;
  height: var(--app-header-mini-height);
  color: var(--app-header-color-text);
  background-color: var(--app-header-bg);
  z-index: 9999999;

  .title {
  }
}
</style>
