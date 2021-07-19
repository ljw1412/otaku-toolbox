<template>
  <header class="app-title-bar">
    <div class="title-bar-left">
      <span>二次元工具箱</span>
      <span v-if="finalTitle">- {{ finalTitle }}</span>
    </div>
    <div class="title-bar-right mr-8 fs-24 app-no-drag d-flex align-items-center">
      <skin-pop inner-class="mr-6 fs-20 cursor-pointer"></skin-pop>
      <acg-icon name="remove"
        @click="minWindow"></acg-icon>
      <acg-icon name="close"
        @click="closeWindow"></acg-icon>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SkinPop from './SkinPop.vue'
const { ipcRenderer } = window.electron

export default defineComponent({
  name: 'AppTitleBar',
  components: { SkinPop },
  props: { title: { type: String, default: '' } },
  computed: {
    metaTitle(): string {
      return this.$route.meta.title as string
    },
    finalTitle(): string {
      return this.title || this.metaTitle
    }
  },
  methods: {
    minWindow() {
      ipcRenderer.send('window.action', 'min')
    },
    closeWindow() {
      ipcRenderer.send('window.action', 'close')
    }
  }
})
</script>

<style lang="scss">
.app-title-bar {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: var(--title-bar-height);
  max-height: var(--title-bar-height);
  min-height: var(--title-bar-height);
  color: var(--title-text-color);
  background-color: var(--title-bar-color);
  -webkit-app-region: drag;

  display: flex;
  justify-content: space-between;
  align-items: center;

  .title-bar-left {
    margin-left: 16px;
  }

  .title-bar-right {
    -webkit-app-region: no-drag;
  }
}
</style>
