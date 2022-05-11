<template>
  <div class="app-news">
    <a-page-header :title="title" :class="{ 'sticky-t bg-app': !mini }" :show-back="false">
      <template #subtitle>
        <a-select v-model="origin" style="width: 140px;" size="small" @change="handleOriginChange">
          <a-option
            v-for="option of originList"
            :key="option.namespace"
            :value="option.namespace"
            :label="option.name"
          ></a-option>
        </a-select>
      </template>
      <template #extra>
        <a-button v-if="mini" :loading="isLoading" @click="fetchNewsData">刷新</a-button>
        <a-pagination
          v-else
          v-model:current="page.index"
          :total="page.total"
          :page-size="page.size"
          @change="handlePageChange"
        />
      </template>
    </a-page-header>

    <acg-api-result :loading="false" :error="isError" @retry="fetchNewsData"></acg-api-result>
    <div class="news-list">
      <a-card
        v-for="item of mNews"
        :key="item.id"
        :bordered="false"
        :body-style="{ padding: 0 }"
        :class="{ 'is-skeleton': isSkeleton }"
        data-skeleton-animate
        class="news-item app-card-up"
        @click="handleNewsClick(item.url)"
      >
        <div class="news-item-container" :title="item.title">
          <div class="cover skeleton-bg">
            <img v-if="!isSkeleton" :src="item.cover" loading="lazy" />
          </div>
          <div class="title text-truncate skeleton-bg">{{ item.title }}</div>
          <div class="content skeleton-bg" :ellipsis="{ rows: 3 }">{{ item.desc }}</div>
          <div class="footer">
            <div class="update-time skeleton-bg">{{ item.updateTime }}</div>
          </div>
        </div>
      </a-card>
      <div class="bottom-blur"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRaw } from 'vue'
import { useTimeout } from '@vueuse/core'

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
      originList: [] as DataCenter.NewsRule[],
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
    },
    currentRule() {
      return this.originList.find(item => item.namespace === this.origin)
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
        if (!this.currentRule || !this.currentRule.news)
          throw new Error('新闻规则不存在')
        const data = await this.$API.DataCenter.runRule(
          toRaw(this.currentRule.news),
          this.page.index
        )
        this.news = data.list
        this.page.total = data.pageTotal
      } catch (error) {
        this.isError = true
        console.error(error)
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
@import "../styles/scss/index";

.app-news {
  .news-list {
    position: relative;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-column-gap: 16px;

    box-sizing: border-box;
    padding: 0 20px;
    margin: 0 -8px;
    width: 100%;
    padding-top: 8px !important;
    margin-bottom: -16px;

    .news-item {
      cursor: pointer;
      overflow: hidden;
      margin-bottom: 16px;

      &.arco-card:hover {
        .news-item-container {
          color: var(--color-text-1);
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

    .bottom-blur {
      grid-column: 1/3;
      position: sticky;
      bottom: 0;
      left: 0;
      margin-top: -16px;
      width: 100%;
      height: 40px;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0,
        var(--color-bg-3) 100%
      );
      z-index: 1;
    }
  }
}

@media (min-width: 1750px) {
  .app-news {
    .news-list {
      grid-template-columns: repeat(3, 33.33%);
      padding: 0 26px;
      margin: 0 -16px;
      .bottom-blur {
        grid-column: 1/4;
      }
    }
  }
}
</style>
