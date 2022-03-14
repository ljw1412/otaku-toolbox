<template>
  <div class="live-monitor">
    <app-mini-header class="flex-shrink-0">
      <template #title>
        <a-button-group class="mr-8 app-no-drag">
          <a-button v-show="false" size="mini" @click="isCollapsed = !isCollapsed">
            <template #icon>
              <component :is="isCollapsed ? 'icon-down' : 'icon-up'"></component>
            </template>
          </a-button>
          <a-button size="mini" @click="isDisplayEdit = true">
            <template #icon>
              <icon-settings />
            </template>
          </a-button>
        </a-button-group>
        <span>{{ monitor.name }}</span>
      </template>
    </app-mini-header>

    <div v-show="!isCollapsed" class="live-room-list"></div>

    <div
      class="live-multi-room live-monitor-template"
      :data-type="monitor.mode"
      @dragleave="handleDragleave"
    >
      <div
        v-for="index of count"
        :key="index"
        :data-index="index"
        class="room-item"
        :class="{ dragging: highlightIndex === index }"
        @dragover="handleItemDragover($event, index)"
        @drop="handleItemDrop($event, index)"
      >
        <live-room
          v-if="roomidList[index - 1]"
          :key="roomidList[index - 1]"
          :room-id="roomidList[index - 1]"
          :config="monitor.roomConfigList[index - 1]"
          @close="handleRoomClose(index - 1)"
        ></live-room>
      </div>

      <monitor-editor-dialog
        v-model="isDisplayEdit"
        :current-monitor="monitor"
        @save="handleMonitorSave"
      ></monitor-editor-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { useLocalStorage, get, useEventListener } from '@vueuse/core'
import { defineComponent } from 'vue'
import AppMiniHeader from '/@/containers/components/AppMiniHeader.vue'
import LiveRoom from './components/LiveRoom.vue'
import MonitorEditorDialog from './components/MonitorEditorDialog.vue'
import { defaultMonitor, getModeLiveCount } from './utils/data'
import { only } from '/@/utils/object'
import { ipcSend } from '/@/utils/electron'

const STORE_KEY = 'MY_LIVE_MONITOR_LIST'

export default defineComponent({
  name: 'LiveMultiRoom',

  components: { AppMiniHeader, LiveRoom, MonitorEditorDialog },

  props: { monitorId: { type: String, default: '-1' } },

  data() {
    return {
      monitor: defaultMonitor(),
      highlightIndex: -1,
      isCollapsed: true,
      isDisplayEdit: false
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

  created() {
    this.initMonitor(true)
    useEventListener(window, 'storage', ev => {
      if (ev.key === STORE_KEY) {
        this.initMonitor()
      }
    })
  },

  methods: {
    initMonitor(isFrist = false) {
      const monitors = useLocalStorage(STORE_KEY, [] as LiveMonitor[])

      let monitor = get(monitors).find(item => item.id + '' === this.monitorId)
      if (!monitor && !isFrist) {
        this.$modal.error({
          title: '错误',
          alignCenter: true,
          maskClosable: false,
          content: '当前监控台可能已经被删除！',
          okText: '关闭监控台',
          onOk: () => {
            this.$API.Electron.win.close('close', 'child')
          }
        })
        return
      }
      if (!monitor) {
        monitor = defaultMonitor()
      }
      this.monitor = monitor
    },

    handleMonitorSave(editor: { name: string; mode: number }) {
      this.monitor.name = editor.name
      this.monitor.mode = editor.mode
    },

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
.live-monitor {
  display: flex;
  flex-direction: column;
  height: 100%;

  .live-room-list {
    flex-shrink: 0;
    height: 100px;
  }
}

.live-multi-room {
  flex-grow: 1;
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
      &[data-index="#{$i}"]::before {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        content: "#{$i}";
        text-align: center;
        font-size: 36px;
        color: #ffffff;
      }
    }

    &.dragging {
      border: 4px solid var(--app-color-common);
      box-sizing: border-box;
    }

    &:hover {
      border-color: var(--app-color-common);
    }
  }
}
</style>
