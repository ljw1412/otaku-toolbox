<template>
  <div class="acg-area-header"
    :class="`align-${align}`">
    <div class="left">
      <slot name="left">
        <h3 class="title">{{ title }}</h3>
        <slot name="left-append"></slot>
      </slot>
    </div>
    <div v-if="$slots.right"
      class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AcgAreaHeader',
  props: {
    title: { type: String, default: '' },
    align: { type: String, default: 'center' }
  }
})
</script>

<style lang="scss">
.acg-area-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  line-height: 1;

  &.align-start {
    align-items: flex-start;
  }

  &.align-end {
    align-items: flex-end;
  }

  .left,
  .right {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
