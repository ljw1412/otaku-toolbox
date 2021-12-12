<template>
  <div v-watch-scroll
    class="app-home">
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppHome',
  methods: {}
})
</script>

<style lang="scss">
.app-home {
  height: 100%;
  overflow: auto;
}
</style>
