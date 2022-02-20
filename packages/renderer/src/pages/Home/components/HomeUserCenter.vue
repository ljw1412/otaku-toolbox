<template>
  <div class="home-user-center">
    <div class="user-info layout-lr px-12">
      <a-avatar class="flex-shrink-0 mr-8"
        :size="52"></a-avatar>
      <div class="flex-grow-1">
        <div class="fs-16 lh-26">游客</div>
        <div>
          <a-tag size="small">LV.0</a-tag>
        </div>
      </div>
    </div>
    <div class="user-action"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeUserCenter'
})
</script>

<style lang="scss">
.home-user-center {
  border-radius: 4px;
  box-shadow: 0 1px 1px var(--color-fill-2) inset, 0 1px 3px var(--color-fill-3);

  .user-info {
    height: 80px;
    border-bottom: 1px solid var(--color-border-1);
  }

  .user-action {
    height: 70px;
  }
}
</style>
