<template>
  <div v-watch-scroll class="app-home">
    <a-layout class="home-layout">
      <a-layout-sider :width="280" class="mr-12">
        <a-space direction="vertical" size="medium" class="px-4 sticky-t h-100" style="top: 20px;" fill>
          <home-user-center></home-user-center>
          <digital-clock></digital-clock>
          <home-weather></home-weather>
        </a-space>
      </a-layout-sider>
      <a-layout-content>
        <acg-ratio-div :ratio="[2, 1]">
          <home-carousel></home-carousel>
        </acg-ratio-div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DigitalClock from './components/DigitalClock.vue'

import HomeWeather from './components/HomeWeather.vue'
import HomeUserCenter from './components/HomeUserCenter.vue'
import HomeCarousel from './components/HomeCarousel.vue'

export default defineComponent({
  name: 'AppHome',

  components: { DigitalClock, HomeWeather, HomeUserCenter, HomeCarousel }
})
</script>

<style lang="scss">
.app-home {
  height: 100%;
  // overflow: auto;

  .home-layout {
    box-sizing: border-box;
    max-width: 1720px;
    height: 100%;
    margin: 0 auto;
    padding: 20px 20px;
  }

  .arco-layout-content {
    overflow-x: initial !important;
  }

  .arco-layout-sider {
    background: none;
    box-shadow: none;

    .arco-layout-sider-children {
      overflow: inherit;

      .arco-space-item:last-child {
        flex-grow: 1;
      }
    }
  }
}
</style>
