<template>
  <div class="anime-wiki">
    <!-- <wiki-menu></wiki-menu> -->
    <transition name="fade">
      <div class="wiki-bg" :key="cover">
        <img class="bg-image" :src="cover" />
        <div class="mask"></div>
        <!-- <div class="blur"></div> -->
      </div>
    </transition>

    <div class="wiki-content">
      <basic-page :data="basic" @image-change="handleImageChange"></basic-page>
      <AnimeSeries :id="id"></AnimeSeries>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import WikiMenu from './components/WikiMenu.vue'
import BasicPage from './components/BasicPage.vue'
import AnimeSeries from './components/AnimeSeries.vue'

export default defineComponent({
  name: 'AnimeWiki',

  components: { BasicPage, AnimeSeries },

  props: { id: String },

  data() {
    return {
      basic: {} as BangumiBasicWithTime,
      cover: ''
    }
  },

  created() {
    this.fetchBasic()
    this.$message.warning('动画详情页，正在开发中……')
  },

  beforeUnmount() {
    document.documentElement.classList.remove('filter-gray')
  },

  methods: {
    async fetchBasic() {
      if (!this.id) return
      this.basic = await this.$API.Bangumi.showBangumi(this.id)
      this.cover = this.basic.coverMin
      if ((this.basic.mark || []).includes('ban')) {
        document.documentElement.classList.add('filter-gray')
      }
      this.$global.setTitle(`${this.basic.title} - ${this.$route.meta.title}`)
    },

    handleImageChange(image: string) {
      this.cover = image
    }
  }
})
</script>

<style lang="scss">
.anime-wiki {
  --basic-page-gallery-width: 450px;
  --basic-page-width: 1160px;
  .wiki-bg {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    z-index: -1;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }

    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--app-color-bg);
      opacity: 0.9;
      transition: background-color 0.2s;
    }
    .blur {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(40px);
    }
  }
}

@media (max-width: 1199.9px) {
  .anime-wiki {
    --basic-page-width: 100%;
  }
}

@media (max-width: 767.9px) {
  .anime-wiki {
    --basic-page-gallery-width: 100%;
  }
}
</style>
