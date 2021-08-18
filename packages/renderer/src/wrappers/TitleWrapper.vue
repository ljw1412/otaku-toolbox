
<template>
  <div class="app-container">
    <div class="app-body">
      <title-bar mini
        mode="view"
        :title="title"></title-bar>
      <main id="app-main"
        class="app-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TitleBar from '../components/TitleBar.vue'

export default defineComponent({
  name: 'TitleApp',
  components: {
    TitleBar
  },
  data() {
    return {
      title: '',
      titleObserver: null as null | MutationObserver
    }
  },
  created() {
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
  height: 100%;
  user-select: text;
  overflow-y: auto;
}
</style>