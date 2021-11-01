<template>
  <app-dialog v-model="visible"
    title="筛选"></app-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AnimeFilterDialog',
  props: {
    modelValue: Boolean
  },
  emits: ['update:modelValue'],
  computed: {
    visible: {
      get(): boolean {
        return this.modelValue
      },
      set(val: boolean) {
        this.$emit('update:modelValue', val)
      }
    }
  }
})
</script>

<style lang="scss">
.anime-filter-dialog {
  position: fixed;
  top: var(--app-header-height);
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  padding: 40px 100px;

  .btn-close {
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: rotate(360deg);
    }

    &:active {
      transform: scale(0.9);
    }
  }
}
</style>
