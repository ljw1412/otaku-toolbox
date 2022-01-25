<template>
  <div class="origin-list">
    <a-space wrap
      class="mx-8 sticky-t bg-app d-flex">
      <a-select v-if="typeList.length"
        v-model="mType"
        style="width: 120px;"
        @change="fetchRuleList">
        <a-option v-for="item of typeList"
          :key="item.label"
          :label="item.label"
          :value="item.value"></a-option>
      </a-select>
      <a-button type="primary"
        :disabled="!allowCreate"
        @click="handleCreateClick">新增</a-button>
    </a-space>

    <table-origin :loading="loading"
      :data="ruleList"
      :not-edit="!allowCreate"
      @action="handleEditRuleClick"></table-origin>

    <create-rule-drawer v-model="isDisplayCreate"
      :type="mType"
      :current-rule="currentRule"
      @success="fetchRuleList"></create-rule-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import CreateRuleDrawer from './CreateRule.vue'
import TableOrigin from './TableOrigin.vue'

export default defineComponent({
  name: 'OriginList',

  components: { CreateRuleDrawer, TableOrigin },

  props: {
    allowCreate: Boolean,
    type: {
      type: [String, Array] as PropType<
        string | { label: string; value: string }[]
      >,
      default: ''
    }
  },

  data() {
    return {
      isDisplayCreate: false,
      loading: true,
      mType: '',
      typeList: [] as { label: string; value: string }[],
      ruleList: [],
      currentRule: {}
    }
  },

  watch: {
    type: {
      immediate: true,
      handler(type: string | { label: string; value: string }[]) {
        if (typeof type === 'string') {
          this.mType = type
          this.typeList = []
        } else if (Array.isArray(type)) {
          this.typeList = type
          if (this.typeList.length) {
            this.mType = type[0].value
          }
        }
        this.fetchRuleList()
      }
    }
  },

  methods: {
    async fetchRuleList() {
      this.loading = true
      this.ruleList = await this.$API.DataCenter.listRules(this.mType)
      this.loading = false
    },

    async removeRule(record: DataCenter.NewsRule) {
      await this.$API.DataCenter.removeRule(record)
      await this.fetchRuleList()
    },

    handleCreateClick() {
      this.currentRule = {}
      this.isDisplayCreate = true
    },

    handleEditRuleClick(
      action: 'edit' | 'reomve' | 'update',
      record: DataCenter.NewsRule
    ) {
      if (action === 'reomve') {
        this.$modal.open({
          title: '删除确认',
          content: `确认要删除【源: ${record.name}】吗？`,
          onOk: () => {
            this.removeRule(record)
          }
        })
      } else if (action === 'edit') {
        this.currentRule = record
        this.isDisplayCreate = true
      }
    }
  }
})
</script>

<style lang="scss">
</style>
