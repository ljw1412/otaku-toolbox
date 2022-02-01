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
      :bordered="false"
      hoverable
      size="small"
      class="subtitle-item mt-16 mx-8">
      <template #title>
        <div class="text-truncate cursor-pointer"
          :title="item.title"
          @click="handleShowDetails(item)">{{ item.title }}</div>
      </template>
      <div v-if="item.version">版本: {{ item.version }}</div>
      <div class="layout-lr">
        <div class="mt-4"
          style="width: 60%;">
          <span v-for="field of ['type','lang','from','updateTime']"
            v-show="item[field]"
            :key="field"
            class="d-inline-block fs-12"
            style="width: 50%;">{{ item[field] }}</span>
        </div>
        <div class="text-right mt-4">
          <a-tooltip mini
            position="left"
            :content="'下载：'+ item.title">
            <a v-if="item.download"
              :href="item.download">
              <a-button>
                <template #icon>
                  <icon-download />
                </template>
              </a-button>
            </a>
          </a-tooltip>
        </div>
      </div>
    </a-card>

    <div v-show="!loading && !!page.total"
      class="py-8">
      <a-pagination v-model:current="page.index"
        style="justify-content: center;"
        :total="page.total"
        :page-size="page.size"
        @change="search" />
    </div>

    <a-modal v-model:visible="details.isDisplay"
      simple
      width="80%"
      :footer="false"
      :title="details.data.title">
      <a-spin v-if="details.isLoading"
        dot
        class="d-flex layout-center"
        style="height:80px"></a-spin>

      <span v-for="field of ['type','lang','from','group','updateTime']"
        v-show="details.data[field]"
        :key="field"
        class="d-inline-block fs-14"
        style="width: 50%;">{{ details.data[field] }}</span>
      <div v-if="details.data.version">{{ details.data.version }}</div>

      <div class="subtitle-file-list w-100 mt-12">
        <a-list size="small"
          :max-height="260">
          <a-list-item v-for="item of details.data.list"
            :key="item.name">
            <span class="flex-shrink-0 flex-grow-1 w-50"
              style="word-break: break-all;">{{ item.name }}</span>
            <template #extra>
              <span v-if="item.size"
                class="d-inline-block text-right"
                style="min-width:80px">{{ item.size }}</span>
            </template>
          </a-list-item>
        </a-list>
      </div>
      <a-button-group class="mt-8 w-100">
        <a-button type="primary"
          class="flex-grow-1"
          :loading="details.isLoading"
          :disabled="!details.data.download"
          @click="open(details.data.download)">下载字幕</a-button>
        <a-button class="flex-grow-1"
          @click="details.isDisplay = false">关闭</a-button>
      </a-button-group>
    </a-modal>
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
      resultList: [] as Record<string, any>[],
      details: {
        isDisplay: false,
        isLoading: false,
        data: { list: [] } as Record<string, any> & {
          list: Record<string, any>[]
        }
      }
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

    async fetchDetails(replacer: Record<string, any>) {
      if (this.rule && this.rule.details) {
        this.details.data = { list: [] }
        this.details.isLoading = true
        this.details.data = await this.$API.DataCenter.runRule(
          toRaw(this.rule.details),
          0,
          { replacer }
        )
        this.details.isLoading = false
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
            replacer: { keyword: encodeURIComponent(this.keyword) }
          }
        )
        this.page.total = pageTotal
        this.resultList = list
        this.loading = false
      }
    },

    handleShowDetails(item: Record<string, any>) {
      if (this.rule && this.rule.details) {
        this.fetchDetails({ path: item.path })
        this.details.isDisplay = true
      }
    },

    open(href: string) {
      window.open(href)
    }
  }
})
</script>

<style lang="scss">
.tool-subtitle {
}
</style>
