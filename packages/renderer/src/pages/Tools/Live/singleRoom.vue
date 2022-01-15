<template>
  <div class="live-single-room">
    <live-room :room-id="id"
      hide-header
      @status-change="handleRoomStatusChange"></live-room>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LiveRoom from './components/LiveRoom.vue'

export default defineComponent({
  name: 'LiveSingleRoom',

  components: {
    LiveRoom
  },

  props: {
    id: { type: String, default: '' }
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
