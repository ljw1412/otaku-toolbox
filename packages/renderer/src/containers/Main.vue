<template>
  <div class="app-container container-main">
    <app-header></app-header>
    <main id="app-main"
      class="app-main">
      <button @click="onClick">
        按钮
      </button>
      <button @click="onClick2">
        设置
      </button>
      <router-view v-slot="{ Component, route }">
        <keep-alive>
          <component :is="Component"
            :key="route.name || undefined" />
        </keep-alive>
      </router-view>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from './components/AppHeader.vue'
import { createBrowser, createBuiltInBrowser } from '/@/utils/electron'
import { getPageUrl } from '../utils/helper'

export default defineComponent({
  name: 'AppMainContainer',
  components: {
    AppHeader
  },

  methods: {
    onClick() {
      createBuiltInBrowser('https://www.bilibili.com')
    },
    onClick2() {
      try {
        const route = this.$router.resolve({ name: 'AppSetting' })
        createBrowser({
          url: getPageUrl(route.href),
          width: 800,
          height: 600,
          resizable: false,
          minimizable: false,
          maximizable: false
        })
      } catch (error) {
        console.error(error)
      }
    }
  }
})
</script>

<style lang="scss">
.container-main {
  .app-main {
    height: calc(100% - var(--app-header-height));
    overflow: auto;
  }
}
</style>
