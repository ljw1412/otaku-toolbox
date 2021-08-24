<template>
  <div class="app-subnav-bar d-flex app-no-drag">
    <div v-for="item of list"
      :key="item.routeName"
      class="subnav-item d-flex justify-content-center align-items-center px-16"
      :class="{active:item.routeName===$route.name}"
      @click="navigate(item.routeName)">
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppSubnavBar',
  props: {
    list: { type: Array, default: () => [] }
  },

  methods: {
    navigate(routeName: string) {
      this.$router.push({ name: routeName })
    }
  }
})
</script>

<style lang="scss">
.app-subnav-bar {
  height: 100%;
  .subnav-item {
    cursor: pointer;
    &.active {
      color: blue;
    }
  }
}
</style>
