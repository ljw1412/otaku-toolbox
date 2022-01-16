<template>
  <div class="live-single-room">
    <live-room hide-header
      :room-id="id"
      :config="config"
      @status-change="handleRoomStatusChange"></live-room>
  </div>
</template>

<script lang="ts">
import { toReactive, useLocalStorage } from '@vueuse/core'
import { defineComponent } from 'vue'
import LiveRoom from './components/LiveRoom.vue'
import { defaultLiveConfig } from './utils/data'

export default defineComponent({
  name: 'LiveSingleRoom',

  components: { LiveRoom },

  props: {
    id: { type: String, default: '' }
  },

  setup() {
    const config = useLocalStorage('LIVE_SINGLE_CONFIG', defaultLiveConfig())
    return { config }
  },

  methods: {
    handleRoomStatusChange(data: Record<string, any>) {
      const { title, uname } = data
      this.$global.setTitle(`[${uname}] ${title}`)
    }
  }
})
</script>

<style lang="scss">
.live-single-room {
  width: 100%;
  height: 100%;
}
</style>
