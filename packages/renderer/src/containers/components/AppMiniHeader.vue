<template>
  <div class="app-mini-header app-drag d-flex align-items-center justify-content-between">
    <div class="header-left pl-12 fs-14">
      <span class="title">{{ title }}</span>
    </div>
    <div class="header-right pr-4">
      <app-controls></app-controls>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppControls from '../../components/AppControls.vue'

export default defineComponent({
  name: 'AppMiniHeader',
  components: {
    AppControls
  },
  props: { title: { type: String, default: '' } }
})
</script>

<style lang="scss">
.app-mini-header {
  position: relative;
  width: 100%;
  height: var(--app-header-mini-height);
  color: var(--app-header-color-text);
  background-color: var(--app-header-bg);
  z-index: 9999999;

  .title {
  }
}
</style>
