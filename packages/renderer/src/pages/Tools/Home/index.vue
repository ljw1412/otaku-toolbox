<template>
  <div class="app-tools">
    <a-page-header title="百宝箱"
      class="tools-header"
      :show-back="false">
    </a-page-header>
    <a-space wrap>
      <tool-card v-for="tool of toolList"
        :key="tool.name"
        v-bind="tool"></tool-card>
    </a-space>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ToolCard from './components/ToolCard.vue'

export default defineComponent({
  name: 'AppTools',

  components: { ToolCard },

  data() {
    return {
      toolList: [
        {
          icon: 'icon-mind-mapping',
          name: '源管理',
          desc: '对资讯、漫画、字幕等源进行管理程序',
          to: { name: 'OriginManager' }
        },
        {
          icon: 'icon-language',
          name: '字幕搜索',
          desc: '获取字幕',
          to: { name: 'ToolSubtitle' },
          config: { width: 720 }
        },
        {
          icon: 'icon-live-broadcast',
          name: '直播',
          desc: '观看直播',
          to: { name: 'AppLive' }
        }
      ]
    }
  }
})
</script>

<style lang="scss">
</style>
