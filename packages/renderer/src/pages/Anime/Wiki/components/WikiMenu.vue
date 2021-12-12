<template>
  <div class="wiki-menu">
    <a-menu mode="pop"
      :default-collapsed="true"
      :default-selected-keys="['1']"
      show-collapse-button>
      <a-menu-item key="1">
        <icon-apps /> 基本信息
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AnimeWikiMenu'
})
</script>

<style lang="scss">
.wiki-menu {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  padding: 40px 0;
  box-sizing: border-box;
  z-index: 600;

  .arco-menu {
    width: 200px;
    height: 100%;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);

    .arco-menu-collapse-button {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
    &:not(.arco-menu-collapsed) {
      .arco-menu-collapse-button {
        right: 0;
        bottom: 8px;
        transform: translateX(50%);
      }
      &::before {
        content: '';
        position: absolute;
        right: 0;
        bottom: 0;
        width: 48px;
        height: 48px;
        background-color: inherit;
        border-radius: 50%;
        box-shadow: -4px 0 2px var(--color-bg-2), 0 0 1px rgba(0, 0, 0, 0.3);
        transform: translateX(50%);
      }
    }

    &.arco-menu-collapsed {
      width: 48px;
      height: auto;
      padding-top: 24px;
      padding-bottom: 138px;
      border-radius: 22px;
      .arco-menu-collapse-button {
        right: 8px;
        bottom: 8px;
      }
    }
  }
}
</style>
