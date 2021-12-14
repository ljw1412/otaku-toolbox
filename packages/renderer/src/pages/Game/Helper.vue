<template>
  <app-sub-navigation class="game-header"
    :navigations="navigations"
    :right-links="rightLinks"></app-sub-navigation>
  <acg-back-top target="#game-main"></acg-back-top>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppSubNavigation from '/@/components/AppSubNavigation.vue'

export default defineComponent({
  name: 'GameHelper',
  components: { AppSubNavigation },
  data() {
    return {
      navigations: [
        { name: '推荐', to: { name: 'GameHome' } }
      ] as PageNavigationItem[],
      rightLinks: []
    }
  }
})
</script>

<style lang="scss">
.game-header {
  padding: 0 var(--scroll-bar-width);
}
</style>
