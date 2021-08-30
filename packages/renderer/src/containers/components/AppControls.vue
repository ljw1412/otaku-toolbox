<template>
  <div class="app-controls app-no-drag d-flex align-items-center">
    <div v-if="minimizable"
      class="app-control-btn btn-min"
      @click="windowAction('min')">
      <acg-icon name="remove"></acg-icon>
    </div>
    <div v-if="maximizable"
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
  data() {
    return {
      isMaximized: false
    }
  },
  computed: {
    minimizable() {
      return safeBoolean(this.$route.meta.minimizable as boolean, true)
    },
    maximizable() {
      return safeBoolean(this.$route.meta.maximizable as boolean, true)
    }
  },
  created() {
    ipcOn('windowx', (e, type, { isMaximized }) => {
      if (type === 'max') {
        this.isMaximized = isMaximized
      }
    })
  },
  beforeUnmount() {
    ipcOff('windowx')
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
    color: #d3d3d3;
    padding: 6px;
    display: inline-flex;
    flex-shrink: 0;
    border-radius: 4px;
    &.btn-max {
      font-size: 16px;
      padding: 8px;
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.25);
      color: #ffffff;
    }
    &.btn-close:hover {
      background-color: #f95a44;
    }
    &:active {
      opacity: 0.8;
    }
  }
}
</style>
