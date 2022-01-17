<template>
  <div v-watch-scroll
    class="app-home">
    <home-weather></home-weather>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HomeWeather from './components/HomeWeather.vue'

export default defineComponent({
  name: 'AppHome',

  components: { HomeWeather },

  methods: {}
})
</script>

<style lang="scss">
.app-home {
  height: 100%;
  overflow: auto;
}
</style>
