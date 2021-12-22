<template>
  <div class="app-container container-separate">
    <app-mini-header :title="title"></app-mini-header>
    <main id="app-main"
      class="app-main">
      <router-view />
    </main>
    <acg-back-top v-if="!hideBackUp"
      target="#app-main"></acg-back-top>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppMiniHeader from './components/AppMiniHeader.vue'

export default defineComponent({
  name: 'AppSeparateContainer',
  components: {
    AppMiniHeader
  },
  data() {
    return {
      title: '',
      titleObserver: null as null | MutationObserver
    }
  },
  computed: {
    hideBackUp() {
      return this.$route.meta.hideBackUp
    }
  },
  created() {
    this.title =
      this.$global.title.value || (this.$route.meta.title as string) || ''
    this.pageTitleHandler()
  },
  beforeUnmount() {
    if (this.titleObserver) {
      this.titleObserver.disconnect()
      this.titleObserver = null
    }
  },
  methods: {
    pageTitleHandler() {
      if (!this.$route.meta.hasView) return
      const node = document.querySelector('title')
      if (!node) return

      console.log(node)

      this.titleObserver = new MutationObserver(mutationsList => {
        this.title = (mutationsList[0].target as HTMLElement).innerHTML
        console.log(mutationsList)
      })

      this.titleObserver.observe(node, { childList: true })
    }
  }
})
</script>

<style lang="scss">
.container-separate {
  .app-main {
    position: relative;
    height: calc(100% - var(--app-header-mini-height));
    overflow: auto;
  }
}
</style>
