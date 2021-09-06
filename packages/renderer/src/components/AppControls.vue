<template>
  <div class="app-controls app-no-drag d-flex align-items-center">
    <slot></slot>
    <div v-if="minimizable && minimizableOfMeta"
      class="app-control-btn btn-min"
      @click="windowAction('min')">
      <acg-icon name="remove"></acg-icon>
    </div>
    <div v-if="maximizable && maximizableOfMeta"
      class="app-control-btn btn-max"
      @click="windowAction('max')">
      <acg-icon :name="isMaximized?'copy-outline':'stop-outline'"></acg-icon>
    </div>
    <div class="app-control-btn btn-close"
      @click="windowAction('close')">
      <acg-icon name="close"></acg-icon>
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
    windowAction(action: 'min' | 'max' | 'close') {
      ipcSend('window.action', action)
    }
  }
})
</script>

<style lang="scss">
.app-controls {
  font-size: 20px;
  line-height: 1;
  .app-control-btn {
    display: inline-flex;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    color: #d3d3d3;
    border-radius: 4px;
    cursor: pointer;

    .acg-icon {
      margin: auto;
    }

    &.btn-max {
      font-size: 18px;
    }

    &.btn-max {
      .acg-icon {
        transform: scaleX(-1);
      }
    }

    &.btn-close:hover {
      background-color: #f95a44;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.25);
      color: #ffffff;
    }
    &:active {
      opacity: 0.8;
    }
  }
}
</style>
