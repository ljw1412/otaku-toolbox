<template>
  <div class="anime-home">
    <button @click="onClick">
按钮
</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ipcSend } from '/@/utils/electron'

export default defineComponent({
  name: 'AppAnimeHome',
  components: {},

  data() {
    return {}
  },

  methods: {
    onClick() {
      console.log(this)

      ipcSend('window.action', 'child', { url: 'https://www.bilibili.com' })
    }
  }
})
</script>

<style lang="scss">
.anime-home {
}
</style>
