<template>
  <div class="origin-manager">
    <header class="app-drag">
      <h3>源管理</h3>
    </header>
    <app-close-btn fixed="tr"></app-close-btn>
    <div class="content">
      <a-tabs type="text"
        lazy-load>
        <a-tab-pane key="news"
          title="资讯">
          <origin-news></origin-news>
        </a-tab-pane>
        <a-tab-pane key="comic"
          title="漫画">
          <origin-comic></origin-comic>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OriginNews from './components/OriginNews.vue'
import OriginComic from './components/OriginComic.vue'

export default defineComponent({
  name: 'OriginManager',

  components: { OriginNews, OriginComic }
})
</script>

<style lang="scss">
.origin-manager {
  position: relative;
  height: 100%;
  > header {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 48px;
    line-height: 48px;
    padding-left: 12px;
    padding-right: 48px;
    box-sizing: border-box;
    user-select: none;
  }

  .content {
    height: 100%;
    padding: 8px 8px 0;
    box-sizing: border-box;
    .arco-tabs-nav {
      padding-left: 90px;
      .arco-tabs-nav-tab-list {
        -webkit-app-region: no-drag;
      }
    }
  }
}
</style>
