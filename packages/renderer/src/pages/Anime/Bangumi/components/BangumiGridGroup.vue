<template>
  <div class="bangumi-grid-group">
    <h4 v-if="title">{{title}}</h4>
    <a-space wrap
      class="anime-grid">
      <bangumi-grid-item v-for="anime of animes"
        :key="anime.title"
        :anime="anime"
        @click="handleBangumiClick(anime)"></bangumi-grid-item>
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
  },

  methods: {
    handleBangumiClick(anime: BangumiBasic) {
      const el = document.querySelector(`#anime-${anime._id}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
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
