<template>
  <div class="app-sub-navigation">
    <div class="navigation page-container">
      <div class="navigation-list">
        <div v-for="item of navigations"
          :key="item.name"
          class="navigation-item"
          :class="{active: getActiveItem(item)}"
          @click="navigate(item)">
          <span>{{ item.name }}</span>
          <acg-icon v-if="item.url"
            name="open-outline"
            class="ml-4"></acg-icon>
        </div>
      </div>
      <div v-if="!$slots.right"
        class="navigation-right">
        <slot name="right">
          <div class="navigation-helper">
            <div v-for="item of rightLinks"
              :key="item.name"
              class="helper-item">
              <span @click="open(item)">{{ item.name }}</span>
            </div>
          </div>
          <div class="navigation-search">
            <input v-model="text"
              placeholder="" />
            <acg-icon v-show="text"
              class="search-btn icon-clear"
              name="close"
              @click="text = ''"></acg-icon>
            <acg-icon class="search-btn icon-search"
              name="search"></acg-icon>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { getPageUrl } from '/@/utils/helper'
import { createBrowser } from '/@/utils/electron'

export default defineComponent({
  name: 'AppSubNavigation',
  props: {
    navigations: {
      type: Array as PropType<PageNavigationItem[]>,
      default: () => []
    },
    rightLinks: {
      type: Array as PropType<PageNavigationItem[]>,
      default: () => []
    }
  },
  data() {
    return {
      text: ''
    }
  },
  methods: {
    navigate(item: PageNavigationItem) {
      if (item.url) {
        window.open(item.url, '_blank')
        return
      }
      this.$router.push(item.to)
    },

    open(item: PageNavigationItem) {
      if (item.url) {
        window.open(item.url, '_blank')
        return
      } else if (item.to && item.to.name) {
        try {
          const route = this.$router.resolve(item.to)
          createBrowser({
            title: item.name,
            url: getPageUrl(route.href),
            width: 1280,
            height: 720,
            minWidth: 1280,
            minHeight: 720
          })
        } catch (error) {
          console.error(error)
        }
      }
    },

    getActiveItem(item: PageNavigationItem) {
      if (item.url) {
        return false
      }
      return this.$route.name === item.to.name
    }
  }
})
</script>

<style lang="scss">
.app-sub-navigation {
  height: var(--app-sub-navigation-height);

  .navigation {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .navigation-list {
      display: flex;

      .navigation-item {
        flex-shrink: 0;
        box-sizing: border-box;
        line-height: 16px;
        cursor: pointer;
        font-size: 15px;
        padding: 7px 16px;
        font-weight: bold;
        border-radius: 4px;
        transition: font-weight 0.3s;

        &:not(:first-child) {
          margin-left: 4px;
        }

        &:hover {
          background-color: rgba(var(--bg-hover-rgb), 0.1);
        }

        &.active {
          background-color: rgba(var(--bg-hover-rgb), 0.2);
          color: var(--text-active-color);
        }
      }
    }
  }

  .navigation-right {
    position: relative;
    display: flex;
    align-items: center;

    .navigation-helper {
      display: flex;
      font-size: 14px;
      margin-right: 20px;

      .helper-item {
        flex-shrink: 0;
        > span {
          cursor: pointer;
          font-weight: bold;
          opacity: 0.5;
          transition: opacity 0.3s;

          &:hover {
            opacity: 1;
          }
        }

        &:not(:first-child)::before {
          content: '|';
          padding: 10px;
          opacity: 0.5;
        }
      }
    }

    .navigation-search {
      flex-shrink: 0;
      width: 180px;
      height: 30px;
      input {
        border-radius: 4px;
        border: none;
        outline: none;
        appearance: none;
        background-color: rgba(var(--bg-hover-rgb), 0.1);
        width: 100%;
        height: 100%;
        padding-left: 10px;
        padding-right: 60px;
        box-sizing: border-box;
        color: var(--text-color);
      }

      .search-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
      }

      .icon-search {
        right: 6px;
      }

      .icon-clear {
        right: 24px;
        opacity: 0.6;
        &:hover {
          opacity: 1;
        }
      }
    }
  }
}
</style>
