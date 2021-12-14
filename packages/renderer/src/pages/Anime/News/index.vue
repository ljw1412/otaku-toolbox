<template>
  <div class="anime-news">
    <app-news title="动画资讯"
      type="anime-news"
      :skeleton-count="6"></app-news>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppNews from '/@/components/AppNews.vue'

export default defineComponent({
  name: 'AnimeNews',

  components: { AppNews },

  data() {
    return {}
  }
})
</script>

<style lang="scss">
.anime-news {
}
</style>
