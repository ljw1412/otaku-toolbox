<template>
  <div v-if="icon" class="app-favicon" :style="{ width: size + 'px', height: size + 'px' }">
    <component :is="iconType" v-bind="iconProps"></component>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppFavicon',

  props: {
    icon: { type: String, default: '' },
    size: { type: Number, default: 16 }
  },

  computed: {
    iconType() {
      return this.icon.startsWith('icon-') ? this.icon : 'img'
    },

    iconProps() {
      if (this.iconType === 'img') {
        return { src: this.icon }
      } else {
        return { size: this.size }
      }
    }
  }
})
</script>

<style lang="scss">
.app-favicon {
  display: inline-flex;
  vertical-align: text-bottom;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
