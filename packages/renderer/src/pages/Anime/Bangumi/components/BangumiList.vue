<template>
  <div class="bangumi-list">
    <acg-area-header title="新番简讯"></acg-area-header>
    <div class="anime-list">
      <bangumi-list-item v-for="anime of animes"
        :key="anime._id"
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
    animes: { type: Array as PropType<BangumiBasic[]>, default: () => [] }
  }
})
</script>

<style lang="scss">
.bangumi-list {
}
</style>
