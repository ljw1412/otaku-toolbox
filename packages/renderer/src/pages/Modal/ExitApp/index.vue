<template>
  <div class="modal-exit-app app-drag user-select-none">
    <div class="title">退出请示</div>
    <div class="content">前辈，你真的要走了吗？/(ㄒoㄒ)/~~</div>
    <div class="buttons app-no-drag">
      <button class="ok"
        @click="ok">确认</button>
      <button class="cancel"
        @click="cancel">取消</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ipcSend } from '/@/utils/electron'

export default defineComponent({
  name: 'ModalExitApp',
  methods: {
    ok() {
      ipcSend('window.action', 'close', { mode: 'main-close' })
    },

    cancel() {
      ipcSend('window.action', 'hide')
    }
  }
})
</script>

<style lang="scss">
.modal-exit-app {
  position: relative;
  height: 100%;
  padding: 20px 12px;
  box-sizing: border-box;

  .title {
    height: 36px;
  }

  .buttons {
    position: absolute;
    right: 12px;
    bottom: 20px;

    > button {
      cursor: pointer;
      width: 60px;
      height: 24px;
      color: var(--app-color-text);
      border: 1px solid currentColor;
      border-radius: 30px;
      background-color: transparent;
      & + button {
        margin-left: 8px;
      }

      &.ok {
        color: var(--skin-red);

        &:active {
          color: #fff;
          background-color: var(--skin-red);
        }
      }

      &.cancel {
        &:active {
          color: #fff;
          background-color: var(--skin-blue);
        }
      }
    }
  }
}
</style>
