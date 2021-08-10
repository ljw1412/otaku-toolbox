<template>
  <header class="app-title-bar app-drag">
    <div class="title-bar-left">
      <span>二次元工具箱</span>
      <span v-if="finalTitle">- {{ finalTitle }}</span>
    </div>
    <div class="title-bar-right app-no-drag h-100 fs-28 d-flex align-items-center">
      <div class="app-controll-btn btn-min">
        <acg-icon name="remove"
          @click="minWindow"></acg-icon>
      </div>
      <div class="app-controll-btn btn-close">
        <acg-icon name="close"
          @click="closeWindow"></acg-icon>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ipcSend } from '/@/utils/electron'

export default defineComponent({
  name: 'AppTitleBar',
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
      ipcSend('window.action', 'min')
    },
    closeWindow() {
      ipcSend('window.action', 'close')
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
  box-sizing: border-box;
  height: var(--title-bar-height);
  max-height: var(--title-bar-height);
  min-height: var(--title-bar-height);
  color: var(--title-text-color);
  background-color: var(--title-bar-color);
  border-bottom: 1px solid var(--border-color);

  display: flex;
  justify-content: space-between;
  align-items: center;

  .title-bar-left {
    margin-left: 16px;
  }

  .title-bar-right {
  }

  .app-controll-btn {
    width: 50px;
    height: 100%;
    line-height: 50px;
    text-align: center;
    &:hover {
      background-color: rgba(255, 255, 255, 0.25);
    }
    &.btn-close:hover {
      background-color: rgba(223, 0, 0, 0.95);
    }
  }
}
</style>
