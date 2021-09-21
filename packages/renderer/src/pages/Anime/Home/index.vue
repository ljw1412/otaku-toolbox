<template>
  <div class="anime-home">
    <today-bangumi key="AnimeTodayBangumi"></today-bangumi>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TodayBangumi from './components/TodayBangumi.vue'

export default defineComponent({
  name: 'AnimeHome',
  components: {
    TodayBangumi
  },

  data() {
    return {}
  }
})
</script>

<style lang="scss">
.anime-home {
  height: 1000px;
}
</style>
