<template>
  <a-layout class="app-setting">
    <header class="app-setting-header app-drag">
      <app-controls class="app-no-drag"></app-controls>
    </header>

    <a-layout-sider class="setting-tabs app-drag"
      :width="150">
      <a-typography-title :heading="4"
        style="margin-left: 16px;">设置</a-typography-title>
      <a-tabs v-model:active-key="tabKey"
        class="app-no-drag"
        type="text"
        position="left">
        <a-tab-pane v-for="tab of tabs"
          :key="tab.key"
          :title="tab.title"></a-tab-pane>
      </a-tabs>
    </a-layout-sider>

    <a-layout-content class="setting-config">
      <a-typography-title :heading="5"
        style="margin-top: 0;">{{subTitle}}</a-typography-title>
      <a-form :model="config">
        <a-form-item v-for="item of mConfig"
          :key="item.key"
          :field="item.key"
          :label="item.label"
          :help="item.tip"
          :label-col-props="{span: 6, offset: 0}"
          :wrapper-col-props="{span: 18, offset: 0}"
          v-bind="item.formItemProps">
          <config-item v-model="config[item.key]"
            :type="item.type"
            @change="handleConfigChange(item.key,$event)"></config-item>
        </a-form-item>
      </a-form>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getAppConfig, setAppConfigOption } from '/@/utils/electron'
import AppControls from '/@/components/AppControls.vue'
import ConfigItem from './components/ConfigItem.vue'

interface SettingTab {
  key: string
  title: string
  options: {
    type: string
    key?: string
    label?: string
    tip?: string
    value?: boolean | string | number
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
      }
    ]
  },
  {
    key: 'theme',
    title: '主题',
    options: [{ type: 'theme' }]
  },
  { key: 'proxy', title: '代理', options: [{ type: 'proxy' }] },
  { key: 'debugger', title: '调试', options: [{ type: 'debugger' }] }
]

export default defineComponent({
  name: 'AppSetting',

  components: { AppControls, ConfigItem },

  data() {
    return { tabs, tabKey: 'regular', config: {} as Record<string, any> }
  },

  computed: {
    subTitle(): string {
      const config = tabs.find(tab => tab.key === this.tabKey)
      if (config) {
        return config.title
      }
      return ''
    },

    mConfig(): Record<string, any>[] {
      const config = tabs.find(tab => tab.key === this.tabKey)
      const options = config ? config.options || [] : []
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
    getConfig() {
      getAppConfig().then(config => {
        console.log(config)
        this.config = config
      })
    },

    setOption(key: string, value: any) {
      if (typeof value === 'boolean') {
        setAppConfigOption({ [key]: value }).then(this.getConfig)
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
        content: '';
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
    height: 24px;
    width: 100%;
    z-index: 100;

    .app-controls {
      position: absolute;
      right: 0;
      top: 0;
    }
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
