<template>
  <div class="comic-origin-tab-page">
    <acg-api-result :loading="isLoading" :error="isError" @retry="runRule"></acg-api-result>

    <div class="comic-list py-6">
      <comic-card v-for="item of list" :key="item.id" :info="item"></comic-card>
    </div>
    <a-pagination
      v-model:current="page.index"
      :total="page.total"
      :page-size="page.size"
      style="justify-content: flex-end;"
      class="bg-app sticky-b pt-4 w-100"
      :class="{ 'pagination-absolute': isLoading || isError }"
      @change="handlePageChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRaw } from 'vue'
import ComicCard from '../../components/ComicCard.vue'

export default defineComponent({
  name: 'ComicOriginTabPage',

  components: { ComicCard },

  props: {
    name: { type: String, default: '' },
    keyword: { type: String, default: '' },
    rule: { type: Object as PropType<DataCenter.RulePageParams>, default: () => ({}) }
  },
  data() {
    return {
      isLoading: true,
      isError: true,
      list: [] as Record<string, string>[],
      page: { index: 1, size: 1, total: 0 }
    }
  },

  created() {
    this.runRule()
  },

  methods: {
    async runRule() {
      this.list = []
      this.isLoading = true
      this.isError = false
      try {
        const replacer: Record<string, string> = {}
        if (this.rule.name === '搜索') {
          replacer.keyword = encodeURIComponent(this.keyword)
        }
        const { list, pageTotal } = await this.$API.DataCenter.runRule(
          toRaw(this.rule),
          this.page.index,
          { replacer }
        )
        this.list = list
        this.page.total = pageTotal
      } catch (error) {
        this.isError = true
      }
      this.isLoading = false
    },

    handlePageChange() {
      this.runRule()
    }
  }
})
</script>

<style lang="scss">
.comic-origin-tab-page {
  --comic-card-gap: 8px;
  --comic-card-width: calc(20% - var(--comic-card-gap));
  .comic-list {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    min-height: 100%;
    margin-bottom: 12px;
    .comic-card-wrap {
      flex: 0 0 auto;
      width: var(--comic-card-width);
      margin-right: var(--comic-card-gap);
      margin-bottom: var(--comic-card-gap);
    }
  }

  .pagination-absolute {
    position: absolute !important;
    bottom: 1px;
  }
}

@media (min-width: 1800px) {
  .comic-origin-tab-page {
    --comic-card-width: calc(12.5% - var(--comic-card-gap));
  }
}

@media (min-width: 1600px) and (max-width: 1799.99px) {
  .comic-origin-tab-page {
    --comic-card-width: calc(16.66% - var(--comic-card-gap));
  }
}
</style>
