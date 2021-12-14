<template>
  <div class="anime-home">
    <today-bangumi key="AnimeTodayBangumi"></today-bangumi>
    <app-news title="动画资讯"
      mini
      type="anime-news"
      :skeleton-count="4"></app-news>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TodayBangumi from './components/TodayBangumi.vue'
import AppNews from '/@/components/AppNews.vue'

export default defineComponent({
  name: 'AnimeHome',
  components: {
    TodayBangumi,
    AppNews
  },

  data() {
    return {}
  }
})
</script>

<style lang="scss">
.anime-home {
  > * {
    margin-bottom: 20px;
  }
}
</style>
