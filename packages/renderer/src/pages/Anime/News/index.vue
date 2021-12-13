<template>
  <div class="anime-news">
    <a-page-header title="动画资讯"
      class="sticky-t bg-app"
      :show-back="false">
      <template #extra>
        <a-pagination v-model:current="page.index"
          :total="page.total"
          :page-size="page.size"
          @change="handlePageChange" />
      </template>
      <template #subtitle>
        <a-select v-model="origin"
          size="small">
          <a-option v-for="origin of originList"
            :key="origin.value"
            :value="origin.value"
            :label="origin.label"></a-option>
        </a-select>
      </template>
    </a-page-header>

    <acg-api-result :loading="isLoading"
      :error="isError"
      @retry="fetchNewsData"></acg-api-result>
    <div class="news-list">
      <news-item v-for="item of news"
        :key="item.id"
        v-bind="item"></news-item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NewsItem from './components/NewsItem.vue'

export default defineComponent({
  name: 'AnimeNews',

  components: {
    NewsItem
  },

  data() {
    return {
      isLoading: true,
      isError: false,
      origin: 'dmzj',
      originList: [{ value: 'dmzj', label: '动漫之家' }],
      page: { index: 1, size: 1, total: 0 },
      news: [] as Record<string, any>[]
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
        const data = await this.$API.DataCenter.listNews(
          'dmzj',
          this.page.index
        )
        this.news = data.list
        this.page.total = data.pageTotal
        console.log(data)
      } catch (error) {
        this.isError = true
      }
      this.isLoading = false
    },

    handlePageChange() {
      this.fetchNewsData()
    }
  }
})
</script>

<style lang="scss">
.anime-news {
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
