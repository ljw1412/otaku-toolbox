<template>
  <aside class="comic-aside">
    <comic-navigation></comic-navigation>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ComicNavigation from './components/ComicNavigation.vue'

export default defineComponent({
  name: 'ComicHelper',
  components: { ComicNavigation }
})
</script>

<style lang="scss">
.comic-aside {
  position: absolute;
  left: 0;
  top: 0;
  width: 200px;
  height: 100%;
  box-sizing: border-box;
  padding: 16px 0 16px 16px;
}
</style>
