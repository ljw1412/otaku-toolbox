<template>
  <div class="app-tools">
    <a-page-header title="百宝箱"
      class="tools-header"
      :show-back="false">
    </a-page-header>
    <tool-card v-for="tool of toolList"
      :key="tool.name"
      v-bind="tool"></tool-card>
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
          icon: '',
          name: '源管理',
          desc: '对数据源进行管理程序',
          to: { name: 'OriginManager' }
        }
      ]
    }
  }
})
</script>

<style lang="scss">
</style>
