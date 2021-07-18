<template>
  <div class="anime-home h-100">
    <timeline></timeline>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Timeline from '../components/Timeline.vue'

export default defineComponent({
  name: 'AppAnimeHome',
  components: {
    Timeline
  }
})
</script>

<style lang="scss">
</style>
