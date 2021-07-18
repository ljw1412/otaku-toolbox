<template>
  <div class="app-home">
    首页
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppHome',

  data() {
    return {
      show: false
    }
  },

  methods: {
    themeChange(theme: string) {
      window.$theme.set(theme)
    }
  }
})
</script>

<style lang="scss">
.app-home {
  height: 5000px;
}
</style>
