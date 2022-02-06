<template>
  <div v-watch-scroll
    class="app-home">
    <a-layout class="home-layout">
      <a-layout-content>
        <a-button @click="openVueView({name:'PluginPage'})">插件测试</a-button>
      </a-layout-content>
      <a-layout-sider :width="280"
        class="ml-20">
        <digital-clock></digital-clock>
        <home-weather></home-weather>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DigitalClock from './components/DigitalClock.vue'
import HomeWeather from './components/HomeWeather.vue'
import { openVueView } from '/@/utils/electron'

export default defineComponent({
  name: 'AppHome',

  components: { DigitalClock, HomeWeather },

  methods: {
    openVueView
  }
})
</script>

<style lang="scss">
.app-home {
  height: 100%;
  overflow: auto;

  .home-layout {
    max-width: 1280px;
    margin: 0 auto;
    padding: 20px 20px 0;
  }
}
</style>
