<template>
  <div class="app-close-btn layout-center app-no-drag"
    :class="mClass"
    @click="close">
    <icon-close />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ipcSend } from '/@/utils/electron'

export default defineComponent({
  name: 'AppCloseBtn',

  props: {
    mode: { type: String, default: 'child' },
    // 字符串 trbl 组合
    fixed: { type: [Boolean, String], default: false }
  },

  computed: {
    mClass() {
      let data = {}
      if (typeof this.fixed === 'string') {
        data = {
          'is-top': this.fixed.includes('t'),
          'is-right': this.fixed.includes('r'),
          'is-bottom': this.fixed.includes('b'),
          'is-left': this.fixed.includes('l')
        }
      }
      return {
        'is-fixed': !!this.fixed,
        ...data
      }
    }
  },

  methods: {
    close() {
      ipcSend('window.action', 'close', { mode: this.mode })
    }
  }
})
</script>

<style lang="scss">
.app-close-btn {
  width: 48px;
  height: 48px;
  font-size: 36px;
  background-color: var(--color-danger-light-3);
  color: #ffffff;
  cursor: pointer;

  &.is-fixed {
    position: fixed;
    z-index: 500;
    @each $p in (top, right, bottom, left) {
      &.is-#{$p} {
        #{$p}: 0;
      }
    }
  }

  &:hover {
    background-color: var(--color-danger-light-4);
  }

  &:active {
    background-color: #f95a44;
  }
}
</style>
