<template>
  <div class="comic-home">
    <a-page-header title="首页"
      class="comic-header"
      :show-back="false"> </a-page-header>
    <app-news title="漫画资讯"
      type="comic-news"
      :skeleton-count="4"></app-news>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppNews from '/@/components/AppNews.vue'

export default defineComponent({
  name: 'ComicHome',

  components: {
    AppNews
  }
})
</script>

<style lang="scss">
.comic-home {
  height: 1000px;
}
</style>
