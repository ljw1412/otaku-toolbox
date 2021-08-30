<template>
  <div class="app-container container-main">
    <app-header></app-header>
    <main id="app-main"
      class="app-main">
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from './components/AppHeader.vue'

export default defineComponent({
  name: 'AppMainContainer',
  components: {
    AppHeader
  }
})
</script>

<style lang="scss">
.container-main {
  .app-main {
    height: calc(100% - var(--app-header-height));
  }
}
</style>
