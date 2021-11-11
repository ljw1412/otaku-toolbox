<template>
  <div class="anime-index">
    <app-area-header title="动画索引"
      class="anime-index-header">
      <template v-if="filterTagList.length"
        #left>
        <span style="margin-left: 4px;">[</span>
        <span v-for="(tag,index) of filterTagList"
          :key="tag._id">
          {{ tag.name }}{{ filterTagList.length - 1 - index ? '|' : '' }}
        </span>
        <span>]</span>
      </template>
    </app-area-header>
    <div class="index-grid">
      <anime-item v-for="bangumi of bangumiList"
        :key="bangumi._id"
        :anime="bangumi"></anime-item>
    </div>

    <filter-drawer v-model="isDisplayFilter"
      :group-list="tagGroupList"
      @submit="handleFilterSubmit"></filter-drawer>

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
import FilterDrawer from './components/FilterDrawer.vue'

export default defineComponent({
  name: 'AnimeIndex',

  components: {
    FilterDrawer,
    AnimeItem
  },

  data() {
    return {
      loading: false,
      isDisplayFilter: false,
      bangumiList: [] as AnimeOfBangumi[],
      tagGroupList: [] as TagGroup[],
      filterTagList: [] as Tag[]
    }
  },

  created() {
    this.fetchBangumiList()
    this.fetchTagGroup()
  },

  methods: {
    async fetchBangumiList() {
      this.loading = true
      this.bangumiList = await this.apiGet('bangumi')
      this.loading = false
    },

    async fetchTagGroup() {
      const list = (await this.apiGet('tag_group')) as TagGroup[]
      list.forEach(group => {
        group.tags.forEach(tag => {
          tag.selected = false
        })
        group.tags.unshift({
          _id: '',
          name: '全部',
          order: 0,
          group: '',
          selected: true
        })
      })
      this.tagGroupList = list
    },

    handleFilterSubmit(tags: Tag[]) {
      this.filterTagList = tags
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
