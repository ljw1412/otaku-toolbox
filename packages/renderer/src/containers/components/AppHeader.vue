<template>
  <header class="app-header app-drag d-flex">
    <div class="header-left flex-shrink-0 d-flex">
      <img class="logo m-auto pl-10"
        height="30"
        src="../../../assets/logo-text.svg">
    </div>
    <header-center class="flex-grow-1">
      <app-navigation></app-navigation>
    </header-center>
    <div class="header-right flex-shrink-0 d-flex">
      <app-controls class="m-auto mr-10"
        mode="main">
        <div class="app-control-btn btn-skin"
          @click="openSkinWindow">
          <acg-icon name="shirt-outline"
            size="18"></acg-icon>
        </div>
        <div class="app-control-btn btn-menu">
          <acg-icon name="ellipsis-vertical"
            size="18"></acg-icon>
        </div>
      </app-controls>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HeaderCenter from './AppHeaderCenter.vue'
import AppControls from '../../components/AppControls.vue'
import AppNavigation from './AppNavigation.vue'
import { createBrowser } from '/@/utils/electron'
import { getPageUrl } from '/@/utils/helper'

export default defineComponent({
  name: 'AppHeader',
  components: { AppNavigation, HeaderCenter, AppControls },

  methods: {
    openSkinWindow() {
      try {
        const route = this.$router.resolve({ name: 'AppTheme' })
        createBrowser({
          url: getPageUrl(route.href),
          width: 640,
          height: 480,
          resizable: false,
          minimizable: false,
          maximizable: false,
          singleInstance: true,
          title: '主题'
        })
      } catch (error) {
        console.error(error)
      }
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
    width: 170px;
  }
}
</style>
