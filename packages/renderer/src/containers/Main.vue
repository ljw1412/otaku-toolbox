<template>
  <div class="app-container container-main">
    <app-header></app-header>
    <main id="app-main"
      class="app-main">
      <div :class="`app-${$route.meta.module || 'other'}`">
        <router-view v-slot="{ Component,route }"
          name="helper">
          <keep-alive>
            <component :is="Component"
              :key="route.meta.module+'helper'" />
          </keep-alive>
        </router-view>
        <div :id="moduleMain"
          v-watch-scroll="$route.name"
          :class="moduleMain">
          <router-view v-slot="{ Component, route }">
            <keep-alive exclude="AppPageError">
              <component :is="Component"
                :key="route.name"
                :class="{'page-container': route.meta.pageContainer}" />
            </keep-alive>
          </router-view>
        </div>
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
  }
})
</script>

<style lang="scss">
.container-main {
  .app-main {
    height: calc(100% - var(--app-header-height));
    overflow: hidden;
  }
}

.app-anime {
  height: 100%;
  overflow: hidden;

  .anime-main {
    box-sizing: border-box;
    height: calc(100% - var(--app-sub-navigation-height));
    padding-left: var(--scroll-bar-width);
    overflow-y: scroll;
    overflow-x: hidden;
  }
}

.app-comic {
  box-sizing: border-box;
  position: relative;
  height: 100%;
  overflow: hidden;
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
    }
  }
}
</style>
