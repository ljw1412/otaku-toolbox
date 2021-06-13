<template>
  <div class="app-action-bar">
    <acg-icon name="menu"
      :size="28"></acg-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppActionBar'
})
</script>

<style lang="scss">
.app-action-bar {
  position: absolute;
  left: 0;
  bottom: 32px;
  width: 100%;
  text-align: center;
  -webkit-app-region: no-drag;
}
</style>
