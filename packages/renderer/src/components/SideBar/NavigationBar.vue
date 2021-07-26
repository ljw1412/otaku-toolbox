<template>
  <div class="app-navigation-bar app-no-drag mt-30">
    <ul class="px-8 fs-15">
      <li v-for="item of list"
        :key="item.name"
        class="d-flex justify-content-center align-items-center py-6 mb-4"
        :class="{active:item.pageName === $route.name}"
        @click="navigate(item.to)">
        <acg-icon :name="item.icon"
          size="18" />
        <span class="ml-8">{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export default defineComponent({
  name: 'AppNavigationBar',

  data() {
    return {
      list: [
        {
          name: '首页',
          icon: 'home',
          to: { name: 'AppHome' },
          pageName: 'AppHome'
        },
        {
          name: '动画',
          icon: 'film',
          to: { name: 'AppAnimeHome' },
          pageName: 'AppAnimeHome'
        },
        { name: '漫画', icon: 'book', to: { name: '' }, pageName: '' },
        {
          name: '游戏',
          icon: 'game-controller',
          to: { name: '' },
          pageName: ''
        }
      ]
    }
  },

  methods: {
    navigate(to: RouteLocationRaw) {
      this.$router.push(to)
    }
  }
})
</script>

<style lang="scss">
.app-navigation-bar {
  flex-shrink: 0;
  width: var(--navigation-bar-width);
  color: var(--side-bar-text-color);
  ul > li {
    cursor: pointer;
    border-radius: 4px;
    transition: color 0.15s;
    &:hover {
      color: var(--side-bar-active-text-color);
    }
    &.active {
      color: var(--side-bar-active-text-color);
      background-color: rgba(255, 255, 255, 0.25);
    }
  }
}
</style>
