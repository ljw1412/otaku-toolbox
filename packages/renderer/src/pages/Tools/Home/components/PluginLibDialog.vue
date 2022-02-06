<template>
  <a-modal v-model:visible="mVisible"
    :mask-closable="false"
    title="百宝箱插件库"
    class="plugin-lib-dialog"
    :width="800"
    :footer="false">
    <a-list :data="list"
      :max-height="500">
      <template #item="{ item, index }">
        <a-list-item :key="index">
          <a-list-item-meta :description="item.desc"
            :title="`${item.name} (${item.plugin}@${item.version})`">
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

  data() {
    return {
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
    }
  },

  watch: {
    mVisible(visible: boolean) {
      if (visible) {
        this.fetchPluginList()
      }
    }
  },

  methods: {
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
      const data = await ipcInvoke('tool-plugin', 'download', toRaw(plugin))
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
