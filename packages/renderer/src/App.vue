
<template>
  <title-bar></title-bar>
  <div class="app-container">
    <navigation-bar></navigation-bar>
    <main id="app-main"
      class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TitleBar from './components/TitleBar.vue'
import NavigationBar from './components/NavigationBar.vue'

export default defineComponent({
  name: 'App',
  components: {
    TitleBar,
    NavigationBar
  }
})
</script>

<style>
body {
  color: var(--text-color);
  background-color: var(--bg-color);
}

.app-container {
  display: flex;
  height: calc(100% - var(--title-bar-height));
}

.app-main {
  width: 100%;
}
</style>
