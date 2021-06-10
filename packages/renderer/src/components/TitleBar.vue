<template>
  <header class="app-title-bar">
    <div class="title-bar-left">
      <span>二次元工具箱</span>
      <span v-if="finalTitle"> - </span>
      <span>{{ finalTitle }}</span>
    </div>
    <div class="title-bar-right"></div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppTitleBar',
  props: { title: { type: String, default: '' } },
  computed: {
    metaTitle(): string {
      return this.$route.meta.title as string
    },
    finalTitle(): string {
      return this.title || this.metaTitle
    }
  }
})
</script>

<style lang="scss">
.app-title-bar {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: var(--title-bar-height);
  max-height: var(--title-bar-height);
  min-height: var(--title-bar-height);
  color: var(--title-text-color);
  background-color: var(--title-bar-color);
  -webkit-app-region: drag;

  display: flex;
  justify-content: space-between;
  align-items: center;

  .title-bar-left {
    margin-left: 16px;
  }

  .title-bar-right {
    -webkit-app-region: no-drag;
  }
}
</style>
