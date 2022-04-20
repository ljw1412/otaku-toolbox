<template>
  <div class="origin-manager-table">
    <a-table
      table-layout-fixed
      :scroll="{ y: 576 }"
      :loading="loading"
      :data="data"
      :bordered="false"
      :pagination="false"
    >
      <template #columns>
        <a-table-column title="名称" data-index="name" :width="160"></a-table-column>
        <a-table-column title="命名空间" data-index="namespace" :width="120"></a-table-column>
        <a-table-column title="版本" data-index="version" :width="160"></a-table-column>
        <a-table-column title="类型" data-index="type" :width="140"></a-table-column>
        <a-table-column title="网址" data-index="url"></a-table-column>
        <a-table-column title="操作">
          <template #cell="{ record }">
            <a-button-group>
              <a-button
                v-if="record.version < record.version_new"
                type="primary"
                size="small"
                :loading="record.downloading"
                @click="handleDownload(record)"
              >{{ record.version === -1 ? '添加' : '更新' }}</a-button>
              <span v-if="record.version === -999">开发中……</span>
              <template v-if="record.version > -1">
                <a-button size="small" :disabled="notEdit" @click="handleAction('edit', record)">编辑</a-button>
                <a-button status="danger" size="small" @click="handleAction('reomve', record)">删除</a-button>
              </template>
            </a-button-group>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'OriginManagerTable',

  props: {
    notEdit: Boolean,
    loading: Boolean,
    data: { type: Array as PropType<RuleManagerItem[]>, default: () => [] }
  },

  emits: ['action'],

  methods: {
    handleAction(action: string, record: DataCenter.NewsRule) {
      this.$emit('action', action, record)
    },

    async fetchNetRule(url: string) {
      return this.apiGet(url)
    },

    async handleDownload(item: RuleManagerItem) {
      if (!item.downloadPath) {
        this.$message.error('获取源规则地址失败！')
        return
      }
      const ruleItem = this.data.find(rule => rule.namespace === item.namespace)
      if (!ruleItem) return
      ruleItem.downloading = true
      try {
        const rule = await this.fetchNetRule(item.downloadPath)
        if (typeof rule === 'object') {
          await this.$API.DataCenter.saveRule(rule)
        }
        this.$emit('action', 'update')
      } catch (error) {
        console.error(error)
      }
      ruleItem.downloading = false
    }

  }
})
</script>

<style lang="scss">
</style>
