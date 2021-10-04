<template>
  <div class="app-setting">
    <p v-for="(value,key) of config"
      :key="key"
      @click="setOption(key,value)">
      <span>{{ key }}</span>
      <span>:</span>
      <span>{{ value }}</span>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getAppConfig, setAppConfigOption } from '/@/utils/electron'

export default defineComponent({
  name: 'AppSetting',

  data() {
    return {
      config: {}
    }
  },

  created() {
    this.getConfig()
  },

  methods: {
    getConfig() {
      getAppConfig().then(config => {
        console.log(config)
        this.config = config
      })
    },

    setOption(key: string, value: any) {
      if (typeof value === 'boolean') {
        setAppConfigOption({ [key]: !value }).then(this.getConfig)
      }
    }
  }
})
</script>

<style lang="scss">
.app-setting {
  height: 1000px;
}
</style>
