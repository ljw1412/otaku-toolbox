<template>
  <acg-card class="anime-item-card"
    inner-class="anime-item"
    fill
    hover-up
    no-border>
    <div class="cover-container">
      <img :src="anime.coverMin"
        loading="lazy">
    </div>
    <div class="anime-title">{{ anime.title }}</div>
  </acg-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexAnimeItem',
  props: { anime: { type: Object, default: () => ({}) } }
})
</script>

<style lang="scss">
.anime-item-card {
  cursor: pointer;
  width: 100%;
  .cover-container {
    height: var(--anime-item-height);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .anime-title {
    padding: 4px;
    font-size: 14px;
  }
}
</style>
