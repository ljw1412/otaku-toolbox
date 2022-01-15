<template>
  <div class="live-multi-room"
    :data-type="type">
    <live-room v-for="(room_id,index) of roomList"
      :key="index"
      :room-id="room_id"
      :monitor-id="1"
      :key-id="index"></live-room>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LiveRoom from './components/LiveRoom.vue'

export default defineComponent({
  name: 'LiveMultiRoom',

  components: { LiveRoom },

  props: { type: { type: String, default: '-1' } },

  data() {
    return {
      roomList: [] as number[]
    }
  },

  mounted() {
    const { data } = this.$route.query
    if (Array.isArray(data)) {
      this.roomList = data.map(id => parseInt(id as string))
    }
  }
})
</script>

<style lang="scss">
.live-multi-room {
  width: 100%;
  height: 100%;
  display: grid;

  &[data-type='0'] {
    grid-template-columns: 50% 50%;
  }
}
</style>
