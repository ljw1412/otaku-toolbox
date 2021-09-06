<template>
  <div class="app-navigation">
    <ul class="navigation app-no-drag">
      <li v-for="item of navigations"
        :key="item.value"
        class="navigation-item"
        :class="{ active: item.value === currentModule }"
        @click="navigate(item.to)">
        <div class="navigation-icon">
          <acg-icon :name="item.icon"></acg-icon>
        </div>
        <span>{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteLocationRaw } from 'vue-router'

export default defineComponent({
  name: 'AppNavigation',
  data() {
    return {
      navigations: [
        {
          name: '首页',
          value: 'home',
          icon: 'home',
          to: { name: 'AppHome' }
        },
        {
          name: '动画',
          value: 'anime',
          icon: 'film',
          to: { name: 'AppAnime' }
        },
        {
          name: '漫画',
          value: 'comic',
          icon: 'book',
          to: { name: 'AppComic' }
        },
        {
          name: '游戏',
          value: 'game',
          icon: 'game-controller',
          to: { name: 'AppGame' }
        }
      ]
    }
  },
  computed: {
    currentModule() {
      return this.$route.meta.module
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
.app-navigation {
  display: inline-block;
  height: 100%;
  .navigation {
    box-sizing: border-box;
    display: flex;
    height: 100%;
    padding: 4px;
    .navigation-item {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 2px;
      padding: 0 16px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;

      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }

      &.active {
        background-color: rgba(255, 255, 255, 0.3);
        .navigation-icon {
          font-size: 24px;
          color: rgb(235, 179, 91);
        }
      }
    }
    .navigation-icon {
      display: flex;
      font-size: 20px;
      width: 28px;
      height: 28px;
      transition: font-size 0.4s, color 0.4s;
      > .acg-icon {
        margin: auto;
      }
    }
  }
}
</style>
