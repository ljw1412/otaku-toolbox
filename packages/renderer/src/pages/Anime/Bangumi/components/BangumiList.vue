<template>
  <div class="bangumi-list">
    <app-area-header title="新番资讯"></app-area-header>
    <div class="anime-list">
      <bangumi-list-item v-for="anime of animes"
        :key="anime.id"
        :anime="anime"></bangumi-list-item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import BangumiListItem from './BangumiListItem.vue'

export default defineComponent({
  name: 'AnimeBangumiList',

  components: { BangumiListItem },

  props: {
    animes: { type: Array as PropType<AnimeOfBangumi[]>, default: () => [] }
  }
})
</script>

<style lang="scss">
.bangumi-list {
}
</style>
