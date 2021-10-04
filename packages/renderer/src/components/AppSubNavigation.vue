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
          <acg-input v-model="text"
            is-search
            clearable
            history-name="anime"></acg-input>
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
        cursor: pointer;
        flex-shrink: 0;
        box-sizing: border-box;
        height: 32px;
        line-height: 32px;
        font-size: 15px;
        padding: 0 16px;
        font-weight: 500;
        border-radius: 4px;
        transition: font-weight 0.3s;

        > span {
          height: 100%;
        }

        &:not(:first-child) {
          margin-left: 4px;
        }

        &:hover {
          background-color: rgba(var(--bg-hover-rgb), 0.1);
        }

        &.active {
          background-color: rgba(var(--bg-hover-rgb), 0.2);
          font-weight: bold;
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
          font-weight: 500;
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
  }
}
</style>
