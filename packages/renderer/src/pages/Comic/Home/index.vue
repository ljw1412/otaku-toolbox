<template>
  <div class="comic-home">
    <app-area-header title="首页"></app-area-header>
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
  height: 100%;
  overflow-y: scroll;
  padding: 16px 10px;
}
</style>
