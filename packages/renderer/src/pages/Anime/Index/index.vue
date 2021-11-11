<template>
  <div class="anime-index">
    <app-area-header title="动画索引"
      class="anime-index-header"></app-area-header>
    <div class="index-grid">
      <anime-item v-for="bangumi of bangumiList"
        :key="bangumi._id"
        :anime="bangumi"></anime-item>
    </div>

    <filter-dialog v-model="isDisplayFilter"></filter-dialog>

    <acg-fixed-button v-if="!loading"
      always
      title="刷新"
      :bottom="130"
      @click="fetchBangumiList">
      <acg-icon name="reload"
        :size="20"></acg-icon>
    </acg-fixed-button>
    <acg-fixed-button always
      title="筛选"
      :bottom="85"
      @click="isDisplayFilter = true">
      <acg-icon name="funnel-outline"
        size="24"></acg-icon>
    </acg-fixed-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AnimeItem from './components/AnimeItem.vue'
import FilterDialog from './components/FilterDialog.vue'

export default defineComponent({
  name: 'AnimeIndex',

  components: {
    FilterDialog,
    AnimeItem
  },

  data() {
    return {
      loading: false,
      isDisplayFilter: false,
      bangumiList: [] as AnimeOfBangumi[]
    }
  },

  created() {
    this.fetchBangumiList()
  },

  methods: {
    async fetchBangumiList() {
      this.loading = true
      this.bangumiList = await this.apiGet('bangumi')
      this.loading = false
    }
  }
})
</script>

<style lang="scss">
.anime-index {
  --anime-item-width: 168px;
  --anime-item-height: 224px;

  .anime-index-header {
    position: sticky;
    top: 0;
    background-color: var(--bg-color);
  }

  .index-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, var(--anime-item-width));
    justify-content: space-between;
    justify-items: center;
    margin-top: 10px;
  }
}

@media (min-width: 1701px) {
  .anime-index {
    --anime-item-width: 201px;
    --anime-item-height: 268px;
  }
}
</style>
