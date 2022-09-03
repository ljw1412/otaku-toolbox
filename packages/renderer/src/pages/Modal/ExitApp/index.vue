<template>
  <div class="modal-exit-app app-drag user-select-none">
    <a-typography-title class="title" :heading="5">退出请示</a-typography-title>
    <a-typography-paragraph class="content">前辈，你真的要走了吗？/(ㄒoㄒ)/~~</a-typography-paragraph>
    <a-space class="buttons app-no-drag">
      <a-button type="primary" status="danger" @click="ok">拜拜</a-button>
      <a-button @click="cancel">就一会哦</a-button>
    </a-space>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppExitModal',
  methods: {
    ok() {
      this.$API.Electron.win.control('close', 'main-close')
    },

    cancel() {
      this.$API.Electron.win.control('hide')
    }
  }
})
</script>

<style lang="scss">
.modal-exit-app {
  position: relative;
  height: 100%;
  padding: 1px 12px 20px 12px;
  box-sizing: border-box;
  background-color: var(--color-bg-4);

  .buttons {
    position: absolute;
    right: 12px;
    bottom: 15px;
  }
}
</style>
