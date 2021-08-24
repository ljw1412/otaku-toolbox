
<template>
  <div class="app-container">
    <side-bar></side-bar>
    <div class="app-body">
      <title-bar></title-bar>
      <main id="app-main"
        class="app-main">
        <router-view v-slot="{ Component, route }">
          <keep-alive>
            <component :is="Component"
              :key="route.name || undefined" />
          </keep-alive>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import getSubnav from '/@/configs/subnav'
import TitleBar from '../components/TitleBar.vue'
import SideBar from '../components/SideBar/SideBar.vue'

const config = reactive({ module: '', subnav: [] })

export default defineComponent({
  name: 'MainApp',
  components: {
    TitleBar,
    SideBar
  },
  provide() {
    return {
      golbalConfig: config
    }
  },
  beforeRouteUpdate(to) {
    this.updateConfigFromMeta(to.meta)
  },
  computed: {
    config() {
      return config
    }
  },
  created() {
    this.updateConfigFromMeta(this.$route.meta)
  },
  methods: {
    updateConfigFromMeta(meta: Record<string, any>) {
      const data = { module: meta.module, subnav: getSubnav(meta.module) }
      Object.assign(config, data)
    }
  }
})
</script>

<style>
.app-container {
  display: flex;
  height: 100%;
  user-select: none;
  overflow: hidden;
}

.app-body {
  position: relative;
  height: 100%;
  flex-grow: 1;
  padding-top: var(--title-bar-height);
  box-sizing: border-box;
}

.app-main {
  /* height: calc(100%- var(--title-bar-height)); */
  height: 100%;
  user-select: text;
  overflow-y: auto;
}
</style>