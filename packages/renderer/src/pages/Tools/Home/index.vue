<template>
  <div class="app-tools">
    <a-page-header title="百宝箱" class="tools-header sticky-t bg-app" :show-back="false">
      <template #extra>
        <a-tooltip mini content="百宝箱插件库" position="left">
          <a-button @click="isDisplayPluginDialog = true">
            <template #icon>
              <icon-apps />
            </template>
          </a-button>
        </a-tooltip>
      </template>
    </a-page-header>

    <div class="tools-grid">
      <tool-card v-for="tool of toolList" :key="tool.name" v-bind="tool"></tool-card>
      <tool-card v-for="tool of toolPluginList" :key="tool.plugin" :is-plugin="true" v-bind="tool"></tool-card>
    </div>

    <plugin-lib-dialog v-model="isDisplayPluginDialog"></plugin-lib-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ToolCard from './components/ToolCard.vue'
import PluginLibDialog from './components/PluginLibDialog.vue'
import { pluginStore } from '/@/stores/index'
import { only } from '/@/utils/object'

export default defineComponent({
  name: 'AppTools',

  components: { ToolCard, PluginLibDialog },

  data() {
    return {
      isDisplayPluginDialog: false,
      toolList: [
        {
          icon: 'icon-mind-mapping',
          name: '源管理',
          desc: '对资讯、漫画、字幕等源进行管理程序',
          to: { name: 'OriginManager' }
        },
        {
          icon: 'icon-live-broadcast',
          name: '直播',
          desc: '观看直播',
          to: { name: 'AppLive' }
        },
        {
          icon: 'icon-find-replace',
          name: 'OCR',
          desc: '对图片中的文字进行识别',
          to: { name: 'AppOCR' },
          config: { resizable: true, minWidth: 1280, minHeight: 720 }
        }
      ]
    }
  },

  computed: {
    toolPluginList(): ToolPluginBase[] {
      return pluginStore.list.map(plugin => {
        return {
          ...plugin,
          to: {
            name: 'PluginPage',
            query: only(plugin, 'name plugin version isDev css icon')
          }
        }
      })
    }
  }
})
</script>

<style lang="scss">
.app-tools {
  --tool-card-size: 158px;

  .tools-grid {
    display: grid;
    padding-top: 4px;
    grid-template-columns: repeat(auto-fill, var(--tool-card-size));
    grid-gap: 8px;
    justify-content: center;
  }
}
</style>
