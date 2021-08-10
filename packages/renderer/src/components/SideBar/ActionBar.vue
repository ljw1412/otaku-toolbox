<template>
  <div class="app-action-bar app-no-drag">
    <div class="action-btn">
      <skin-pop inner-class="fs-24"
        placement="right-end"
        :offset="[0,40]"></skin-pop>
    </div>
    <div class="action-btn">
      <menu-pop placement="right-end"
        :offset="[0,40]"></menu-pop>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SkinPop from '/@/components/SkinPop.vue'
import MenuPop from '/@/components/MenuPop.vue'

export default defineComponent({
  name: 'AppActionBar',
  components: { SkinPop, MenuPop }
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
