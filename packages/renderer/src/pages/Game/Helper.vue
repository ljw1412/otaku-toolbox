<template>
  <game-sub-navigation></game-sub-navigation>
  <acg-back-top target="#game-main"></acg-back-top>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GameSubNavigation from './components/GameSubNavigation.vue'

export default defineComponent({
  name: 'GameHelper',
  components: { GameSubNavigation },
  data() {
    return {
      navigations: [
        { name: '资讯', to: { name: 'GameHome' } }
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
