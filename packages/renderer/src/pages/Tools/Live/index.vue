<template>
  <div class="app-live">
    <header>
      <a-space>
        <a-button type="primary"
          @click="isDisplayAddRoomDialog = true">搜索直播间</a-button>

        <a-popover v-for="(monitor,index) of monitors"
          :key="monitor.id"
          :title="`监控台${ index }`">
          <a-button @click="handleToTestMultiRoom(monitor)">监控台{{ index }}</a-button>
          <template #content>
            <span v-for="room of monitor.roomList"
              :key="room.room_id">{{ room.uname }}</span>
          </template>
        </a-popover>

        <a-button v-if="monitors.length <= 5"
          type="outline"
          @click="handleMonitorAdd">添加监控台</a-button>
      </a-space>
      <a-space>
        <a-button :loading="loading"
          @click="updateRoomStatus">刷新<span v-if="!loading">({{ downCounter }})</span></a-button>
        <a-radio-group v-model="coverType"
          type="button">
          <a-radio value="cover_from_user">封面</a-radio>
          <a-radio value="keyframe">关键帧</a-radio>
        </a-radio-group>
      </a-space>
    </header>
    <main>
      <live-card v-for="item of sortedList"
        :key="item.room_id"
        :info="item"
        :cover-type="coverType"></live-card>
    </main>

    <add-room-dialog v-model="isDisplayAddRoomDialog"
      :current-list="list"
      @add="handleRoomAdd"
      @enter="handleRoomEnter"></add-room-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useInterval, useLocalStorage } from '@vueuse/core'
import { openVueView } from '/@/utils/electron'
import * as BLive from './utils/blive'
import AddRoomDialog from './components/AddRoomDialog.vue'
import { only } from '/@/utils/object'
import LiveCard from './components/LiveCard.vue'
import { defaultMonitor } from './utils/data'

export default defineComponent({
  name: 'AppLive',

  components: { AddRoomDialog, LiveCard },

  setup() {
    const monitors = useLocalStorage(
      'MY_LIVE_MONITOR_LIST',
      [] as LiveMonitor[]
    )
    const liveStore = useLocalStorage('MY_LIVE_LIST', [] as LiveInfo[])
    const counter = useInterval(1000, { controls: true, immediate: false })
    return { liveStore, counter, monitors }
  },

  data() {
    return {
      loading: false,
      list: [] as LiveInfo[],
      isDisplayAddRoomDialog: false,
      coverType: 'keyframe'
    }
  },

  computed: {
    downCounter(): number {
      return 60 - this.counter.counter.value
    },

    sortedList(): LiveInfo[] {
      return [...this.list].sort((a, b) => {
        const aStatus = a.live_status || 99
        const bStatus = b.live_status || 99
        return aStatus > bStatus ? 1 : -1
      })
    }
  },

  watch: {
    downCounter(downCounter: number) {
      if (downCounter <= 0) {
        this.updateRoomStatus()
      }
    },

    loading(loading: boolean) {
      if (!loading) {
        this.counter.counter.value = 0
        this.counter.resume()
      } else {
        this.counter.pause()
      }
    }
  },

  created() {
    this.updateRoomStatus()
  },

  methods: {
    async updateRoomStatus() {
      this.loading = true
      const list = this.liveStore.map(item => ({ ...item }))
      const uids = list.map(item => item.uid)
      if (!uids.length) {
        return
      }
      const data = await BLive.getRoomStatusByUids(uids)
      list.forEach(item => {
        const roomStatus = data[item.uid]
        Object.assign(item, roomStatus)
      })

      this.list = list
      this.loading = false
    },

    handleRoomAdd(room: LiveInfo) {
      const data = only(room, 'uname uid room_id short_id') as LiveInfo
      this.liveStore.push(data)
      this.updateRoomStatus()
    },

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
    },

    handleRoomEnter(room: LiveInfo) {
      openVueView(
        {
          name: 'SingleLiveRoom',
          query: { uid: room.uid },
          params: { id: room.room_id }
        },
        { minWidth: 854, minHeight: 480 }
      )
    }
  }
})
</script>

<style lang="scss">
.app-live {
  height: 100%;
  > header {
    padding: 0 12px;
    display: flex;
    height: 48px;
    align-items: center;
    justify-content: space-between;
  }
  > main {
    padding-left: 12px;
    height: calc(100% - 48px);
    box-sizing: border-box;
    overflow-y: auto;
  }
}
</style>
