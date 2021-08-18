<template>
  <div class="app-home p-20">
    <div class="home-grid d-grid h-100 position-relative">
      <div class="offical-message">
        <div class="banner h-50">
          轮播图
        </div>
        <div class="notice h-50">
          官方信息
        </div>
      </div>
      <div class="news">
        acg新闻
      </div>
      <div class="timeline">
        <timeline @select="onBangumiSelect"></timeline>
        <div class="bangumi-dialog position-absolute w-75 h-100">
          <quick-bangumi v-model:show="isDisplayBangumi"
            :bangumi="mBangumi"></quick-bangumi>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import QuickBangumi from './components/QuickBangumi.vue'
import Timeline from './components/Timeline.vue'

export default defineComponent({
  name: 'AppHome',
  components: {
    Timeline,
    QuickBangumi
  },

  data() {
    return {
      isDisplayBangumi: false,
      mBangumi: undefined as undefined | Record<string, any>
    }
  },

  methods: {
    themeChange(theme: string) {
      window.$theme.set(theme)
    },

    onBangumiSelect(item: Record<string, any>) {
      this.mBangumi = item
      this.isDisplayBangumi = true
    }
  }
})
</script>

<style lang="scss">
.app-home {
  height: 100%;
  overflow: hidden;
  &,
  & * {
    box-sizing: border-box;
  }

  .home-grid {
    display: grid;
    grid-template-columns: 37.5% 37.5% 25%;
    grid-template-rows: repeat(3, 100%);
    overflow: hidden;
  }

  .bangumi-dialog {
    top: 0;
    left: 0;
  }
}
</style>
