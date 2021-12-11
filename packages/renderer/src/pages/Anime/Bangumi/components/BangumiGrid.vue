<template>
  <div class="bangumi-grid">
    <acg-area-header title="新番导览"></acg-area-header>
    <bangumi-grid-group v-for="(group,index) of animeGroupList"
      :key="index"
      :title="group.title"
      :animes="group.list"></bangumi-grid-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import BangumiGridGroup from './BangumiGridGroup.vue'

export default defineComponent({
  name: 'AnimeBangumiGrid',

  components: { BangumiGridGroup },

  props: {
    animeGroupList: {
      type: Array as PropType<BangumiBasicGroup[]>,
      default: () => []
    }
  }
})
</script>

<style lang="scss">
.bangumi-grid {
}
</style>
