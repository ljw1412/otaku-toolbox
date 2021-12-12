<template>
  <div class="anime-home">
    <today-bangumi key="AnimeTodayBangumi"></today-bangumi>
    <mini-news-list key="AnimeMiniNewsList"></mini-news-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MiniNewsList from './components/MiniNews.vue'
import TodayBangumi from './components/TodayBangumi.vue'

export default defineComponent({
  name: 'AnimeHome',
  components: {
    TodayBangumi,
    MiniNewsList
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
