<template>
  <div class="setting-theme">
    <a-typography-title :heading="5"
      style="margin-top: 0;">主题色</a-typography-title>
    <div class="theme-color-list">
      <acg-ratio-div v-for="theme of themeData.themes"
        :key="theme.value"
        :class="{actived: theme.value === themeData.current}"
        :style="{backgroundColor:`var(${theme.variable})`}"
        class="color-item"
        body-class="color-item-content"
        @click="changeTheme(theme.value)">
        <icon-check-circle />
      </acg-ratio-div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppSettingTheme',

  computed: {
    themeData() {
      return this.$theme.data
    }
  },

  methods: {
    changeTheme(value: string) {
      this.$theme.set(value)
    }
  }
})
</script>

<style lang="scss">
.setting-theme {
  .theme-color-list {
    display: flex;
    flex-wrap: wrap;
  }

  .color-item {
    cursor: pointer;
    width: 16.66%;

    .color-item-content {
      color: #ffffff;
      font-size: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &:not(.actived) {
      .arco-icon-check-circle {
        display: none;
      }
    }
  }
}
</style>
