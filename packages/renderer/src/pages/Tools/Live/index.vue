<template>
  <div class="app-live">
    <header>
      <a-space>
        <a-button type="primary"
          @click="isDisplayAddRoomDialog = true">搜索直播间</a-button>
        <live-monitor-list></live-monitor-list>
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
        :cover-type="coverType"
        @mousedown.right="handleLiveCardRightMouseDown(item,$event)"></live-card>
      <live-card-context-menu v-model:visible="liveRoomContextMenu.isDisplay"
        v-bind="liveRoomContextMenu.position"
        @menu-item-click="handleMenuItemClick"></live-card-context-menu>
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
import { only } from '/@/utils/object'
import AddRoomDialog from './components/AddRoomDialog.vue'
import LiveCard from './components/LiveCard.vue'
import LiveCardContextMenu from './components/LiveCardContextMenu.vue'
import LiveMonitorList from './components/LiveMonitorList.vue'

export default defineComponent({
  name: 'AppLive',

  components: { AddRoomDialog, LiveCard, LiveCardContextMenu, LiveMonitorList },

  setup() {
    const liveStore = useLocalStorage('MY_LIVE_LIST', [] as LiveInfo[])
    const counter = useInterval(1000, { controls: true, immediate: false })
    return { liveStore, counter }
  },

  data() {
    return {
      loading: false,
      isDisplayAddRoomDialog: false,
      coverType: 'keyframe',
      list: [] as LiveInfo[],
      liveRoomContextMenu: {
        isDisplay: false,
        position: { left: 0, top: 0 },
        liveRoom: {} as LiveInfo
      }
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

    handleLiveCardRightMouseDown(room: LiveInfo, ev: MouseEvent) {
      this.liveRoomContextMenu.liveRoom = room
      this.liveRoomContextMenu.position.left = ev.clientX
      this.liveRoomContextMenu.position.top = ev.clientY - 40
      this.liveRoomContextMenu.isDisplay = true
    },

    handleMenuItemClick(action: string) {
      if (action === 'enter') {
        this.handleRoomEnter(this.liveRoomContextMenu.liveRoom)
      } else if (action === 'delete') {
        const i = this.liveStore.findIndex(
          item => item.room_id === this.liveRoomContextMenu.liveRoom.room_id
        )
        if (i > -1) {
          this.liveStore.splice(i, 1)
          this.updateRoomStatus()
        }
      }
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
