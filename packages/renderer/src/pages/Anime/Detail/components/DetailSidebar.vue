<template>
  <a-space direction="vertical" size="medium" class="detail-sidebar">
    <a-button class="detail-score-ranking" size="large" long>评分排名</a-button>
    <a-button class="detail-popular-ranking" size="large" long
      >收藏排名</a-button
    >
    <media-base-info></media-base-info>
    <media-external></media-external>
  </a-space>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MediaExternal from './MediaExternal.vue'
import MediaBaseInfo from './MediaBaseInfo.vue'
import detailMixin from '../utilities/mixin'

export default defineComponent({
  name: 'DetailSidebar',

  components: { MediaExternal, MediaBaseInfo },

  mixins: [detailMixin]
})
</script>

<style lang="scss">
.detail-sidebar {
  display: flex !important;
}
</style>
