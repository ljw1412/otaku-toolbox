<template>
  <app-sub-navigation class="anime-header"
    :navigations="navigations"
    :right-links="rightLinks"></app-sub-navigation>
  <acg-back-top target="#anime-main"></acg-back-top>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import AppSubNavigation from '/@/components/AppSubNavigation.vue'
export default defineComponent({
  name: 'AnimeHelper',
  components: { AppSubNavigation },
  data() {
    return {
      navigations: [
        { name: '推荐', to: { name: 'AnimeHome' } },
        { name: '资讯', to: { name: 'AnimeNews' } },
        { name: '索引', to: { name: 'AnimeIndex' } },
        { name: '新番表', to: { name: 'AnimeBangumi' } },
        { name: '一周放送', to: { name: 'AnimeWeekBangumi' } }
      ] as PageNavigationItem[],
      rightLinks: [
        { name: '新番表', to: { name: 'AnimeBangumiS' } },
        { name: '网页版', url: 'http://anime.acgcon.top' }
      ]
    }
  }
})
</script>

<style lang="scss">
.anime-header {
  padding: 0 var(--scroll-bar-width);
}
</style>
