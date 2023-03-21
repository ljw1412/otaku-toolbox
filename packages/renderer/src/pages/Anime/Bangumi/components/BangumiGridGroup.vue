<template>
  <div class="bangumi-grid-group">
    <h4 v-if="title">{{ title }}</h4>
    <a-grid
      :cols="{ xs: 3, sm: 4, md: 5, lg: 6, xl: 7, xxl: 9 }"
      :col-gap="8"
      :row-gap="8"
      class="anime-grid"
    >
      <a-grid-item v-for="anime of animes" :key="anime._id">
        <bangumi-grid-item :anime="anime"></bangumi-grid-item>
      </a-grid-item>
    </a-grid>
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
    animes: {
      type: Array as PropType<FormatedBangumiBasic[]>,
      default: () => []
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

@media (min-width: 1750px) {
  .bangumi-grid-group {
    > .arco-grid {
      grid-template-columns: repeat(10, minmax(0px, 1fr)) !important;
    }
  }
}
</style>
