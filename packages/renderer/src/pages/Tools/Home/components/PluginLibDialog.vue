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
      <a-button :disabled="notDevServer"
        @click="handleCreateDevList">刷新服务列表</a-button>
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
import { defineComponent, toRaw } from 'vue'
import { checkWinExists, ipcInvoke } from '/@/utils/electron'
import { only } from '/@/utils/object'
import { pluginStore } from '/@/stores/index'

export default defineComponent({
  name: 'PluginLibDialog',

  props: {
    modelValue: Boolean
  },

  emits: ['update:modelValue'],

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
    },

    notDevServer() {
      return !pluginStore.devUrl
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
    this.inputPluginDevUrl = pluginStore.devUrl
  },

  methods: {
    handleSavePluginDevUrlClick() {
      pluginStore.devUrl = this.inputPluginDevUrl
      this.$message.info('插件开发服务地址保存成功')
      this.fetchDevPluginList()
    },

    async handleCreateDevList() {
      if (pluginStore.devUrl) {
        try {
          const { message } = await this.apiGet(
            `${pluginStore.devUrl}/create-list`
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
          `${pluginStore.devUrl}/plugins/list.json`
        )

        list.forEach(plugin => {
          const item = pluginStore.list.find(
            item => item.plugin === plugin.plugin
          )
          plugin.isAdded = !!item
          plugin.isNeedUpdate = item && item.version < plugin.version
          plugin.isDev = true
          plugin.serve = pluginStore.devUrl
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
        const item = pluginStore.list.find(
          item => item.plugin === plugin.plugin
        )
        plugin.isAdded = !!item
        plugin.isNeedUpdate = item && item.version < plugin.version
      })

      this.list = list
    },

    formatPluginInfo(plugin: ToolPluginBase) {
      return only(
        plugin,
        'plugin icon name desc version config order isDev'
      ) as ToolPluginBase
    },

    async checkPluginWin(plugin: ToolPluginBase) {
      const isExists = await checkWinExists(plugin.name)
      if (isExists) {
        return new Promise((resolve, reject) => {
          this.$modal.warning({
            title: '警告',
            content: '插件页面正在使用中，是否强制关闭后，继续操作？',
            hideCancel: false,
            onOk: () => {
              ipcInvoke('window.action', 'close', { title: plugin.name })
              resolve(true)
            },
            onCancel: () => reject
          })
        })
      }
      return Promise.resolve(true)
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
      plugin.order = pluginStore.list.length
      pluginStore.list.push(this.formatPluginInfo(plugin))
      plugin.isAdded = true
    },

    async updatePlugin(plugin: ToolPluginBase) {
      await this.checkPluginWin(plugin)
      const data = await ipcInvoke('tool-plugin', 'update', toRaw(plugin))
      const index = pluginStore.list.findIndex(
        item => item.plugin === plugin.plugin
      )
      plugin.order = pluginStore.list[index].order
      pluginStore.list.splice(index, 1, this.formatPluginInfo(plugin))
      plugin.isNeedUpdate = false
    },

    async removePlugin(plugin: ToolPluginBase) {
      await this.checkPluginWin(plugin)
      const data = await ipcInvoke('tool-plugin', 'remove', toRaw(plugin))
      const index = pluginStore.list.findIndex(
        item => item.plugin === plugin.plugin
      )
      pluginStore.list.splice(index, 1)
      plugin.isAdded = false
    }
  }
})
</script>

<style lang="scss">
</style>
