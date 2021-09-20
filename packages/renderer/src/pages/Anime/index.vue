<template>
  <div class="app-anime">
    <app-sub-navigation :navigations="navigations"
      :right-links="rightLinks"></app-sub-navigation>
    <main class="anime-main">
      <router-view class="page-container"></router-view>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppSubNavigation from '/@/components/AppSubNavigation.vue'

export default defineComponent({
  name: 'AppAnime',
  components: { AppSubNavigation },
  data() {
    return {
      navigations: [
        { name: '推荐', to: { name: 'AnimeHome' } },
        { name: '资讯', to: { name: 'AnimeNews' } },
        { name: '新番表', to: { name: 'AnimeBangumi' } },
        { name: '外链', url: 'https://www.baidu.com' }
      ] as PageNavigationItem[],
      rightLinks: [
        { name: '新番表', to: { name: 'AnimeBangumiS' } },
        { name: '外链', url: 'https://www.baidu.com' }
      ]
    }
  }
})
</script>

<style lang="scss">
.app-anime {
  height: 100%;
  overflow: hidden;
  .app-sub-navigation {
    padding: 0 var(--scroll-bar-width);
  }

  .anime-main {
    box-sizing: border-box;
    height: calc(100% - var(--app-sub-navigation-height));
    padding-left: var(--scroll-bar-width);
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
</style>
