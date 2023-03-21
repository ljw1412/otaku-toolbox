<template>
  <div class="app-sub-navigation">
    <div class="navigation page-container">
      <div class="navigation-list">
        <div
          v-for="item of navigations"
          :key="item.name"
          class="navigation-item"
          :class="{ active: getActiveItem(item) }"
          @click="navigate(item)"
        >
          <span>{{ item.name }}</span>
          <acg-icon v-if="item.url" name="open-outline" class="ml-4"></acg-icon>
        </div>
      </div>
      <div v-if="!$slots.right" class="navigation-right">
        <slot name="right">
          <div class="navigation-helper">
            <div
              v-for="item of rightLinks"
              :key="item.name"
              class="helper-item"
            >
              <span @click="open(item)">{{ item.name }}</span>
            </div>
          </div>
          <a-input-search
            v-if="hasSearch"
            v-model="text"
            style="width: 200px"
            size="small"
            allow-clear
            @press-enter="$emit('search', text)"
            @search="$emit('search', text)"
          ></a-input-search>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { setNavigationCache } from '../utils/cache'

export default defineComponent({
  name: 'AppSubNavigation',

  props: {
    hasSearch: Boolean,
    navigations: {
      type: Array as PropType<PageNavigationItem[]>,
      default: () => []
    },
    rightLinks: {
      type: Array as PropType<PageNavigationItem[]>,
      default: () => []
    }
  },

  emits: ['search'],

  data() {
    return {
      text: ''
    }
  },
  methods: {
    setCache(item: PageNavigationItem) {
      const module = this.$route.meta.module as string
      if (module && item.to && item.to.name) {
        setNavigationCache(module, item.to)
      }
    },

    navigate(item: PageNavigationItem) {
      if (item.url) {
        window.open(item.url, '_blank')
        return
      }
      this.$router.push(item.to)
      this.setCache(item)
    },

    open(item: PageNavigationItem) {
      if (item.url) {
        window.open(item.url, '_blank')
        return
      } else if (item.to && item.to.name) {
        this.$API.Electron.win.openVue(item.to, {
          title: item.name,
          width: 1280,
          height: 720,
          minWidth: 1280,
          minHeight: 720
        })
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
          background-color: var(--color-fill-2);
        }

        &.active {
          background-color: var(--color-fill-4);
          font-weight: bold;
          color: var(--color-text-0);
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
