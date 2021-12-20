<template>
  <div class="app-news">
    <a-page-header :title="title"
      :class="{'sticky-t bg-app':!mini}"
      :show-back="false">
      <template #subtitle>
        <a-select v-model="origin"
          style="width: 140px;"
          size="small"
          @change="handleOriginChange">
          <a-option v-for="option of originList"
            :key="option.namespace"
            :value="option.namespace"
            :label="option.name"></a-option>
        </a-select>
      </template>
      <template #extra>
        <a-button v-if="mini"
          :loading="isLoading"
          @click="fetchNewsData">刷新</a-button>
        <a-pagination v-else
          v-model:current="page.index"
          :total="page.total"
          :page-size="page.size"
          @change="handlePageChange" />
      </template>
    </a-page-header>

    <acg-api-result :loading="false"
      :error="isError"
      @retry="fetchNewsData"></acg-api-result>
    <div class="news-list">
      <a-card v-for="item of mNews"
        :key="item.id"
        :bordered="false"
        :body-style="{padding:0}"
        :class="{ 'is-skeleton': isSkeleton }"
        data-skeleton-animate
        hoverable
        class="news-item"
        @click="handleNewsClick(item.url)">
        <div class="news-item-container"
          :title="item.title">
          <div class="cover skeleton-bg">
            <img v-if="!isSkeleton"
              :src="item.cover"
              loading="lazy" />
          </div>
          <div class="title text-truncate skeleton-bg">
            {{ item.title }}
          </div>
          <div class="content skeleton-bg"
            :ellipsis="{ rows:3 }">
            {{ item.desc }}
          </div>
          <div class="footer">
            <div class="update-time skeleton-bg">{{ item.updateTime }}</div>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppNews',

  props: {
    title: String,
    type: String,
    mini: Boolean,
    skeletonCount: { type: Number, default: 2 }
  },

  data() {
    return {
      isLoading: true,
      isError: false,
      origin: '',
      originList: [] as DataCenter.Rule[],
      page: { index: 1, size: 1, total: 0 },
      news: [] as Record<string, any>[]
    }
  },

  computed: {
    isSkeleton(): boolean {
      return this.isLoading && !this.isError
    },

    mNews(): Record<string, any>[] {
      if (this.isSkeleton) {
        return new Array(this.skeletonCount).fill({})
      }
      return this.news
    }
  },

  created() {
    this.listRuleList()
  },

  methods: {
    async listRuleList() {
      const list = await this.$API.DataCenter.listRules(this.type)
      this.originList = list
      if (list.length) {
        this.origin = list[0].namespace
        this.fetchNewsData()
      }
    },

    async fetchNewsData() {
      this.isLoading = true
      this.isError = false
      this.news = []
      try {
        const data = await this.$API.DataCenter.listNews(
          this.type,
          this.origin,
          this.page.index
        )
        this.news = data.list
        this.page.total = data.pageTotal
      } catch (error) {
        this.isError = true
      }
      this.isLoading = false
    },

    handlePageChange() {
      this.fetchNewsData()
    },

    handleNewsClick(url: string) {
      if (url) {
        window.open(url)
      }
    },

    handleOriginChange() {
      this.page.index = 1
      this.fetchNewsData()
    }
  }
})
</script>

<style lang="scss">
@import '../styles/scss/index';

.app-news {
  .news-list {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-column-gap: 30px;

    box-sizing: border-box;
    padding: 0 15px;
    margin: 0 -15px;
    width: 100%;

    .news-item {
      cursor: pointer;
      overflow: hidden;
      margin-bottom: 30px;

      &.arco-card {
        transition-property: box-shadow, transform;
        &:hover {
          transform: translateY(-4px);
          .news-item-container {
            color: var(--color-text-1);
          }
        }
      }

      .news-item-container {
        display: grid;
        height: 150px;
        grid-template-columns: 200px auto;
        grid-template-rows: 48px 76px auto;
        transition: color 0.2s;

        * {
          box-sizing: border-box;
        }

        .cover {
          grid-row: 1/4;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .title {
          font-size: 20px;
          line-height: 1.4;
          margin: 8px;
        }

        .content {
          margin: 0 8px;
          font-size: 14px;
          line-height: 1.5715;
          height: 68px;
          word-break: break-all;
          @include multi-text-truncate(3);
        }

        .footer {
          text-align: right;
          padding: 0 8px;
          .update-time {
            display: inline-block;
            min-width: 120px;
            height: 1.2em;
            line-height: 1.2em;
          }
        }
      }
    }
  }
}
</style>
