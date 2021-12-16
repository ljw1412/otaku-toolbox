<template>
  <div class="setting-debugger">
    <a-typography-title :heading="6"
      style="margin-top: 0;">功能调试</a-typography-title>
    <a-form>
      <a-form-item label="开发者工具"
        help="开启后，允许开启内部浏览器的开发者工具"
        :label-col-props="{span: 6, offset: 0}"
        :wrapper-col-props="{span: 18, offset: 0}">
        <a-switch v-model="config.allowDevTools"
          type="round"></a-switch>
      </a-form-item>
    </a-form>

    <a-typography-title :heading="6"
      style="margin-top: 0;">功能测试</a-typography-title>
    <a-space>
      <a-button @click="handleAction('createBuiltInBrowser')">内置浏览器</a-button>
      <a-button @click="handleAction('outterLink')">打开外链</a-button>
    </a-space>

    <a-typography-title :heading="6">本地缓存</a-typography-title>
    <a-space>
      <a-button @click="handleAction('cache','navigation')">清除导航栏缓存</a-button>
    </a-space>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { createBuiltInBrowser, ipcSend } from '/@/utils/electron'

export default defineComponent({
  name: 'SettingDebugger',

  computed: {
    config() {
      return this.$global.config
    }
  },

  methods: {
    handleAction(action: string, data?: any) {
      if (action === 'createBuiltInBrowser') {
        createBuiltInBrowser('https://www.bilibili.com')
      } else if (action === 'outterLink') {
        window.open('https://www.bilibili.com', '_blank')
      } else if (action === 'cache') {
        if (data === 'navigation') {
          ipcSend('window.message', 'clear-navigation-cache')
        }
      }
    }
  }
})
</script>

<style lang="scss">
</style>
