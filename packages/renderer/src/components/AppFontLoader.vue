<template>
  <div class="app-font-loader">
    <span v-for="i of 9"
      :key="`font-loader-${i}`"
      :style="`font-weight: ${100 * i}`"></span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppFontLoader'
})
</script>

<style lang="scss">
.app-font-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>
