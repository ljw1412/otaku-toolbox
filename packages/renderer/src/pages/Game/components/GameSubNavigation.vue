<template>
  <div class="game-sub-navigation page-container" :class="{ 'is-more': isDisplayMore }">
    <div class="navigation-list">
      <div
        v-for="item of baseNavigations"
        :key="item.name"
        class="navigation-item"
        :class="{ active: getActiveItem(item) }"
        @click="navigate(item)"
      >
        <span>{{ item.name }}</span>
      </div>
    </div>
    <a-divider direction="vertical" />
    <div v-show="!isDisplayMore" class="navigation-list web-navigation">
      <div
        v-for="item of webNavigations"
        :key="item.name"
        class="navigation-item"
        :class="{ active: getActiveItem(item) }"
        @click="navigate(item)"
      >
        <span>{{ item.name }}</span>
      </div>
    </div>

    <div class="navigation-placeholder flex-grow-1"></div>

    <div v-show="isDisplayMore" class="navigation-btn btn-setting mr-8" @click="openOriginManager">
      <icon-settings />
    </div>
    <div class="navigation-btn btn-more" @click="isDisplayMore = !isDisplayMore">
      <component :is="isDisplayMore ? 'icon-caret-up' : 'icon-caret-down'"></component>
    </div>

    <transition>
      <div v-show="isDisplayMore" class="more-panel">
        <a-result v-if="!webNavigations.length" title="您还未添加游戏资源的源" subtitle="请先前往源管理进行添加">
          <template #extra>
            <a-button type="primary" @click="openOriginManager">前往源管理</a-button>
          </template>
        </a-result>
        <div class="navigation-list web-navigation">
          <div
            v-for="item of webNavigations"
            :key="item.name"
            class="navigation-item"
            :class="{ active: getActiveItem(item) }"
            @click="navigate(item)"
          >
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </transition>
    <div v-show="isDisplayMore" class="mask" @click="isDisplayMore = false"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { setNavigationCache } from '/@/utils/cache'


export default defineComponent({
  name: 'GameSubNavigation',

  data() {
    return {
      isDisplayMore: false,
      baseNavigations: [{ name: '资讯', to: { name: 'GameHome' } }] as PageNavigationItem[],
      webNavigations: [] as PageNavigationItem[]
    }
  },

  activated() {
    this.fecthGameRuleList()
  },

  methods: {
    async fecthGameRuleList() {
      const list: RuleManagerItem[] = await this.$API.DataCenter.listRules('game-resource')
      this.webNavigations = list.map(item => {
        return {
          name: item.name,
          to: { name: 'GameList', params: { namespace: item.namespace }, query: { title: item.name } }
        }
      })
    },

    getActiveItem(item: PageNavigationItem) {
      if (item.url || !item.to || !item.to.name) return false
      if (item.to.name === 'GameList') {
        return this.$route.name === item.to.name && this.$route.params.namespace === item.to.params.namespace
      }
      return this.$route.name === item.to.name
    },

    navigate(item: PageNavigationItem) {
      if (!item.to || !item.to.name) return
      if (item.url) {
        window.open(item.url, '_blank')
        return
      }
      this.$router.push(item.to)
      setNavigationCache('game', item.to)
    },

    openOriginManager() {
      this.$API.Electron.win.openVue(
        { name: 'OriginManager', query: { type: 'game-resource' } },
        { resizable: false, singleInstance: true, title: '源管理' }
      )
    }
  }
})
</script>

<style lang="scss">
.game-sub-navigation {
  position: relative;
  height: var(--app-sub-navigation-height);
  display: flex;
  align-items: center;

  .navigation-list {
    display: flex;
    flex-shrink: 0;
  }

  &.is-more {
    .navigation-list {
      position: relative;
      z-index: 102;
    }
  }

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

  .web-navigation {
    flex-grow: 1;
    .navigation-item {
      border-radius: 24px;
    }
  }

  .navigation-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    cursor: pointer;
    z-index: 110;
    background-color: var(--color-fill-2);

    &:hover {
      background-color: var(--color-fill-4);
    }
  }

  .more-panel {
    position: absolute;
    top: var(--app-sub-navigation-height);
    left: 0;
    width: 100%;
    max-height: 280px;
    padding: 8px 0;
    z-index: 105;
    background-color: var(--color-bg-3);
    border-top: 1px solid var(--color-border);
  }

  .mask {
    position: fixed;
    top: var(--app-header-height);
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 101;
    background-color: var(--color-mask-bg);
  }
}
</style>
