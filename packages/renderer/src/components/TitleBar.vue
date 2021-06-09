<template>
  <div class="app-title-bar">
    <div class="title-bar-left">
      <span>二次元工具箱</span>
    </div>
    <div class="title-bar-right"></div>
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
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: var(--title-bar-height);
  max-height: var(--title-bar-height);
  min-height: var(--title-bar-height);
  color: var(--title-text-color);
  background-color: var(--theme-sub-color);
  -webkit-app-region: drag;

  display: flex;
  justify-content: space-between;
  align-items: center;

  .title-bar-left {
    margin-left: 16px;
  }

  .title-bar-right {
    -webkit-app-region: no-drag;
  }
}
</style>
