<template>
  <a-space class="live-monitor-list">
    <a-popover v-for="(monitor,index) of monitors"
      :key="monitor.id"
      :title="`监控台${ index }`">
      <a-button @click="handleToTestMultiRoom(monitor)">监控台{{ index }}</a-button>
      <template #content>
        <div class="live-monitor-preview live-monitor-template"
          :data-type="monitor.mode">
          <div class="room-item layout-center text-center"
            v-for="room of monitor.roomList"
            :key="room.room_id">{{ room.uname }}</div>
        </div>
      </template>
    </a-popover>
    <a-button v-if="monitors.length <= 5"
      type="outline"
      @click="handleMonitorAdd">添加监控台</a-button>
  </a-space>
</template>

<script lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { defineComponent } from 'vue'
import { defaultMonitor } from '../utils/data'
import { openVueView } from '/@/utils/electron'

export default defineComponent({
  name: 'LiveMonitorList',

  setup() {
    const monitors = useLocalStorage(
      'MY_LIVE_MONITOR_LIST',
      [] as LiveMonitor[]
    )
    return { monitors }
  },

  methods: {
    handleMonitorAdd() {
      if (this.monitors.length <= 5) {
        this.monitors.push(defaultMonitor())
      }
    },

    handleToTestMultiRoom(monitor: LiveMonitor) {
      openVueView(
        {
          name: 'MultiLiveRoom',
          params: { monitorId: monitor.id }
        },
        {
          minWidth: 854,
          minHeight: 480,
          title: `监控台${monitor.id}`,
          singleInstance: true
        }
      )
    }
  }
})
</script>

<style lang="scss">
.live-monitor-preview {
  width: 200px;
  height: 150px;
  border: 1px solid var(--color-border);
  .room-item {
    border: 1px solid var(--color-border);
  }
}
</style>
