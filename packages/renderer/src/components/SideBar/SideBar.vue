<template>
  <aside class="app-side-bar app-drag">
    <div class="app-user app-no-drag">
      <div class="user-avatar"></div>
      <div class="user-name">
        <span>用户名</span>
      </div>
    </div>

    <navigation-bar></navigation-bar>

    <action-bar></action-bar>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ActionBar from './ActionBar.vue'
import NavigationBar from './NavigationBar.vue'

export default defineComponent({
  name: 'AppSideBar',

  components: {
    ActionBar,
    NavigationBar
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
}

.app-user {
  text-align: center;

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
