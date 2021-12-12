<template>
  <div class="app-controls app-no-drag d-flex align-items-center">
    <slot></slot>
    <div v-if="minimizable && minimizableOfMeta"
      class="app-control-btn btn-min"
      @click="windowAction('min')">
      <icon-minus />
      <!-- <acg-icon name="remove"></acg-icon> -->
    </div>
    <div v-if="maximizable && maximizableOfMeta"
      class="app-control-btn btn-max"
      @click="windowAction('max')">
      <component :is="isMaximized?'icon-shrink':'icon-expand'"></component>
      <!-- <acg-icon :name="isMaximized?'copy-outline':'stop-outline'"></acg-icon> -->
    </div>
    <div class="app-control-btn btn-close"
      @click="windowAction('close')">
      <icon-close />
      <!-- <acg-icon name="close"></acg-icon> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ipcSend, ipcOn, ipcOff } from '/@/utils/electron'
import { safeBoolean } from '/@/utils/helper'

export default defineComponent({
  name: 'AppControls',
  props: {
    mode: { type: String, default: 'child' },
    minimizable: { type: Boolean, default: true },
    maximizable: { type: Boolean, default: true }
  },
  data() {
    return {
      isMaximized: false
    }
  },
  computed: {
    minimizableOfMeta(): boolean {
      return safeBoolean(this.$route.meta.minimizable as boolean, true)
    },
    maximizableOfMeta(): boolean {
      return safeBoolean(this.$route.meta.maximizable as boolean, true)
    },
    hidableOfMeta(): boolean {
      return safeBoolean(this.$route.meta.hidable as boolean)
    }
  },
  created() {
    ipcOn('window.maximize', (e, type, { isMaximized }) => {
      if (type === 'max') {
        this.isMaximized = isMaximized
      }
    })
  },
  beforeUnmount() {
    ipcOff('window.maximize')
  },
  methods: {
    windowAction(action: 'min' | 'max' | 'close' | 'hide') {
      if (action === 'close' && this.hidableOfMeta) {
        action = 'hide'
      }
      ipcSend('window.action', action, { mode: this.mode })
    }
  }
})
</script>

<style lang="scss">
.app-controls {
  font-size: 18px;
  line-height: 1;
  .app-control-btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    color: #d3d3d3;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }
    &:active {
      background-color: rgba(255, 255, 255, 0.16);
    }

    &.btn-close {
      &:hover {
        background-color: var(--color-danger-light-4);
      }
      &:active {
        background-color: #f95a44;
      }
    }
  }
}
</style>
