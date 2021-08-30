<template>
  <div class="app-setting">
    {{ config }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getAppConfig } from '/@/utils/electron'

export default defineComponent({
  name: 'AppSetting',

  data() {
    return {
      config: {}
    }
  },

  created() {
    getAppConfig().then(config => {
      console.log(config)
      this.config = config
    })
  }
})
</script>

<style lang="scss">
.app-setting {
  height: 1000px;
}
</style>
