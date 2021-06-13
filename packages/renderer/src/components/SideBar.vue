<template>
  <aside class="app-side-bar">
    <div class="app-user">
      <div class="user-avatar"></div>
      <div class="user-name">
        <span>用户名</span>
      </div>
    </div>

    <action-bar></action-bar>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ActionBar from './ActionBar.vue'

export default defineComponent({
  name: 'AppSideBar',
  components: {
    ActionBar
  }
})
</script>

<style lang="scss">
.app-side-bar {
  position: relative;
  box-sizing: border-box;
  width: var(--side-bar-width);
  height: 100%;
  padding: 20px 0;
  flex-shrink: 0;
  color: var(--title-text-color);
  background-color: var(--side-bar-color);
  -webkit-app-region: drag;
}

.app-user {
  text-align: center;
  -webkit-app-region: no-drag;

  .user-avatar {
    display: inline-block;
    width: var(--side-bar-avatar-size);
    height: var(--side-bar-avatar-size);
    border: 1px solid #ffffff;
    border-radius: 50%;
  }

  .user-name {
    font-size: 12px;
    line-height: 20px;
    height: 20px;
    max-height: 20px;
    min-height: 20px;
  }
}
</style>
