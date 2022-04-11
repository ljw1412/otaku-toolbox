<template>
  <div class="home-carousel">
    <a-carousel class="h-100" indicator-type="slider" indicator-position="outer">
      <a-carousel-item
        v-for="item in list"
        :key="item._id"
        :class="{ 'is-link': item.routeMode }"
        @click="navigate(item)"
      >
        <div :style="{ 'background-color': item.bgColor, height: '100%' }">
          <img v-if="item.cover" :src="item.cover" :style="{ width: '100%' }" />
          <div class="info">
            <h2 class="info-title">{{ item.title }}</h2>
            <h3 class="info-desc">{{ item.desc }}</h3>
          </div>
        </div>
      </a-carousel-item>
    </a-carousel>
    <icon-refresh
      size="20"
      class="carousel-refresh is-link"
      :spin="loading"
      :class="{ 'is-loading': loading }"
      @click="refresh"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeCarousel',

  data() {
    return {
      loading: false,
      list: [{
        title: '欢迎来到御宅世界',
        desc: 'Welcome To Otaku World',
        bgColor: ''
      }] as Banner[]
    }
  },

  created() {
    this.fetchList()
  },

  methods: {
    async fetchList() {
      this.loading = true
      try {
        const { list, total } = await this.$API.Banner.listBanner({ index: 1, size: 8 })
        list.forEach(item => {
          if (item.vueRoute && item.vueRoute.name === 'Wiki') {
            item.vueRoute.name = 'AnimeWiki'
          }
        })
        this.list = list
      } catch (error) {
        console.error(error)
        this.$message.error('[首页-轮播图] 与母星的通信被中断！')
      }
      this.loading = false
    },

    refresh() {
      if (!this.loading) {
        this.fetchList()
      }
    },

    navigate(banner: Banner) {
      if (banner.routeMode === 'vueRoute') {
        console.log(banner)
        this.$API.Electron.win.openVue(banner.vueRoute)
        // const route = this.$router.resolve(banner.vueRoute)
        // window.open(route.fullPath, '_blank')
      } else if (banner.routeMode === 'url' && banner.url) {
        window.open(banner.url, '_blank')
      }
    }
  }
})
</script>

<style lang="scss">
.home-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--color-fill-1);

  .is-link {
    cursor: pointer;
  }

  .info {
    position: absolute;
    bottom: 16px;
    left: 16px;
    z-index: 0;
    text-shadow: 0 0 4px #000000;
    color: #ffffff;

    .info-title {
      font-size: 32px;
    }

    .info-desc {
      font-size: 24px;
    }
  }

  .carousel-refresh {
    position: absolute;
    bottom: 10px;
    right: 10px;
    text-shadow: 0 0 4px #000000;
    color: var(--color-text-1);
    z-index: 1;
    opacity: 0;
    transition: opacity 0.2s;
    background-color: var(--color-bg-1);
    padding: 2px;
    border-radius: 50%;

    &.is-loading {
      opacity: 0.75;
    }
  }

  &:hover {
    .carousel-refresh {
      opacity: 0.75;
    }
  }
}
</style>
