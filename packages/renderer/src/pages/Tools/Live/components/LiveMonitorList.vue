<template>
  <a-space class="live-monitor-list">
    <a-popover v-for="(monitor,index) of monitors"
      :key="monitor.id"
      class="live-monitor-preview">
      <a-button @click="handleToTestMultiRoom(monitor)">{{ monitor.name }}</a-button>

      <template #title>
        <div class="layout-lr">
          <div class="title">{{ monitor.name }}</div>
          <div class="extra">
            <a-link class="mr-4"
              @click="handleMonitorEdit(monitor)">
              <icon-edit />
            </a-link>
            <a-popconfirm :content="`确认删除监控台[${monitor.name}]吗?`"
              position="br"
              @ok="handleMonitorDelete(monitor,index)">
              <a-link status="danger">
                <icon-close-circle-fill class="monitor-remove" />
              </a-link>
            </a-popconfirm>
          </div>
        </div>
      </template>
      <template #content>
        <div class="live-monitor-grid live-monitor-template"
          :data-type="monitor.mode">
          <div v-for="i of getModeLiveCount(monitor.mode)"
            :key="monitor.roomList[i - 1].room_id"
            class="room-item layout-center text-center">{{ monitor.roomList[i - 1].uname }}</div>
        </div>
      </template>
    </a-popover>
    <a-button v-if="monitors.length <= 5"
      type="outline"
      @click="handleMonitorAdd">添加监控台</a-button>
  </a-space>

  <a-modal v-model:visible="isDisplayEdit"
    class="live-monitor-editor"
    title="编辑监控台"
    @ok="handleEditSave">
    <a-input v-model="editor.name"
      :max-length="6"
      placeholder="名称"
      show-word-limit></a-input>
    <div class="mode-select">
      <acg-ratio-div v-for="i of 15"
        :key="i"
        :ratio="[16,9]"
        class="m-4"
        @click="editor.mode = i - 1">
        <div class="mode-item live-monitor-template h-100"
          :class="{selected: editor.mode === i - 1}"
          :data-type="i - 1">
          <div v-for="j of getModeLiveCount(i - 1)"
            :key="j"
            class="room-item m-1"></div>
        </div>
      </acg-ratio-div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { defineComponent } from 'vue'
import { defaultMonitor, getModeLiveCount } from '../utils/data'
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

  data() {
    return {
      isDisplayEdit: false,
      currentMonitor: {} as LiveMonitor,
      editor: { name: '', mode: 0 }
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
      this.editor.name = monitor.name
      this.editor.mode = monitor.mode
      this.isDisplayEdit = true
    },

    handleEditSave() {
      this.currentMonitor.name = this.editor.name
      this.currentMonitor.mode = this.editor.mode
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
  .live-monitor-grid {
    width: 200px;
    height: 150px;

    .room-item {
      background-color: var(--app-color-common);
      margin: 1px;
    }
  }
}

.live-monitor-editor {
  .mode-select {
    display: grid;
    grid-template-columns: repeat(3, 33.33%);

    .mode-item {
      cursor: pointer;
      opacity: 0.4;
      &.selected {
        opacity: 1;
      }

      &:not(.selected):hover {
        opacity: 0.6;
      }
    }

    .room-item {
      background-color: var(--app-color-common);
    }
  }
}
</style>
