<template>
  <header class="app-header app-drag d-flex">
    <div class="header-left flex-shrink-0">Otaku Tools</div>
    <header-center class="flex-grow-1">
      内容
    </header-center>
    <div class="header-right flex-shrink-0 d-flex">
      <app-controls></app-controls>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HeaderCenter from './AppHeaderCenter.vue'
import AppControls from './AppControls.vue'

export default defineComponent({
  name: 'AppHeader',
  components: {
    HeaderCenter,
    AppControls
  }
})
</script>

<style lang="scss">
.app-header {
  height: var(--app-header-height);
  color: var(--header-text-color);
  background-color: var(--app-header-bg);

  .header-left,
  .header-right {
    width: 170px;
  }
}
</style>
