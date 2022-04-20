<template>
  <div class="setting-debugger">
    <a-typography-title :heading="6" style="margin-top: 0;">功能调试</a-typography-title>
    <a-form
      :model="{}"
      :label-col-props="{ span: 6, offset: 0 }"
      :wrapper-col-props="{ span: 18, offset: 0 }"
    >
      <a-form-item label="开发者工具" help="开启后，允许开启内部浏览器的开发者工具">
        <a-switch v-model="config.allowDevTools" type="round"></a-switch>
      </a-form-item>
      <a-form-item
        v-if="$global.env.DEV"
        label="插件开发服务地址"
        help="本地插件开发服务地址 (格式: http://127.0.0.1:3000 )"
      >
        <a-button-group>
          <a-input
            v-model="inputPluginDevUrl"
            placeholder="请输入插件开发服务地址(比如：“http://127.0.0.1:3000”)"
          ></a-input>
          <a-button type="primary" @click="handleSaveDevUrlClick">保存</a-button>
          <a-button :disabled="notDevServer" @click="handleCreateDevList">刷新列表</a-button>
        </a-button-group>
      </a-form-item>
    </a-form>

    <a-typography-title :heading="6" style="margin-top: 0;">功能测试</a-typography-title>
    <a-space>
      <a-button @click="handleAction('innerBrowser')">内置浏览器</a-button>
      <a-button @click="handleAction('systemBrowser')">系统浏览器</a-button>
      <a-button @click="handleAction('outterLink')">打开外链</a-button>
      <a-button @click="handleAction('notice')">通知测试</a-button>
    </a-space>

    <a-typography-title :heading="6">本地缓存</a-typography-title>
    <a-space>
      <a-button @click="handleAction('cache', 'navigation')">清除导航栏缓存</a-button>
    </a-space>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ipcSend } from '/@/utils/electron'
import { pluginStore } from '/@/stores/index'


export default defineComponent({
  name: 'SettingDebugger',

  data() {
    return { inputPluginDevUrl: '' }
  },

  computed: {
    config() {
      return this.$global.config
    },

    notDevServer() {
      return !pluginStore.devUrl
    }
  },

  created() {
    this.inputPluginDevUrl = pluginStore.devUrl
  },

  methods: {
    handleSaveDevUrlClick() {
      pluginStore.devUrl = this.inputPluginDevUrl
      this.$message.info('插件开发服务地址保存成功')
    },

    async handleCreateDevList() {
      if (pluginStore.devUrl) {
        try {
          const { message } = await this.apiGet(
            `${pluginStore.devUrl}/create-list`
          )
          this.$message.info(message)
        } catch (error) {
          this.$message.error('创建列表失败，连接插件开发服务失败！')
        }
      }
    },

    handleAction(action: string, data?: any) {
      if (action === 'innerBrowser') {
        this.$API.Electron.win.open('https://www.bilibili.com', {})
      } else if (action === 'systemBrowser') {
        this.$API.Electron.win.open('https://www.bilibili.com', { useSystemBrowser: true })
      } else if (action === 'outterLink') {
        this.$message.info('外链受到"常规"-"使用系统浏览器"选项的控制')
        window.open('https://www.bilibili.com', '_blank')
      } else if (action === 'cache') {
        if (data === 'navigation') {
          ipcSend('window.message', 'clear-navigation-cache')
        }
      } else if (action === 'notice') {
        const notification = new Notification('通知测试', {
          body: 'Welcome To Chaos World！'
        })
        notification.onclick = () => {
          this.$message.success('通知点击测试成功！')
        }
      }
    }
  }
})

</script>

<style lang="scss">
</style>

