<template>
  <a-modal v-model:visible="mVisible"
    :mask-closable="false"
    title="百宝箱插件库"
    class="plugin-lib-dialog"
    :width="800"
    :footer="false">

    <a-button-group v-if="$global.env.DEV"
      class="mb-12 w-100">
      <a-input v-model="inputPluginDevUrl"
        placeholder="请输入插件开发服务地址(比如：“http://127.0.0.1:3000”)">
        <template #prepend>插件开发服务地址</template>
      </a-input>
      <a-button type="primary"
        @click="handleSavePluginDevUrlClick">保存</a-button>
      <a-button :disabled="!pluginDevUrl"
        @click="handleCreateDevList">生成列表</a-button>
    </a-button-group>

    <a-list :data="mList"
      :max-height="500">
      <template #item="{ item, index }">
        <a-list-item :key="index">
          <a-list-item-meta :description="item.desc">
            <template #title>
              <a-tag v-if="item.isDev"
                color="orange"
                size="small"
                style="vertical-align: bottom;"
                class="mr-4">开发版</a-tag>
              <span class="d-inline-block">{{ item.name }} ({{ item.plugin }}@{{ item.version }})</span>
            </template>
            <template #avatar>
              <a-avatar shape="square">
                <component :is="item.icon"></component>
              </a-avatar>
            </template>
          </a-list-item-meta>
          <template #actions>
            <a-button-group>
              <a-button v-if="!item.isAdded"
                type="primary"
                @click="addPlugin(item)">添加</a-button>
              <template v-else>
                <a-button type="primary"
                  :disabled="!item.isNeedUpdate"
                  @click="updatePlugin(item)">更新</a-button>
                <a-button status="danger"
                  @click="removePlugin(item)">删除</a-button>
              </template>
            </a-button-group>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </a-modal>
</template>

<script lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { defineComponent, PropType, toRaw } from 'vue'
import { ipcInvoke } from '/@/utils/electron'
import { only } from '/@/utils/object'

export default defineComponent({
  name: 'PluginLibDialog',

  props: {
    modelValue: Boolean,
    pluginList: { type: Array as PropType<ToolPluginBase[]>, default: () => [] }
  },

  emits: ['update:modelValue'],

  setup() {
    const pluginDevUrl = useLocalStorage('PLUGIN_DEV_URL', '')
    return { pluginDevUrl }
  },

  data() {
    return {
      inputPluginDevUrl: '',
      devList: [] as ToolPluginBase[],
      list: [] as ToolPluginBase[]
    }
  },

  computed: {
    mVisible: {
      get() {
        return this.modelValue
      },
      set(val: boolean) {
        this.$emit('update:modelValue', val)
      }
    },

    mList() {
      return [...this.devList, ...this.list]
    }
  },

  watch: {
    async mVisible(visible: boolean) {
      if (visible) {
        this.fetchPluginList()
        this.fetchDevPluginList()
      }
    }
  },

  created() {
    this.inputPluginDevUrl = this.pluginDevUrl
  },

  methods: {
    handleSavePluginDevUrlClick() {
      this.pluginDevUrl = this.inputPluginDevUrl
      this.$message.info('插件开发服务地址保存成功')
      this.fetchDevPluginList()
    },

    async handleCreateDevList() {
      if (this.pluginDevUrl) {
        try {
          const { message } = await this.apiGet(
            `${this.pluginDevUrl}/create-list`
          )
          this.$message.info(message)
          this.fetchDevPluginList()
        } catch (error) {
          this.$message.error('创建列表失败，连接插件开发服务失败！')
        }
      }
    },

    async fetchDevPluginList() {
      if (!this.$global.env.DEV) return
      try {
        this.devList = []
        const list: ToolPluginBase[] = await this.apiGet(
          `${this.pluginDevUrl}/plugins/list.json`
        )

        list.forEach(plugin => {
          const item = this.pluginList.find(
            item => item.plugin === plugin.plugin
          )
          plugin.isAdded = !!item
          plugin.isNeedUpdate = item && item.version < plugin.version
          plugin.isDev = true
          plugin.serve = this.pluginDevUrl
        })

        this.devList = list
      } catch (error) {
        this.$message.error('连接插件开发服务失败！')
      }
    },

    async fetchPluginList() {
      const list: ToolPluginBase[] = await this.apiGet(
        'https://gitee.com/ljw1412/otaku-toolbox-plugins/raw/main/plugins/list.json'
      )

      list.forEach(plugin => {
        const item = this.pluginList.find(item => item.plugin === plugin.plugin)
        plugin.isAdded = !!item
        plugin.isNeedUpdate = item && item.version < plugin.version
      })

      this.list = list
    },

    formatPluginInfo(plugin: ToolPluginBase) {
      return only(
        plugin,
        'plugin icon name desc version config order'
      ) as ToolPluginBase
    },

    async addPlugin(plugin: ToolPluginBase) {
      const { error } = await ipcInvoke(
        'tool-plugin',
        'download',
        toRaw(plugin)
      )
      if (error) {
        this.$message.error(`添加失败：${error.message}`)
        return
      }
      plugin.order = this.pluginList.length
      this.pluginList.push(this.formatPluginInfo(plugin))
      plugin.isAdded = true
    },

    async updatePlugin(plugin: ToolPluginBase) {
      const data = await ipcInvoke('tool-plugin', 'update', toRaw(plugin))
      const index = this.pluginList.findIndex(
        item => item.plugin === plugin.plugin
      )
      plugin.order = this.pluginList[index].order
      this.pluginList.splice(index, 1, this.formatPluginInfo(plugin))
      plugin.isNeedUpdate = false
    },

    async removePlugin(plugin: ToolPluginBase) {
      const data = await ipcInvoke('tool-plugin', 'remove', toRaw(plugin))
      const index = this.pluginList.findIndex(
        item => item.plugin === plugin.plugin
      )
      this.pluginList.splice(index, 1)
      plugin.isAdded = false
    }
  }
})
</script>

<style lang="scss">
</style>
