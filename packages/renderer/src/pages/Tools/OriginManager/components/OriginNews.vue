<template>
  <div class="origin-manager-news">
    <a-space wrap>
      <a-button type="primary"
        @click="handleEditRuleClick('create')">新增</a-button>
      <a-select v-model="type"
        style="width: 120px;"
        @change="handleTypeChange">
        <a-option v-for="item of typeList"
          :key="item.label"
          :label="item.label"
          :value="item.value"></a-option>
      </a-select>
    </a-space>

    <a-table table-layout-fixed
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
          :width="100"></a-table-column>
        <a-table-column title="类型"
          data-index="type"
          :width="140"></a-table-column>
        <a-table-column title="url"
          data-index="url"></a-table-column>
        <a-table-column title="操作">
          <template #cell="{ record }">
            <a-button @click="handleEditRuleClick('edit',record)">编辑</a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <create-rule-drawer v-model="isDisplayCreate"
      :type="type"
      :current-rule="currentRule"></create-rule-drawer>
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
      this.ruleList = await this.$API.DataCenter.listRules(this.type)
    },

    handleTypeChange() {
      this.fetchRuleList()
    },

    handleEditRuleClick(
      action: 'create' | 'edit',
      record: DataCenter.NewsRule
    ) {
      this.currentRule = this.action === 'create' ? {} : record
      this.isDisplayCreate = true
    }
  }
})
</script>

<style lang="scss">
</style>
