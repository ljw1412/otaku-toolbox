
<template>
  <div class="app-container">
    <side-bar></side-bar>
    <div class="app-body">
      <title-bar></title-bar>
      <main id="app-main"
        class="app-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TitleBar from './components/TitleBar.vue'
import SideBar from './components/SideBar.vue'

export default defineComponent({
  name: 'App',
  components: {
    TitleBar,
    SideBar
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
  height: 100%;
  user-select: none;
  overflow: hidden;
}

.app-body {
  position: relative;
  height: 100%;
  flex-grow: 1;
  padding-top: var(--title-bar-height);
  box-sizing: border-box;
}

.app-main {
  /* height: calc(100%- var(--title-bar-height)); */
  height: 100%;
  user-select: auto;
  overflow-y: auto;
}
</style>
