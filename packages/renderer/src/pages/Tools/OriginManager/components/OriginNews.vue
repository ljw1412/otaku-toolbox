<template>
  <div class="origin-manager-news">
    <a-space wrap
      class="mx-8 sticky-t bg-app d-flex">
      <a-select v-model="type"
        style="width: 120px;"
        @change="fetchRuleList">
        <a-option v-for="item of typeList"
          :key="item.label"
          :label="item.label"
          :value="item.value"></a-option>
      </a-select>
      <a-button type="primary"
        @click="handleEditRuleClick('create')">新增</a-button>
    </a-space>

    <a-table table-layout-fixed
      :scroll="{y:576}"
      :loading="loading"
      :data="ruleList"
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
        <a-table-column title="url"
          data-index="url"></a-table-column>
        <a-table-column title="操作">
          <template #cell="{ record }">
            <a-button-group>
              <a-button size="small"
                @click="handleEditRuleClick('edit',record)">编辑</a-button>
              <a-button status="danger"
                size="small"
                @click="handleEditRuleClick('reomve',record)">删除</a-button>
            </a-button-group>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <create-rule-drawer v-model="isDisplayCreate"
      :type="type"
      :current-rule="currentRule"
      @success="fetchRuleList"></create-rule-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CreateRuleDrawer from './CreateRule.vue'

export default defineComponent({
  name: 'OriginManagerNews',

  components: {
    CreateRuleDrawer
  },

  data() {
    return {
      isDisplayCreate: false,
      loading: true,
      type: 'anime-news',
      typeList: [
        { label: '动画', value: 'anime-news' },
        { label: '漫画', value: 'comic-news' },
        { label: '游戏', value: 'game-news' }
      ],
      ruleList: [],
      currentRule: {}
    }
  },

  created() {
    this.fetchRuleList()
  },

  methods: {
    async fetchRuleList() {
      this.loading = true
      this.ruleList = await this.$API.DataCenter.listRules(this.type)
      this.loading = false
    },

    async removeRule(record: DataCenter.NewsRule) {
      await this.$API.DataCenter.removeRule(record)
      await this.fetchRuleList()
    },

    handleEditRuleClick(
      action: 'create' | 'edit' | 'reomve',
      record?: DataCenter.NewsRule
    ) {
      if (action === 'reomve') {
        this.$modal.open({
          title: '删除确认',
          content: `确认要删除【源: ${record!.name}】吗？`,
          onOk: () => {
            this.removeRule(record!)
          }
        })
        return
      }

      this.currentRule = action === 'create' ? {} : record || {}
      this.isDisplayCreate = true
    }
  }
})
</script>

<style lang="scss">
</style>
