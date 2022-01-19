<template>
  <a-layout class="origin-manager">
    <a-layout-sider class="user-select-none app-drag"
      style="z-index: 100;">
      <a-typography-title style="padding-left: 16px">源管理</a-typography-title>
      <a-menu v-model:selected-keys="menuKeys"
        class="app-no-drag"
        @menu-item-click="handleMenuChange">
        <a-menu-item v-for="item of menuList"
          :key="item.type">
          <template #icon>
            <component :is="item.icon"></component>
          </template>
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout-content>
      <a-page-header class="app-drag pl-12 pb-2"
        :title="typeTitle"
        :show-back="false"></a-page-header>

      <a-tabs :active-key="menuKeys[0]"
        type="text"
        lazy-load>
        <a-tab-pane v-for="item of menuList"
          :key="item.type"
          :title="item.name">
          <component :is="item.component"></component>
        </a-tab-pane>
      </a-tabs>
    </a-layout-content>

    <app-close-btn fixed="tr"></app-close-btn>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, markRaw } from 'vue'
import OriginNews from './components/OriginNews.vue'
import OriginComic from './components/OriginComic.vue'
import OriginSubtitle from './components/OriginSubtitle.vue'

export default defineComponent({
  name: 'OriginManager',

  components: { OriginNews, OriginComic, OriginSubtitle },

  data() {
    return {
      menuKeys: ['news'],
      menuList: [
        {
          name: '资讯',
          icon: 'icon-nav',
          type: 'news',
          component: markRaw(OriginNews)
        },
        {
          name: '漫画',
          icon: 'icon-book',
          type: 'comic',
          component: markRaw(OriginComic)
        },
        {
          name: '字幕',
          icon: 'icon-language',
          type: 'subtitle',
          component: markRaw(OriginSubtitle)
        }
      ]
    }
  },

  computed: {
    typeTitle(): string {
      const item = this.menuList.find(item => item.type === this.menuKeys[0])
      return (item ? item.name : '') + '源'
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
