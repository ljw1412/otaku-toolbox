
<template>
  <title-bar></title-bar>
  <action-bar></action-bar>
  <main id="app-main"
    class="app-main">
    <router-view />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TitleBar from './components/TitleBar.vue'
import ActionBar from './components/ActionBar.vue'

export default defineComponent({
  name: 'App',
  components: {
    TitleBar,
    ActionBar
  }
})
</script>

<style>
body {
  color: var(--text-color);
  background-color: var(--bg-color);
}
</style>
