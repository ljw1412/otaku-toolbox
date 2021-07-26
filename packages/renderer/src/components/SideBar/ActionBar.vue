<template>
  <div class="app-action-bar app-no-drag">
    <div class="action-btn">
      <skin-pop inner-class="fs-24 cursor-pointer"
        placement="right-end"
        :offset="[0,40]"></skin-pop>
    </div>
    <div class="action-btn">
      <acg-icon name="menu"
        :size="28"></acg-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SkinPop from '/@/components/SkinPop.vue'

export default defineComponent({
  name: 'AppActionBar',
  components: { SkinPop }
})
</script>

<style lang="scss">
.app-action-bar {
  position: absolute;
  left: 0;
  bottom: 32px;
  width: 100%;

  .action-btn {
    height: 36px;
    width: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px auto;
  }
}
</style>
