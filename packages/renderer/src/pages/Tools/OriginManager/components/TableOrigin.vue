<template>
  <div class="origin-manager-table">
    <a-table table-layout-fixed
      :scroll="{ y: 576 }"
      :loading="loading"
      :data="data"
      :bordered="false"
      :pagination="false">
      <template #columns>
        <a-table-column title="名称"
          data-index="name"
          :width="160"></a-table-column>
        <a-table-column title="命名空间"
          data-index="namespace"
          :width="100"></a-table-column>
        <a-table-column title="版本"
          data-index="version"
          :width="160"></a-table-column>
        <a-table-column title="类型"
          data-index="type"
          :width="140"></a-table-column>
        <a-table-column title="网址"
          data-index="url"></a-table-column>
        <a-table-column title="操作">
          <template #cell="{ record }">
            <a-button-group>
              <a-button size="small"
                :disabled="notEdit"
                @click="handleAction('edit',record)">编辑</a-button>
              <a-button v-if="record.canUpdate"
                type="primary"
                size="small"
                @click="handleAction('update',record)">更新</a-button>
              <a-button status="danger"
                size="small"
                @click="handleAction('reomve',record)">删除</a-button>
            </a-button-group>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'OriginManagerTable',

  props: {
    notEdit: Boolean,
    loading: Boolean,
    data: { type: Array, default: () => [] }
  },

  emits: ['action'],

  methods: {
    handleAction(action: string, record: DataCenter.NewsRule) {
      this.$emit('action', action, record)
    }
  }
})
</script>

<style lang="scss">
</style>
