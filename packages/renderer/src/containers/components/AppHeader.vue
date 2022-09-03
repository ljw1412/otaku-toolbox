<template>
  <header class="app-header app-drag d-flex">
    <div class="header-left flex-shrink-0 d-flex">
      <img class="logo m-auto pl-10" height="30" src="/logo-text.svg" />
      <span v-if="$global.env.DEV" class="dev-tip">开发版</span>
    </div>
    <header-center class="flex-grow-1" content-class="layout-lr">
      <app-navigation></app-navigation>
      <app-user-avatar></app-user-avatar>
    </header-center>
    <div class="header-right flex-shrink-0 d-flex align-items-center">
      <app-controls class="m-auto mr-10" mode="main">
        <app-menu>
          <div class="app-control-btn btn-menu">
            <icon-more-vertical />
          </div>
        </app-menu>
      </app-controls>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HeaderCenter from './AppHeaderCenter.vue'
import AppNavigation from './AppNavigation.vue'
import AppControls from '../../components/AppControls.vue'
import AppUserAvatar from './AppUserAvatar.vue'
import AppMenu from './AppMenu.vue'

export default defineComponent({
  name: 'AppHeader',
  components: { AppNavigation, HeaderCenter, AppControls, AppUserAvatar, AppMenu }

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
