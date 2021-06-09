<template>
  <div class="app-side-bar">
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppSideBar'
})
</script>

<style lang="scss">
.app-side-bar {
  width: var(--side-bar-width);
  height: 100%;
  flex-shrink: 0;
  background-color: var(--theme-color);
}
</style>
