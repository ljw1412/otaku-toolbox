<template>
  <div class="header-center d-flex">
    <svg class="triangle" width="30" height="60" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 0 C30 0 20 60 0 60 L30 60 L30 0 Z" />
    </svg>
    <div class="content flex-grow-1" :class="contentClass" :style="contentStyle">
      <slot></slot>
    </div>
    <svg class="triangle" width="30" height="60" version="1.1" style="transform: scaleX(-1);"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M30 0 C30 0 20 60 0 60 L30 60 L30 0 Z" />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppHeaderCenterBg',

  props: {
    contentStyle: [Object, String],
    contentClass: [Object, String]
  }
})
</script>

<style lang="scss">
.header-center {
  .triangle {
    fill: var(--app-header-center-bg);
  }

  .content {
    background-color: var(--app-header-center-bg);
  }
}
</style>
