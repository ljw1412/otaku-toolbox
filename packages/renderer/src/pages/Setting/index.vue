<template>
  <a-layout class="app-setting">
    <header class="app-setting-header app-drag">
      <app-close-btn size="mini" fixed="tr" style="top:1px; right:1px;" />
    </header>

    <a-layout-sider class="setting-tabs app-drag" :width="150">
      <a-typography-title :heading="4" style="margin-left: 16px;">设置</a-typography-title>
      <a-tabs v-model:active-key="tabKey" class="app-no-drag" type="text" position="left">
        <a-tab-pane v-for="tab of tabs" :key="tab.key" :title="tab.title"></a-tab-pane>
      </a-tabs>
    </a-layout-sider>

    <a-layout-content
      class="setting-config"
      :style="{
        backgroundColor: tabConfig.bgColor,
        color: tabConfig.color
      }"
    >
      <a-typography-title :heading="5" style="margin-top: 0; color: inherit;">{{ subTitle }}</a-typography-title>
      <a-form :model="config">
        <a-form-item
          v-for="item of options"
          :key="item.key"
          :field="item.key"
          :label="item.label"
          :help="item.tip"
          :label-col-props="{ span: 6, offset: 0 }"
          :wrapper-col-props="{ span: 18, offset: 0 }"
          v-bind="item.formItemProps"
        >
          <config-item
            v-model="config[item.key]"
            :value="item.value"
            :type="item.type"
            :props="item.props"
            @change="handleConfigChange(item.key, $event)"
          ></config-item>
        </a-form-item>
      </a-form>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ipcInvoke } from '/@/utils/electron'
import ConfigItem from './components/ConfigItem.vue'

interface SettingTab {
  key: string
  title: string
  color?: string
  bgColor?: string
  options: {
    type: string
    key?: string
    label?: string
    tip?: string
    value?: boolean | string | number
    props?: Record<string, any>
    formItemProps?: Record<string, any>
  }[]
}

const tabs: SettingTab[] = [
  {
    key: 'regular',
    title: '常规',
    options: [
      {
        key: 'use_system_browser',
        label: '使用系统浏览器',
        type: 'switch',
        tip: '开启后，将使用系统默认的浏览器打开外链。',
        value: false
      },
      {
        key: 'create-app-shortcut-link',
        label: '创建快捷方式',
        type: 'button',
        tip: '在桌面创建该应用程序的快捷方式。',
        value: '创建',
        props: {
          async onClick() {
            const result = await ipcInvoke('shell', 'createAppShortcutLink')
            console.log(result)
          }
        }
      }
    ]
  },
  {
    key: 'theme',
    title: '主题',
    options: [{ type: 'theme' }]
  },
  { key: 'proxy', title: '代理', options: [{ type: 'proxy' }] },
  { key: 'debugger', title: '调试', options: [{ type: 'debugger' }] },
  {
    key: 'about',
    title: '关于',
    options: [{ type: 'about' }],
    color: '#ffffff',
    bgColor: 'var(--app-theme)'
  }
]

export default defineComponent({
  name: 'AppSetting',

  components: { ConfigItem },

  data() {
    return {
      tabs,
      tabKey: 'regular',
      config: {} as Record<string, any>
    }
  },

  computed: {
    subTitle(): string {
      const config = tabs.find(tab => tab.key === this.tabKey)
      if (config) {
        return config.title
      }
      return ''
    },

    tabConfig(): SettingTab {
      return tabs.find(tab => tab.key === this.tabKey) || ({} as SettingTab)
    },

    options(): Record<string, any>[] {
      const options = this.tabConfig.options || []
      return options.map(item => {
        if (item.key && this.config[item.key]) {
          item.value = this.config[item.key]
        } else if (!item.key) {
          item.formItemProps = { hideLabel: true, noStyle: true }
        }
        return item
      })
    }
  },

  created() {
    this.getConfig()
  },

  methods: {
    async getConfig() {
      this.config = await this.$API.Electron.config.get()
    },

    async setOption(key: string, value: any) {
      if (typeof value === 'boolean') {
        await this.$API.Electron.config.set({ [key]: value })
        this.getConfig()
      }
    },

    handleConfigChange(key: string, value: any) {
      console.log(key, value)
      this.setOption(key, value)
    }
  }
})
</script>

<style lang="scss">
.app-setting {
  user-select: none;
  position: relative;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }

  .setting-tabs {
    height: 100%;
    // padding: 16px;

    .arco-tabs-nav,
    .arco-tabs-nav-tab,
    .arco-tabs-tab,
    .arco-tabs-tab-title {
      width: 100%;
    }

    .arco-tabs-tab {
      margin-top: 4px;
    }

    .arco-tabs-tab-title {
      padding: 6px 16px;
    }

    .arco-tabs-tab.arco-tabs-tab-active {
      color: var(--app-color-common);
      font-weight: bold;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 60%;
        background-color: var(--app-color-common);
      }
    }
  }

  .app-setting-header {
    position: absolute;
    top: 0;
    left: 0;
    height: 32px;
    width: 100%;
    z-index: 100;
  }

  .setting-config {
    padding: 16px;
    padding-top: 24px;
    width: 85%;
    height: 100%;
    overflow-y: auto;
  }
}
</style>
