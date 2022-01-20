<template>
  <div class="live-multi-room live-monitor-template"
    :data-type="monitor.mode"
    @dragleave="handleDragleave">
    <div v-for="index of count"
      :key="index"
      :data-index="index"
      class="room-item"
      :class="{dragging: highlightIndex === index}"
      @dragover="handleItemDragover($event,index)"
      @drop="handleItemDrop($event,index)">
      <live-room v-if="roomidList[index - 1]"
        :key="roomidList[index - 1]"
        :room-id="roomidList[index - 1]"
        :config="monitor.roomConfigList[index - 1]"
        @close="handleRoomClose(index - 1)"></live-room>
    </div>
  </div>
</template>

<script lang="ts">
import { useLocalStorage, get } from '@vueuse/core'
import { defineComponent } from 'vue'
import LiveRoom from './components/LiveRoom.vue'
import { defaultMonitor, getModeLiveCount } from './utils/data'
import { only } from '/@/utils/object'

export default defineComponent({
  name: 'LiveMultiRoom',

  components: { LiveRoom },

  props: { monitorId: { type: String, default: '-1' } },

  setup(props) {
    const monitors = useLocalStorage(
      'MY_LIVE_MONITOR_LIST',
      [] as LiveMonitor[]
    )

    let monitor = get(monitors).find(item => item.id + '' === props.monitorId)
    if (!monitor) {
      monitor = defaultMonitor()
    }

    return { monitor }
  },

  data() {
    return {
      highlightIndex: -1
    }
  },

  computed: {
    count() {
      return getModeLiveCount(this.monitor.mode)
    },
    roomidList() {
      return this.monitor.roomList.map(item => item.room_id)
    }
  },

  methods: {
    handleRoomClose(index: number) {
      this.monitor.roomList[index] = {} as LiveInfo
    },

    handleItemDragover(ev: DragEvent, index: number) {
      ev.preventDefault()
      this.highlightIndex = index
    },

    handleItemDrop(ev: DragEvent, index: number) {
      const data = ev.dataTransfer?.getData('Room')
      if (data) {
        try {
          const info = JSON.parse(data)
          const i = this.monitor.roomList.findIndex(
            item => item.room_id === info.room_id
          )
          if (i !== -1) {
            this.handleRoomClose(i)
          }

          this.monitor.roomList[index - 1] = only(
            info,
            'uname uid room_id short_id'
          ) as LiveInfo
        } catch (error) {
          console.error(error)
        }
      }
      this.highlightIndex = -1
    },

    handleDragleave() {
      this.highlightIndex = -1
    }
  }
})
</script>

<style lang="scss">
.live-multi-room {
  width: 100%;
  height: 100%;
  display: grid;
  background-color: #2a2a2b;
  overflow: hidden;

  .room-item {
    position: relative;
    z-index: 300;
    border: 0.5px solid rgba(200, 200, 200, 0.1);

    @for $i from 1 through 9 {
      &[data-index='#{$i}']::before {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        content: '#{$i}';
        font-size: 36px;
        color: #ffffff;
      }
    }

    &.dragging {
      border: 4px solid var(--app-color-common);
      box-sizing: border-box;
    }
  }
}
</style>
