<template>
  <div class="app-container container-separate">
    <app-mini-header>
      <template #title>
        <app-favicon :icon="icon" :size="16" class="mr-4" />
        <span class="title">{{ mTitle }}</span>
      </template>
    </app-mini-header>
    <main id="app-main" class="app-main">
      <router-view />
    </main>
    <acg-back-top v-if="!hideBackUp" target="#app-main"></acg-back-top>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ipcOff, ipcOn } from '../utils/electron'
import AppMiniHeader from './components/AppMiniHeader.vue'

export default defineComponent({
  name: 'AppSeparateContainer',
  components: {
    AppMiniHeader
  },
  data() {
    return {
      title: '',
      favicon: '',
      titleObserver: null as null | MutationObserver
    }
  },
  computed: {
    hideBackUp() {
      return this.$route.meta.hideBackUp
    },
    icon(): string {
      const icon = (this.$route.query.icon || '') as string
      return icon.startsWith('icon-') ? icon : this.favicon
    },
    mTitle(): string {
      return (
        this.$global.title.value ||
        (this.$route.meta.title as string) ||
        this.title ||
        ''
      )
    }
  },
  created() {
    this.addPageUpdateListener()
  },
  beforeUnmount() {
    this.removePageUpdateListener()
  },
  methods: {
    pageUpdateListener(event: Event, type: string, data: Record<string, any>) {
      console.log(type, data)
      if (type === 'favicon') {
        const { favicons = [] } = data
        this.favicon = favicons[0] || ''
      } else if (type === 'title') {
        this.title = data.title || ''
      }
    },

    addPageUpdateListener() {
      if (!this.$route.meta.hasView) return
      console.log('ipcOn')

      ipcOn('window-page-updated', this.pageUpdateListener)
    },

    removePageUpdateListener() {
      if (!this.$route.meta.hasView) return
      ipcOff('window-page-updated', this.pageUpdateListener)
    }
  }
})
</script>

<style lang="scss">
.container-separate {
  .app-main {
    box-sizing: border-box;
    position: relative;
    height: calc(100% - var(--app-header-mini-height));
    overflow: auto;
  }
}
</style>
