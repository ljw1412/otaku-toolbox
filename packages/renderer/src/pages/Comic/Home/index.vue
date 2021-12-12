<template>
  <div class="comic-home">
    <a-page-header title="首页"
      class="comic-header"
      :show-back="false"> </a-page-header>
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
