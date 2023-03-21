<template>
  <div class="detail-overview">
    <media-base-info v-show="isMobileSize"></media-base-info>
    <media-description v-show="isMobileSize"></media-description>
    <media-resources></media-resources>
    <media-episode></media-episode>
    <media-relations></media-relations>
    <media-characters></media-characters>
    <!-- <media-staff></media-staff> -->
    <a-row class="grid-distribution" :gutter="{ md: 8 }">
      <a-col :xs="24" :sm="24" :xl="12">
        <media-status-distribution></media-status-distribution>
      </a-col>
      <a-col :xs="24" :sm="24" :xl="12">
        <media-score-distribution></media-score-distribution>
      </a-col>
      <a-col :span="24">
        <media-ep-score-distribution></media-ep-score-distribution>
      </a-col>
    </a-row>
    <media-trailer></media-trailer>
    <media-external v-show="isMobileSize"></media-external>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import MediaResources from './components/MediaResources.vue'
import MediaRelations from './components/MediaRelations.vue'
import MediaDescription from './components/MediaDescription.vue'
import MediaExternal from './components/MediaExternal.vue'
import MediaBaseInfo from './components/MediaBaseInfo.vue'
import MediaEpisode from './components/MediaEpisode.vue'
import MediaStatusDistribution from './components/MediaStatusDistribution.vue'
import MediaScoreDistribution from './components/MediaScoreDistribution.vue'
import MediaEpScoreDistribution from './components/MediaEpScoreDistribution.vue'
import MediaCharacters from './components/MediaCharacters.vue'
import MediaStaff from './components/MediaStaff.vue'
import MediaTrailer from './components/MediaTrailer.vue'

export default defineComponent({
  name: 'AnimeDetailOverview',

  components: {
    MediaResources,
    MediaRelations,
    MediaDescription,
    MediaExternal,
    MediaBaseInfo,
    MediaEpisode,
    MediaStatusDistribution,
    MediaScoreDistribution,
    MediaEpScoreDistribution,
    MediaCharacters,
    // MediaStaff,
    MediaTrailer
  },

  props: {
    anime: {
      type: Object as PropType<FormatedBangumiBasic>,
      default: () => ({})
    }
  }
})
</script>

<style lang="scss">
.detail-overview {
  .media-base-info {
    margin-bottom: var(--overview-item-gap);
  }
}
</style>
