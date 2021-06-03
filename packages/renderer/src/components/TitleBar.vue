<template>
  <div class="app-title-bar">
    <div class="content"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppTitleBar'
})
</script>

<style lang="scss">
.app-title-bar {
  width: 100%;
  height: var(--title-bar-height);
  max-height: var(--title-bar-height);
  min-height: var(--title-bar-height);
  background-color: var(--theme-color);
  -webkit-app-region: drag;

  .content {
    -webkit-app-region: no-drag;
  }
}
</style>
