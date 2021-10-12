<template>
  <div class="comic-navigation">
    <header>
      <div v-tooltip-parent
        class="comic-menu">
        <div v-for="item of menu"
          :key="item.name"
          v-tooltip.arrow.bottom="item.name"
          class="menu-item"
          :class="{ active: $route.name === item.component }"
          @click="navigate(item.component)">
          <acg-icon :name="item.icon"></acg-icon>
        </div>
      </div>
      <div class="origin-search">
        <acg-input v-model="text"
          clearable
          prefix-icon="search-outline"
          placeholder="搜索源"></acg-input>
        <button v-tooltip="{content:'设置',placement:'right',offset:[0,10]}"
          class="btn-setting"
          :class="{ active: $route.name === 'ComicSetting' }"
          @click="navigate('ComicSetting')">
          <acg-icon name="settings"></acg-icon>
        </button>
      </div>
    </header>
    <main>
      <div class="comic-origin-list">
        <div v-for="(item,i) of list"
          :key="i"
          class="comic-origin-item"
          :class="{ active: getOriginActive(item.id) }"
          @click="navigate('ComicOrigin',{ id: item.id })">
          <div class="icon">
            <img :src="item.icon">
          </div>
          <div class="title">{{ item.title }}</div>
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
import { setNavigationCache } from '/@/utils/cache'

export default defineComponent({
  name: 'ComicNavigation',
  data() {
    return {
      text: '',
      menu: [
        {
          name: '首页',
          icon: 'navigate-circle-outline',
          component: 'ComicHome'
        },
        {
          name: '收藏',
          icon: 'heart-circle-outline',
          component: 'ComicFavourite'
        },
        {
          name: '历史',
          icon: 'time-outline',
          component: 'ComicHistory'
        },
        {
          name: '搜索',
          icon: 'search-circle-outline',
          component: 'ComicSearch'
        }
      ],
      list: [
        {
          id: '1',
          icon: 'https://www.bilibili.com/favicon.ico',
          title: '测试'
        },
        {
          id: '2',
          icon: 'https://cdn.aixifan.com/ico/favicon.ico',
          title: '测试2'
        }
      ]
    }
  },

  computed: {
    originCount(): number {
      return this.list.length
    }
  },

  methods: {
    setCache(route: { name: string; params?: Record<string, any> }) {
      const module = this.$route.meta.module as string
      if (module && route) {
        setNavigationCache(module, route)
      }
    },

    navigate(name: string, params?: Record<string, any>) {
      const route = { name, params }
      this.$router.replace(route)
      this.setCache(route)
    },

    getOriginActive(id: string) {
      return this.$route.params.id === id
    }
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
    .comic-menu {
      display: grid;
      grid-template-columns: repeat(4, auto);
      height: 46px;
      border-bottom: 1px solid var(--border-color);
      .menu-item {
        cursor: pointer;
        display: grid;
        align-items: center;
        justify-items: center;
        width: 100%;
        height: 100%;
        font-size: 24px;
        transition: transform 0.15s;
        &:active {
          transform: scale(0.9);
        }

        &.active {
          color: var(--comic-navigation-search-color);
        }
      }
    }

    .origin-search {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 12px 8px;
    }

    .acg-input {
      width: 140px;

      &__inner {
        background-color: transparent;
        border: 1px solid var(--border-color);
        border-radius: 50px;
        font-size: 12px;
        transition: border-color 0.3s;

        &:focus {
          border-color: var(--comic-navigation-search-color);
        }
      }

      &__prefix {
        transition: color 0.3s;
      }

      &__suffix {
        right: 10px;
      }

      &.is-focused {
        .acg-input__prefix {
          color: var(--comic-navigation-search-color);
        }
      }
    }

    .btn-setting {
      cursor: pointer;
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      margin-left: 6px;
      border: 1px solid var(--border-color);
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
      color: var(--text-color);

      &:hover {
        color: var(--comic-navigation-search-color);
        border-color: currentColor;
      }

      &.active {
        color: var(--comic-navigation-search-color);
        border-color: currentColor;
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
      grid-template-columns: 42px auto;
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
        background-color: rgba(var(--bg-hover-rgb), 0.2);
      }

      &:hover {
        background-color: rgba(var(--bg-hover-rgb), 0.1);
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
