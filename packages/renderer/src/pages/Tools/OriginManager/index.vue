<template>
  <a-layout class="origin-manager">
    <a-layout-sider class="user-select-none app-drag" style="z-index: 100;">
      <a-typography-title style="padding-left: 16px">源管理</a-typography-title>
      <a-menu
        v-model:selected-keys="menuKeys"
        class="app-no-drag"
        @menu-item-click="handleMenuChange"
      >
        <a-menu-item v-for="item of menuList" :key="item.type">
          <template #icon>
            <component :is="item.icon"></component>
          </template>
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout-content>
      <a-page-header class="app-drag pl-12 pb-2" :title="typeTitle" :show-back="false"></a-page-header>

      <origin-list
        v-if="!menuComponent"
        class="mt-8"
        :allow-create="listAllowCreate"
        :type="listType"
      ></origin-list>
      <component :is="menuComponent" v-else></component>
    </a-layout-content>

    <app-close-btn fixed="tr"></app-close-btn>
  </a-layout>
</template>

<script lang="ts">
import { Component, defineComponent, markRaw } from 'vue'
import OriginList from './components/OriginList.vue'
import OcrLangList from './components/OcrLangList.vue'

interface OriginMenuItem {
  name: string
  icon: string
  type: string
  allowCreate: boolean
  typeList?: { label: string; value: string }[]
  component?: Component
}

export default defineComponent({
  name: 'OriginManager',

  components: { OriginList },

  data() {
    return {
      menuKeys: ['news'],
      menuList: [
        {
          name: '资讯',
          icon: 'icon-nav',
          type: 'news',
          typeList: [
            { label: '动画', value: 'anime-news' },
            { label: '漫画', value: 'comic-news' },
            { label: '游戏', value: 'game-news' }
          ],
          allowCreate: true
        },
        {
          name: '漫画',
          icon: 'icon-book',
          type: 'comic-book',
          allowCreate: false
        }, {
          name: 'OCR语言模型',
          icon: 'icon-language',
          type: 'ocr-lang',
          component: markRaw(OcrLangList)
        }
      ] as OriginMenuItem[]
    }
  },

  computed: {
    currentMenu(): OriginMenuItem | undefined {
      return this.menuList.find(item => item.type === this.menuKeys[0])
    },

    typeTitle(): string {
      return (this.currentMenu ? this.currentMenu.name : '') + '源'
    },

    menuComponent(): Component | undefined {
      if (!this.currentMenu) return
      return this.currentMenu.component
    },

    listType(): string | { label: string; value: string }[] {
      if (!this.currentMenu) return ''
      if (this.currentMenu.typeList) return this.currentMenu.typeList
      return this.currentMenu.type
    },

    listAllowCreate(): boolean {
      if (!this.currentMenu) return false
      return this.currentMenu.allowCreate
    }
  },

  created() {
    const { type = 'news' } = this.$route.query
    this.menuKeys = [type as string]
  },

  methods: {
    handleMenuChange(type: string) {
      this.$router.replace({ query: { type } })
    }
  }
})
</script>

<style lang="scss">
.origin-manager {
  position: relative;
  height: 100%;

  .arco-tabs-nav {
    display: none;
  }

  .arco-tabs {
    height: calc(100% - 48px);
  }
  .arco-tabs-content,
  .arco-tabs-content-list,
  .arco-tabs-pane {
    height: 100%;
  }
  .arco-tabs-pane {
    overflow: auto;
  }
}
</style>
