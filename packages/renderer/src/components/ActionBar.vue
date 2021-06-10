<template>
  <div class="app-action-bar">
    <router-link :to="{name:'AppHome'}">
      Home
    </router-link>
    <router-link :to="{name:'AppSetting'}">
      Setting
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppActionBar'
})
</script>

<style lang="scss">
.app-action-bar {
  height: var(--action-bar-height);
  max-height: var(--action-bar-height);
  min-height: var(--action-bar-height);
}
</style>
