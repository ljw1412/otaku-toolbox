<template>
  <div class="comic-home">
    <app-area-header class="comic-header"
      title="首页"></app-area-header>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ComicHome'
})
</script>

<style lang="scss">
.comic-home {
  height: 1000px;
}
</style>
