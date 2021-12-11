<template>
  <div class="bangumi-grid-group">
    <h4 v-if="title">{{title}}</h4>
    <a-space wrap
      class="anime-grid">
      <a v-for="anime of animes"
        :key="anime.title"
        :href="'#anime-' + anime._id">
        <bangumi-grid-item :anime="anime"></bangumi-grid-item>
      </a>
    </a-space>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import BangumiGridItem from './BangumiGridItem.vue'

export default defineComponent({
  name: 'AnimeBangumiGrid',

  components: { BangumiGridItem },

  props: {
    title: String,
    animes: { type: Array as PropType<BangumiBasic[]>, default: () => [] }
  }
})
</script>

<style lang="scss">
.bangumi-grid-group {
  h4 {
    padding: 6px 4px;
  }
}
</style>
