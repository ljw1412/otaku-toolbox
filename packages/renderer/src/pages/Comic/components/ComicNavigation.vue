<template>
  <div class="comic-navigation">
    <header>
      <div v-tooltip-parent class="comic-menu">
        <div
          v-for="item of menu"
          :key="item.name"
          v-tooltip.arrow.bottom="item.name"
          class="menu-item"
          :class="{ active: $route.name === item.component }"
          @click="navigate({ name: item.component })"
        >
          <component :is="item.icon"></component>
        </div>
      </div>
      <div class="origin-search">
        <a-input-search v-model="text" allow-clear placeholder="搜索源"></a-input-search>
        <a-button
          v-tooltip="{ content: '设置', placement: 'right', offset: [0, 10] }"
          class="btn-setting"
          type="text"
          shape="circle"
          @click="openOriginManager"
        >
          <icon-settings />
        </a-button>
      </div>
    </header>
    <main>
      <div class="comic-origin-list">
        <div
          v-for="(item, i) of searchResultList"
          :key="i"
          class="comic-origin-item"
          :class="{ active: getOriginActive(item.namespace) }"
          @click="handleOriginClick(item)"
        >
          <div class="icon">
            <img :src="item.icon" />
          </div>
          <div class="title">{{ item.name }}</div>
        </div>
      </div>
    </main>
    <footer>
      <span>共{{ originCount }}个源</span>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteLocationRaw } from 'vue-router'
import { comicStore } from '/@/stores'
import { setNavigationCache } from '/@/utils/cache'

export default defineComponent({
  name: 'ComicNavigation',
  data() {
    return {
      text: '',
      menu: [
        {
          name: '资讯',
          icon: 'icon-nav',
          component: 'ComicHome'
        },
        {
          name: '收藏',
          icon: 'icon-star',
          component: 'ComicFavourite'
        },
        {
          name: '历史',
          icon: 'icon-history',
          component: 'ComicHistory'
        },
        {
          name: '搜索',
          icon: 'icon-search',
          component: 'ComicSearch'
        }
      ]
    }
  },

  computed: {
    list(): DataCenter.Rule[] {
      return comicStore.origins
    },

    originCount(): number {
      return this.list.length
    },

    searchResultList(): DataCenter.Rule[] {
      return this.list.filter(
        item => !this.text || item.name.includes(this.text)
      )
    }
  },

  created() {
    comicStore.updateOriginList()
  },

  methods: {
    setCache(route: RouteLocationRaw) {
      const module = this.$route.meta.module as string
      if (module && route) {
        setNavigationCache(module, route)
      }
    },

    navigate(route: RouteLocationRaw) {
      this.$router.replace(route)
      this.setCache(route)
    },

    openOriginManager() {
      this.$API.Electron.win.openVue(
        { name: 'OriginManager', query: { type: 'comic-book' } },
        { resizable: false, singleInstance: true, title: '源管理' }
      )
    },

    getOriginActive(namespace: string) {
      return this.$route.params.namespace === namespace
    },

    handleOriginClick(rule: DataCenter.Rule) {
      if (this.getOriginActive(rule.namespace)) return
      this.navigate({
        name: 'ComicOrigin',
        params: { namespace: rule.namespace }
      })
    }

    // async fetchOriginList() {
    //   const list = await this.$API.DataCenter.listRules('comic-book')
    //   this.list = list
    // }
  }
})
</script>

<style lang="scss">
.comic-navigation {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  border-radius: 6px;
  background-color: var(--comic-navigation-bg);

  * {
    box-sizing: border-box;
  }

  > header {
    color: var(--color-text-2);
    .comic-menu {
      display: grid;
      grid-template-columns: repeat(4, auto);
      height: 46px;
      border-bottom: 1px solid var(--color-border);
      .menu-item {
        cursor: pointer;
        display: grid;
        align-items: center;
        justify-items: center;
        width: 100%;
        height: 100%;
        font-size: 20px;
        transition: transform 0.15s;
        &:active {
          transform: scale(0.9);
        }

        &.active {
          color: var(--app-color-common);
        }
      }
    }

    .origin-search {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 12px 8px;
    }

    .arco-input-wrapper {
      width: 140px;

      &.arco-input-focus {
        border-color: var(--app-color-common);
      }
    }

    .btn-setting {
      flex-shrink: 0;
      width: 30px;
      height: 30px;
      margin-left: 6px;
      color: currentColor;
      font-size: 20px;

      &:hover {
        color: var(--app-color-common);
      }
    }
  }

  > main {
    height: calc(100% - 140px);

    .comic-origin-list {
      overflow-y: scroll;
      padding-left: var(--scroll-bar-width);
      height: calc(100% - 50px);
    }

    .comic-origin-item {
      cursor: pointer;
      height: 42px;
      border-radius: 4px;
      display: grid;
      grid-template-columns: 31px auto;
      grid-column-gap: 8px;
      align-items: center;
      transition: transform 0.15s, background-color 0.15s;

      .icon {
        display: inline-flex;
        justify-self: end;
        width: 20px;
        height: 20px;
        font-size: 20px;
      }

      .text {
        font-size: 14px;
      }

      &.active {
        color: var(--app-color-common);
        background-color: var(--color-fill-4);
      }

      &:hover {
        background-color: var(--color-fill-2);
      }

      &:active {
        transform: scale(0.9);
      }

      &:not(:last-child) {
        margin-bottom: 8px;
      }
    }
  }

  > footer {
    width: 100%;
    padding: 12px 8px;
    font-size: 14px;
    opacity: 0.75;
    text-align: center;
  }
}
</style>
