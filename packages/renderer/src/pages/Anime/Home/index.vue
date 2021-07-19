<template>
  <div class="anime-home h-100 d-flex">
    <timeline @select="onSelect"></timeline>
    <quick-bangumi :bangumi="currentBangumi"></quick-bangumi>
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
      currentBangumi: undefined as undefined | Record<string, any>
    }
  },

  methods: {
    onSelect(item: Record<string, any>) {
      this.currentBangumi = item
    }
  }
})
</script>

<style lang="scss">
</style>
