<template>
  <div class="anime-home h-100 d-flex">
    <main id="anime-home-main"
      class="flex-grow-1 h-100">
      <quick-bangumi v-model:show="isQuickBangumi"
        :bangumi="currentBangumi"></quick-bangumi>
    </main>
    <timeline @select="onSelect"></timeline>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import QuickBangumi from '../components/QuickBangumi.vue'
import Timeline from '../components/Timeline.vue'

export default defineComponent({
  name: 'AppAnimeHome',
  components: {
    Timeline,
    QuickBangumi
  },

  data() {
    return {
      isQuickBangumi: false,
      currentBangumi: undefined as undefined | Record<string, any>
    }
  },

  methods: {
    onSelect(item: Record<string, any>) {
      this.currentBangumi = item
      this.isQuickBangumi = true
    }
  }
})
</script>

<style lang="scss">
.anime-home {
  #anime-home-main {
    width: 0;
  }
}
</style>
