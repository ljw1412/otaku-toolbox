<template>
  <div class="app-navigation-bar"
    :data-size="isMini ? 'mini' : ''">
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppNavigationBar',

  data() {
    return {
      isMini: false
    }
  }
})
</script>

<style lang="scss">
.app-navigation-bar {
  width: var(--navigation-bar-width);
  flex-shrink: 0;
}
</style>
