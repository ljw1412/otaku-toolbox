<template>
  <div class="game-list">
    <a-page-header :title="mTitle" :show-back="false" class="game-list-header sticky-t bg-app"></a-page-header>
    <div class="list">
      <div v-for="item of list" :key="item.id" class="game-item">
        <a-card class="game-card" :bordered="false" hoverable @click="handleCardClick(item)">
          <template #cover>
            <acg-ratio-div :ratio="[16, 9]">
              <img :src="item.cover" />
            </acg-ratio-div>
          </template>
          <a-card-meta :title="item.title"></a-card-meta>
        </a-card>
      </div>
    </div>
    <div class="bg-app sticky-b w-100 py-6">
      <a-pagination
        v-model:current="page.index"
        :total="page.total"
        :page-size="page.size"
        style="justify-content: flex-end;"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GameList',

  props: {
    namespace: String
  },

  data() {
    return {
      title: '',
      list: [] as Record<string, any>[],
      page: { index: 1, size: 1, total: 0 }
    }
  },

  computed: {
    mTitle(): string {
      return (this.$route.query.title as string) || this.title || ''
    }
  },

  watch: {
    namespace() {
      this.fetchData()
    }
  },

  activated() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      if (!this.namespace) return
      const rule = await this.$API.DataCenter.showRule('game-resource', this.namespace)
      if (rule) {
        const { list, pageTotal } = await this.$API.DataCenter.runRule(rule.pages[0], this.page.index)
        this.list = list
        this.page.total = pageTotal
      }
    },

    handleCardClick(item: Record<string, any>) {
      window.open(item.url, '_blank')
    },

    handlePageChange() {
      this.fetchData()
      const scrollView = document.querySelector('#game-main')
      if (scrollView) scrollView.scrollTo(0, 0)
    }
  }
})
</script>

<style lang="scss">
.game-list {
  display: flex;
  flex-direction: column;

  .list {
    display: flex;
    flex-wrap: wrap;
  }

  .game-item {
    flex-shrink: 0;
    width: 25%;
    padding: 6px;
    box-sizing: border-box;
  }

  .game-card {
    cursor: pointer;
  }
}
</style>

