<template>
  <div class="game-home">
    <app-news title="游戏资讯"
      type="game-news"
      :skeleton-count="6"></app-news>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppNews from '/@/components/AppNews.vue'

export default defineComponent({
  name: 'GameHome',

  components: { AppNews }
})
</script>

<style lang="scss">
</style>
