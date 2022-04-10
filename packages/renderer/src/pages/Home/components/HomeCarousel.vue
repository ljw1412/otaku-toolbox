<template>
  <div class="home-carousel">
    <a-carousel class="h-100" indicator-type="slider" indicator-position="outer">
      <a-carousel-item v-for="item in list" :key="item._id" :class="{ 'is-link': item.routeMode }">
        <div :style="{ 'background-color': item.bgColor, height: '100%' }">
          <img v-if="item.cover" :src="item.cover" :style="{ width: '100%' }" />
          <div class="info">
            <h2 class="info-title">{{ item.title }}</h2>
            <h3 class="info-desc">{{ item.desc }}</h3>
          </div>
        </div>
      </a-carousel-item>
    </a-carousel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeCarousel',

  data() {
    return {
      list: [] as Banner[]
    }
  },

  created() {
    this.fetchList()
  },

  methods: {
    async fetchList() {
      const { list, total } = await this.$API.Banner.listBanner({ index: 1, size: 8 })
      this.list = list
    }
  }
})
</script>

<style lang="scss">
.home-carousel {
  width: 100%;
  height: 100%;
  background-color: var(--color-fill-1);

  .info {
    position: absolute;
    bottom: 0.16rem;
    left: 0.16rem;
    z-index: 0;
    text-shadow: 0 0 4px #000000;
    color: #ffffff;

    .info-title {
      font-size: 0.36rem;
    }

    .info-desc {
      font-size: 0.28rem;
    }
  }
}
</style>
