<template>
  <svg class="acg-icon"
    aria-hidden="true"
    :style="styles">
    <use :xlink:href="iconName"
      v-bind="attrs"></use>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AcgIcon',
  props: {
    name: { type: String, required: true },
    size: { type: [String, Number], default: undefined },
    fill: { type: String, default: undefined },
    stroke: { type: String, default: undefined }
  },
  computed: {
    iconName(): string {
      return `#icon-${this.name}`
    },
    fontSize(): string {
      return typeof this.size === 'number' ? this.size + 'px' : this.size
    },
    styles(): Record<string, any> {
      return { fontSize: this.fontSize }
    },
    attrs(): Record<string, any> {
      return {
        fill: this.fill,
        stroke: this.stroke || this.fill
      }
    }
  }
})
</script>

<style lang="scss">
.acg-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  overflow: hidden;
  fill: currentColor;
  stroke: currentColor;
}
</style>
