<template>
  <a-space class="live-monitor-list">
    <a-popover v-for="(monitor, index) of monitors" :key="monitor.id" class="live-monitor-preview">
      <a-button @click="handleToTestMultiRoom(monitor)">{{ monitor.name }}</a-button>

      <template #title>
        <div class="layout-lr">
          <div class="title">{{ monitor.name }}</div>
          <div class="extra">
            <a-link class="mr-4" @click="handleMonitorEdit(monitor)">
              <icon-edit />
            </a-link>
            <a-popconfirm
              :content="`确认删除监控台[${monitor.name}]吗?`"
              position="br"
              @ok="handleMonitorDelete(monitor, index)"
            >
              <a-link status="danger">
                <icon-close-circle-fill class="monitor-remove" />
              </a-link>
            </a-popconfirm>
          </div>
        </div>
      </template>
      <template #content>
        <div class="live-monitor-grid live-monitor-template" :data-type="monitor.mode">
          <div
            v-for="i of getModeLiveCount(monitor.mode)"
            :key="monitor.roomList[i - 1].room_id"
            class="room-item layout-center text-center"
          >{{ monitor.roomList[i - 1].uname }}</div>
        </div>
      </template>
    </a-popover>
    <a-button v-if="monitors.length <= 5" type="outline" @click="handleMonitorAdd">添加监控台</a-button>
  </a-space>
  <monitor-editor-dialog
    v-model="isDisplayEdit"
    :current-monitor="currentMonitor"
    @save="handleMonitorSave"
  ></monitor-editor-dialog>
</template>

<script lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { defineComponent } from 'vue'
import { defaultMonitor, getModeLiveCount } from '../utils/data'
import MonitorEditorDialog from './MonitorEditorDialog.vue'

export default defineComponent({
  name: 'LiveMonitorList',

  components: { MonitorEditorDialog },

  setup() {
    const monitors = useLocalStorage(
      'MY_LIVE_MONITOR_LIST',
      [] as LiveMonitor[]
    )
    return { monitors }
  },

  data() {
    return {
      isDisplayEdit: false,
      currentMonitor: {} as LiveMonitor
    }
  },

  methods: {
    getModeLiveCount,

    handleMonitorAdd() {
      if (this.monitors.length <= 5) {
        this.monitors.push(defaultMonitor())
      }
    },

    handleMonitorDelete(monitor: LiveMonitor, index: number) {
      this.monitors.splice(index, 1)
    },

    handleMonitorEdit(monitor: LiveMonitor) {
      this.currentMonitor = monitor
      this.isDisplayEdit = true
    },

    handleMonitorSave(editor: { name: string; mode: number }) {
      this.currentMonitor.name = editor.name
      this.currentMonitor.mode = editor.mode
    },

    handleToTestMultiRoom(monitor: LiveMonitor) {
      this.$API.Electron.win.openVue(
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
  .live-monitor-grid {
    width: 200px;
    height: 150px;

    .room-item {
      background-color: var(--app-color-common);
      margin: 1px;
    }
  }
}
</style>
