<template>
  <div class="app-home">
    首页
    <button @click="themeChange('')">
默认主题
</button>
    <button @click="themeChange('dark')">
黑暗主题
</button>
    <button @click="themeChange('red')">
红色主题
</button>
    <button @click="themeChange('pink')">
粉色主题
</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppHome',

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
