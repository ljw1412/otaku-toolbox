<template>
  <div class="origin-list">
    <a-space wrap class="mx-8 sticky-t bg-app d-flex">
      <a-select
        v-if="typeList.length"
        v-model="mType"
        style="width: 120px;"
        @change="fetchRuleList"
      >
        <a-option
          v-for="item of typeList"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        ></a-option>
      </a-select>
      <a-button type="primary" :disabled="!allowCreate" @click="handleCreateClick">新增</a-button>
    </a-space>

    <table-origin
      :loading="loading"
      :data="finalRuleList"
      :not-edit="!allowCreate"
      @action="handleEditRuleClick"
    ></table-origin>

    <create-rule-drawer
      v-model="isDisplayCreate"
      :type="mType"
      :current-rule="currentRule"
      @success="fetchRuleList"
    ></create-rule-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import CreateRuleDrawer from './CreateRule.vue'
import TableOrigin from './TableOrigin.vue'
import { pluginStore } from '/@/stores/index'


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
      ruleList: [] as RuleManagerItem[],
      netRules: {} as Record<string, RuleManagerItem[]>,
      currentRule: {}
    }
  },

  computed: {
    currentNetRuleList() {
      const type = this.getType()
      if (type === 'news') {
        return this.netRules[this.mType] || []
      }
      return this.netRules[type] || []
    },

    finalRuleList() {
      const list: RuleManagerItem[] = []
      this.currentNetRuleList.forEach(item => {
        const rule = this.ruleList.find(rule => rule.namespace === item.namespace && rule.type === item.type)
        if (rule) {
          rule.version_new = item.version_new
          list.push(rule)
        } else {
          if (item.version > -1) item.version = -1
          list.push(item)
        }
      })
      this.ruleList.forEach(item => {
        const rule = list.find(rule => rule.namespace === item.namespace && rule.type === item.type)
        if (!rule) list.unshift(item)
      })
      return list
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
        this.fetchNetRuleList()
      }
    }
  },

  methods: {
    getType() {
      let type = ''
      for (let name of ['news', 'anime', 'comic', 'game']) {
        if (this.mType.includes(name)) {
          type = name
          break
        }
      }
      return type
    },

    async fetchNetRuleList() {
      const type = this.getType()
      let url = `https://gitee.com/ljw1412/otaku-toolbox-plugins/raw/main/release/${type}/list.json`
      if (this.$global.env.DEV) {
        url = `${pluginStore.devUrl}/${type}/list.json`
      }

      try {
        const ruleList: RuleManagerItem[] = await this.apiGet(url)
        ruleList.forEach(item => {
          item.version_new = item.version
          const filename = type === 'news' ? `${item.type}-${item.namespace}` : item.namespace
          item.downloadPath = url.replace('/list.json', `/${filename}.json`)
        })
        if (type === 'news') {
          ruleList.forEach(item => {
            if (!this.netRules[item.type]) {
              this.netRules[item.type] = [item]
            } else {
              this.netRules[item.type].push(item)
            }
          })
        } else {
          this.netRules[type] = ruleList
        }
      } catch (error: any) {
        this.$message.error(error.message)
      }

    },

    async fetchRuleList() {
      this.loading = true
      const list: RuleManagerItem[] = await this.$API.DataCenter.listRules(this.mType)
      list.forEach(item => {
        item.isDownloaded = true
      })
      this.ruleList = list
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
          simple: true,
          title: '删除确认',
          content: `确认要删除【源: ${record.name}】吗？`,
          onOk: () => {
            this.removeRule(record)
          }
        })
      } else if (action === 'edit') {
        this.currentRule = record
        this.isDisplayCreate = true
      } else if (action === 'update') {
        this.fetchRuleList()
      }
    }
  }
})
</script>

<style lang="scss">
</style>
