<template>
  <transition name="fade">
    <div v-show="modelValue"
      class="app-dialog">
      <div class="app-dialog_container">
        <div class="dialog-title">{{ title }}</div>
        <acg-icon name="close"
          size="64"
          class="btn-close"
          color="#ffffff"
          @click="close"></acg-icon>
        <main>
          <slot></slot>
        </main>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppDialog',
  props: {
    modelValue: Boolean,
    title: String
  },
  emits: ['update:modelValue'],
  methods: {
    close() {
      this.$emit('update:modelValue', false)
    }
  }
})
</script>

<style lang="scss">
.app-dialog {
  position: fixed;
  top: var(--app-header-height);
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5000;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  padding: 40px 100px;
  color: #ffffff;

  &_container {
    position: relative;
    width: 100%;
    height: 100%;

    .dialog-title {
      position: absolute;
      top: 12px;
      left: -48px;
      font-size: 36px;
      writing-mode: vertical-lr;
      letter-spacing: 4px;
    }

    .btn-close {
      position: absolute;
      top: 0;
      right: -64px;
      cursor: pointer;
      transition: transform 0.2s;

      &:hover {
        transform: rotate(360deg);
      }

      &:active {
        transform: scale(0.9);
      }
    }

    > main {
      width: 100%;
      height: 100%;
      overflow-y: auto;
    }
  }
}
</style>
