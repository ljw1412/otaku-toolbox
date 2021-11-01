<template>
  <div class="app-comic">
    <aside class="comic-aside">
      <comic-navigation></comic-navigation>
    </aside>
    <main class="comic-main">
      <router-view></router-view>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ComicNavigation from './components/ComicNavigation.vue'

export default defineComponent({
  name: 'AppComic',
  components: { ComicNavigation },

  created() {
    console.log(import.meta.env)
  }
})
</script>

<style lang="scss">
.app-comic {
  box-sizing: border-box;
  position: relative;
  height: 100%;
  overflow: hidden;
  padding: 16px 0 16px 16px;

  .comic-aside {
    position: absolute;
    left: 0;
    top: 0;
    width: 200px;
    height: 100%;
    box-sizing: border-box;
    padding: 16px 0 16px 16px;
  }

  .comic-main {
    height: 100%;
    margin-left: 200px;
    padding-left: var(--scroll-bar-width);
  }
}
</style>
