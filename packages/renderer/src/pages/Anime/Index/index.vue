<template>
  <div class="anime-index">
    <app-area-header title="动画索引"
      class="anime-index-header"></app-area-header>
    <div style="height:1000px"></div>

    <filter-dialog v-model="isDisplayFilter"></filter-dialog>
    <acg-fixed-button :bottom="90"
      :visibility-height="-1"
      target="#anime-main"
      @click="isDisplayFilter = true">
      <acg-icon name="funnel-outline"
        size="24"></acg-icon>
    </acg-fixed-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FilterDialog from './components/FilterDialog.vue'

export default defineComponent({
  name: 'AnimeIndex',

  components: {
    FilterDialog
  },

  data() {
    return {
      isDisplayFilter: false
    }
  }
})
</script>

<style lang="scss">
.anime-index {
  .anime-index-header {
    position: sticky;
    top: 0;
  }
}
</style>
