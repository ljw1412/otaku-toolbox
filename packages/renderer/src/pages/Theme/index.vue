<template>
  <div class="app-theme">
    <ul class="skin-grid d-grid">
      <li v-for="theme of themeData.themes"
        :key="theme.value"
        class="skin-item">
        <div class="skin-cover d-flex cursor-pointer"
          :class="{actived:theme.value===themeData.current}"
          :style="{backgroundColor:`var(${theme.variable})`}"
          @click="changeTheme(theme.value)">
          <acg-icon v-show="theme.value===themeData.current"
            name="checkmark"
            size="40"
            class="m-auto"
            fill="#fff"
            stroke="#fff"></acg-icon>
        </div>
        <div class="text-center">{{ theme.name }}</div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppTheme',
  data() {
    return {
      themeData: window.$theme.data
    }
  },
  methods: {
    changeTheme(value: string) {
      window.$theme.set(value)
    }
  }
})
</script>

<style lang="scss">
.app-theme {
  height: 100%;
  .skin-grid {
    box-sizing: border-box;
    height: 100%;
    grid-template-columns: repeat(3, 180px);
    grid-template-rows: repeat(2, 130px);
    justify-content: center;
    align-content: center;
    justify-items: center;
    .skin-cover {
      box-sizing: border-box;
      width: 160px;
      height: 100px;
      border-radius: 4px;
      &.actived {
        border: 4px solid var(--border-color);
      }
    }
  }
}
</style>
