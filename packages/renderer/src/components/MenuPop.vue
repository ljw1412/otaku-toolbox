<template>
  <acg-tooltip :placement="placement"
    :offset="offset"
    :interactive="true"
    animation="perspective-extreme"
    trigger="click"
    :theme="tooltipTheme"
    @show="getTheme">
    <acg-icon :class="['cursor-pointer',innerClass]"
      name="menu"
      :size="28"></acg-icon>

    <template #content>
      Menu
    </template>
  </acg-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BasePop from '/@/mixins/BasePop'

export default defineComponent({
  name: 'MenuPop',
  mixins: [BasePop]
})
</script>

<style lang="scss">
</style>
