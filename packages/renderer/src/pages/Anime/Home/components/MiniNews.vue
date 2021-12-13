<template>
  <div class="mini-news">
    <a-page-header title="动画资讯"
      :show-back="false">
      <template #extra>
        <a-button :loading="isLoading"
          @click="fetchNewsData">刷新</a-button>
      </template>
    </a-page-header>
    <div class="news-list">
      <mini-news-item v-for="item of newsList"
        :key="item.id"
        :skeleton="isSkeleton"
        v-bind="item"></mini-news-item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MiniNewsItem from './MiniNewsItem.vue'

export default defineComponent({
  name: 'MiniNews',
  components: { MiniNewsItem },
  data() {
    return {
      isLoading: true,
      isError: false,
      news: [] as Record<string, any>[]
    }
  },

  computed: {
    isSkeleton(): boolean {
      return this.isLoading || this.isError
    },

    newsList(): Record<string, any>[] {
      if (this.isSkeleton) {
        return new Array(2).fill({})
      }
      return this.news
    }
  },

  created() {
    this.fetchNewsData()
  },

  methods: {
    async fetchNewsData() {
      this.isLoading = true
      this.isError = false
      this.news = []
      try {
        const data = await this.$API.DataCenter.listNews('dmzj', 1)
        this.news = data.list
        console.log(data)
      } catch (error) {
        this.isError = true
      }
      this.isLoading = false
    }
  }
})
</script>

<style lang="scss">
.mini-news {
  .news-list {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-column-gap: 30px;

    box-sizing: border-box;
    padding: 0 15px;
    margin: 0 -15px;
    width: 100%;
  }
}
</style>
