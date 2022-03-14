<template>
  <div class="app-close-btn layout-center app-no-drag" :class="mClass" @click="close">
    <icon-close />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { safeBoolean } from '/@/utils/helper'
import { ipcSend } from '/@/utils/electron'

export default defineComponent({
  name: 'AppCloseBtn',

  props: {
    size: { type: String, default: '' },
    mode: { type: String, default: 'child' },
    // 字符串 trbl 组合
    fixed: { type: [Boolean, String], default: false }
  },

  computed: {
    mClass() {
      let data: Record<string, boolean> = {}
      if (typeof this.fixed === 'string') {
        data = {
          'is-top': this.fixed.includes('t'),
          'is-right': this.fixed.includes('r'),
          'is-bottom': this.fixed.includes('b'),
          'is-left': this.fixed.includes('l')
        }
      }
      if (['small', 'mini'].includes(this.size)) {
        data[`is-${this.size}`] = true
      }
      return {
        'is-fixed': !!this.fixed,
        ...data
      }
    },
    hidableOfMeta(): boolean {
      return safeBoolean(this.$route.meta.hidable as boolean)
    }
  },

  methods: {
    close() {
      this.$API.Electron.win.control(
        this.hidableOfMeta ? 'hide' : 'close',
        this.mode
      )
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

  &.is-mini {
    width: 32px;
    height: 32px;
    font-size: 24px;
  }

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
