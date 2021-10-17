<template>
  <fixed-button ref="btn"
    class="acg-back-top"
    :target="target"
    :visibility-height="visibilityHeight"
    :right="right"
    :bottom="bottom"
    @click="onClick">
    <span>UP</span>
  </fixed-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FixedButton from './FixedButton.vue'

export default defineComponent({
  name: 'AcgBackTop',

  components: {
    FixedButton
  },

  props: {
    target: { type: String, default: '' },
    visibilityHeight: { type: Number, default: 200 },
    right: { type: Number, default: 40 },
    bottom: { type: Number, default: 40 }
  },

  methods: {
    onClick() {
      const { targetEl } = this.$refs.btn as { targetEl: HTMLElement }
      if (targetEl) {
        targetEl.scrollTo({ behavior: 'smooth', top: 0 })
      }
    }
  }
})
</script>

<style lang="scss">
</style>
