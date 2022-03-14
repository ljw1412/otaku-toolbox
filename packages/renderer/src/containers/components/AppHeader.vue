<template>
  <header class="app-header app-drag d-flex">
    <div class="header-left flex-shrink-0 d-flex">
      <img class="logo m-auto pl-10" height="30" src="../../../assets/logo-text.svg" />
      <span v-if="$global.env.DEV" class="dev-tip">开发版</span>
    </div>
    <header-center class="flex-grow-1">
      <app-navigation></app-navigation>
    </header-center>
    <div class="header-right flex-shrink-0 d-flex">
      <app-controls class="m-auto mr-10" mode="main">
        <div class="app-control-btn btn-settings" @click="openSettingsWindow">
          <icon-settings />
        </div>
        <!-- <div class="app-control-btn btn-menu">
          <icon-more-vertical />
        </div>-->
      </app-controls>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HeaderCenter from './AppHeaderCenter.vue'
import AppControls from '../../components/AppControls.vue'
import AppNavigation from './AppNavigation.vue'

export default defineComponent({
  name: 'AppHeader',
  components: { AppNavigation, HeaderCenter, AppControls },

  methods: {
    openSettingsWindow() {
      this.$API.Electron.win.openAppSystem('系统设置')
    }
  }
})
</script>

<style lang="scss">
.app-header {
  height: var(--app-header-height);
  color: var(--app-header-color-text);
  background-color: var(--app-header-bg);

  .header-left,
  .header-right {
    position: relative;
    width: 170px;
  }

  .dev-tip {
    position: absolute;
    right: 16px;
    bottom: 0;
    font-size: 12px;
  }
}
</style>
