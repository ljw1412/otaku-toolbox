<template>
  <div class="app-home">
    <button @click="onClick">
      内置浏览器
    </button>
    <button @click="onClick2">
      设置
    </button>
    <button @click="setTheme()">默认主题</button>
    <button @click="setTheme('dark')">黑暗主题</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { createBrowser, createBuiltInBrowser } from '/@/utils/electron'
import { getPageUrl } from '/@/utils/helper'

export default defineComponent({
  name: 'AppHome',
  methods: {
    setTheme(name?: string) {
      window.$theme.set(name)
    },
    onClick() {
      createBuiltInBrowser('https://www.bilibili.com')
    },
    onClick2() {
      try {
        const route = this.$router.resolve({
          name: 'AppSetting'
        })
        createBrowser({
          url: getPageUrl(route.href),
          width: 800,
          height: 600,
          resizable: false,
          minimizable: false,
          maximizable: false,
          singleInstance: true,
          title: '系统设置'
        })
      } catch (error) {
        console.error(error)
      }
    }
  }
})
</script>

<style lang="scss">
</style>
