<template>
  <div class="tool-subtitle">
    <div class="d-flex sticky-t bg-app">
      <a-select v-model="origin"
        style="width: 200px;">
        <a-option v-for="item of ruleList"
          :key="item.namespace"
          :label="item.name"
          :value="item.namespace"></a-option>
      </a-select>
      <a-input-search v-model="keyword"
        size="large"
        search-button
        placeholder="请输入关键字"
        @search="search"
        @press-enter="search"></a-input-search>
    </div>

    <acg-api-result :loading="loading"></acg-api-result>

    <a-card v-for="item of resultList"
      :key="item.id"
      class="subtitle-item">
      <a-card-meta :title="item.title">
        <template #description>
          <div v-if="item.version">
            版本: {{ item.version }}
          </div>
          <div>
            <a-link v-if="item.download"
              :title="item.title"
              :href="item.download">下载</a-link>
          </div>
        </template>
      </a-card-meta>
    </a-card>

    <div v-show="!loading && !!page.total"
      class="py-8">
      <a-pagination v-model:current="page.index"
        style="justify-content: center;"
        :total="page.total"
        :page-size="page.size"
        @change="search" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRaw } from 'vue'

export default defineComponent({
  name: 'ToolSubtitle',

  data() {
    return {
      loading: false,
      keyword: '',
      origin: '',
      page: { index: 1, size: 1, total: 0 },
      ruleList: [] as DataCenter.SubtitleRule[],
      resultList: [] as Record<string, any>[]
    }
  },

  computed: {
    rule(): DataCenter.SubtitleRule | undefined {
      return this.ruleList.find(item => item.namespace === this.origin)
    }
  },

  created() {
    this.fetchRuleList()
  },

  methods: {
    async fetchRuleList() {
      this.ruleList = await this.$API.DataCenter.listRules('subtitle')
      if (this.ruleList.length) {
        this.origin = this.ruleList[0].namespace
      }
    },

    async search() {
      if (!this.rule) {
        this.$message.error('当前选中规则异常！')
        return
      }
      if (this.keyword.trim()) {
        this.loading = true
        this.resultList = []
        const { list, pageTotal } = await this.$API.DataCenter.runRule(
          toRaw(this.rule.search),
          this.page.index,
          {
            replacer: { keyword: this.keyword }
          }
        )
        this.page.total = pageTotal
        this.resultList = list
        this.loading = false
      }
    }
  }
})
</script>

<style lang="scss">
.tool-subtitle {
  .subtitle-item {
    margin-top: 8px;
  }
}
</style>
