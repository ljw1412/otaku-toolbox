<template>
  <div class="app-container container-main">
    <app-header></app-header>
    <main
      id="app-main"
      class="app-main"
      :data-module="$route.meta.module || 'other'"
      :class="{ 'hide-helper': $route.meta.hideHelper }"
    >
      <router-view v-slot="{ Component, route }" name="helper">
        <keep-alive>
          <component :is="Component" :key="route.meta.module + 'helper'" />
        </keep-alive>
      </router-view>
      <div :id="moduleMain" v-watch-scroll="$route.name" class="app-main-body" :class="moduleMain">
        <router-view v-slot="{ Component, route }">
          <keep-alive exclude="AppPageError">
            <component
              :is="Component"
              :key="getComponentKey(route)"
              :class="{ 'page-container': route.meta.pageContainer }"
            />
          </keep-alive>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from './components/AppHeader.vue'

export default defineComponent({
  name: 'AppMainContainer',
  components: {
    AppHeader
  },
  computed: {
    moduleMain() {
      const module = this.$route.meta.module || 'other'
      return `${module}-main`
    }
  },
  methods: {
    getComponentKey(route: any) {
      if (route) {
        if (route.name === 'ComicOrigin') {
          return `${route.name}[${route.params.namespace}]`
        }
        return route.name
      }
    }
  }
})
</script>

<style lang="scss">
.container-main {
  .app-main {
    box-sizing: border-box;
    height: calc(100% - var(--app-header-height));
    overflow: hidden;

    &[data-module="home"] {
      .app-main-body {
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
      }
    }

    &[data-module="anime"],
    &[data-module="game"] {
      .app-main-body {
        box-sizing: border-box;
        height: calc(100% - var(--app-sub-navigation-height));
        padding-left: var(--scroll-bar-width);
        overflow-y: scroll;
        overflow-x: hidden;
      }

      &.hide-helper {
        .app-main-body {
          height: 100%;
        }
      }
    }

    &[data-module="comic"] {
      box-sizing: border-box;
      position: relative;
      // height: 100%;
      // overflow: hidden;
      padding: 16px 0 16px 16px;

      .comic-main {
        height: 100%;
        margin-left: 200px;
        padding-left: var(--scroll-bar-width);
        overflow-y: scroll;
        overflow-x: hidden;

        .comic-header {
          position: sticky;
          top: 0;
          background-color: var(--app-color-bg);
          padding-top: 0;
          z-index: 100;
          padding-right: 8px;
        }
      }
    }
  }
}

body .arco-message-list-top {
  top: 70px;
}
</style>
