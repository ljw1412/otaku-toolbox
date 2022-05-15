<template>
  <div class="home-user-center">
    <div class="user-info layout-lr px-12">
      <a-avatar class="flex-shrink-0 mr-16" :size="52">
        <span>{{ username }}</span>
      </a-avatar>
      <div class="flex-grow-1">
        <div class="fs-16 lh-26">{{ username }}</div>
        <div>
          <a-tag size="small">LV.0</a-tag>
        </div>
      </div>
    </div>
    <div class="user-action d-flex">
      <acg-ratio-div v-for="i of 4" :key="i" :ratio="[1, 1]" class="action-item w-25 flex-shrink-0"></acg-ratio-div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeUserCenter',

  data() {
    return {
      username: '游客'
    }
  }
})
</script>

<style lang="scss">
.home-user-center {
  border-radius: 4px;
  background-color: var(--color-bg-2);
  box-shadow: 0 1px 1px var(--color-fill-2) inset, 0 1px 3px var(--color-fill-3);

  .user-info {
    height: 80px;
  }

  .user-action {
    height: 70px;
    .action-item {
      box-sizing: border-box;
      border-top: 1px solid var(--color-fill-2);
      border-right: 1px solid var(--color-fill-2);

      &:last-child {
        border-right: none;
      }
    }
  }
}
</style>
