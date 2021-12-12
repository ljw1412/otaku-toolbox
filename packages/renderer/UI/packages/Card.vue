<template>
  <div class="acg-card"
    :class="{
      'is-always-shadow': shadow === 'always',
      'is-hover-shadow': shadow === 'hover',
      'is-border': !noBorder,
      'is-fill': fill,
      'is-hover-up': hoverUp
    }">
    <div v-if="$slots.header"
      class="acg-card__header">
      <slot name="header"></slot>
    </div>
    <div class="acg-card__body"
      :class="innerClass">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AcgCard',
  props: {
    // 内容铺满，内容无内边距
    fill: { type: Boolean, default: false },
    // 无边框
    noBorder: { type: Boolean, default: false },
    hoverUp: { type: Boolean, default: false },
    // 显示阴影的情况： always / hover / never
    shadow: { type: String, default: 'hover' },
    innerClass: { type: [String, Object, Array], default: '' }
  }
})
</script>

<style lang="scss">
.acg-card {
  --acg-card-shadow: 0 34px 20px -24px #000000;
  --acg-card-border-raduis: 4px;
  --acg-card-background-color: #ffffff;
  --acg-card-padding: 20px;
  --acg-card-border-color: var(--acg-border-color);

  overflow: hidden;
  box-sizing: border-box;
  border-radius: var(--acg-card-border-raduis);
  background-color: var(--acg-card-background-color);
  transition: box-shadow 0.3s cubic-bezier(0.215, 0.61, 0.355, 1),
    transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

  &.is-always-shadow {
    box-shadow: var(--acg-card-shadow);
  }

  &.is-hover-up {
    margin-bottom: 30px;
    &:hover {
      transform: translateY(-5px);
    }
  }

  &.is-hover-shadow {
    &:hover {
      box-shadow: var(--acg-card-shadow);
    }
  }

  &.is-border {
    border: 1px solid var(--acg-card-border-color);
  }

  &.is-fill &__body {
    padding: 0;
  }

  &__body {
    padding: var(--acg-card-padding);
  }
}
</style>
