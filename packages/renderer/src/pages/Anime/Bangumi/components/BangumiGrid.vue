<template>
  <div class="bangumi-grid">
    <app-area-header title="新番导览"></app-area-header>
    <div class="anime-grid">
      <bangumi-grid-item v-for="anime of animes"
        :key="anime.title"
        :anime="anime"
        @click="onAnimeItemClick(anime)"></bangumi-grid-item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import BangumiGridItem from './BangumiGridItem.vue'

export default defineComponent({
  name: 'AnimeBangumiGrid',

  components: { BangumiGridItem },

  props: {
    animes: { type: Array as PropType<AnimeOfBangumi[]>, default: () => [] }
  },

  methods: {
    onAnimeItemClick(anime: AnimeOfBangumi) {
      const query = `.bangumi-list-item[data-anime-id="${anime.id}"]`
      const el = document.querySelector(query)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }
})
</script>

<style lang="scss">
.bangumi-grid {
  .anime-grid {
    display: grid;
    justify-content: space-between;
    grid-row-gap: 5px;
    grid-template-columns: repeat(auto-fill, var(--grid-item-size));
  }
}
</style>
