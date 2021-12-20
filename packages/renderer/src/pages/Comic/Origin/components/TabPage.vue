<template>
  <div class="comic-origin-tab-page">

    <div class="comic-list">
      <comic-card v-for="item of list"
        :key="item.id"
        :info="item"></comic-card>
    </div>
    <a-pagination v-model:current="page.index"
      :total="page.total"
      :page-size="page.size"
      style="justify-content: flex-end;"
      @change="handlePageChange" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRaw } from 'vue'
import ComicCard from './ComicCard.vue'

export default defineComponent({
  name: 'ComicOriginTabPage',

  components: { ComicCard },

  props: {
    rule: { type: Object as PropType<DataCenter.Rule>, default: () => ({}) }
  },
  data() {
    return {
      list: [] as Record<string, string>[],
      page: { index: 1, size: 1, total: 0 }
    }
  },

  created() {
    this.runRule()
  },

  methods: {
    async runRule() {
      const { list, pageTotal } = await this.$API.DataCenter.runRule(
        toRaw(this.rule),
        this.page.index
      )
      this.list = list
      this.page.total = pageTotal
    },

    handlePageChange() {
      this.runRule()
    }
  }
})
</script>

<style lang="scss">
.comic-origin-tab-page {
  --comic-card-gap: 6px;
  --comic-card-width: calc(20% - var(--comic-card-gap));
  .comic-list {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: 12px;
    .comic-card-wrap {
      flex: 1 0 auto;
      width: var(--comic-card-width);
      margin-right: var(--comic-card-gap);
      margin-bottom: var(--comic-card-gap);
    }
  }
}
</style>
