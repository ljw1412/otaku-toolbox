<template>
  <div class="app-live">
    <header>
      <a-space>
        <a-button type="primary"
          @click="isDisplayAddRoomDialog = true">添加直播间</a-button>
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
      <live-card v-for="item of list"
        :key="item.id"
        :info="item"
        :cover-type="coverType"></live-card>
    </main>

    <add-room-dialog v-model="isDisplayAddRoomDialog"
      @add="handleRoomAdd"></add-room-dialog>
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

export default defineComponent({
  name: 'AppLive',

  components: { AddRoomDialog, LiveCard },

  setup() {
    const liveStore = useLocalStorage('MY_LIVE_LIST', [] as LiveInfo[])
    const counter = useInterval(1000, { controls: true, immediate: false })
    return { liveStore, counter }
  },

  data() {
    return {
      loading: false,
      list: [] as Record<string, any>[],
      isDisplayAddRoomDialog: false,
      coverType: 'keyframe'
    }
  },

  computed: {
    downCounter(): number {
      return 60 - this.counter.counter.value
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
    gotoLiveRoom(id: number) {
      openVueView(
        { name: 'LiveRoom', params: { id: id } },
        { minWidth: 854, minHeight: 480 }
      )
    },

    async updateRoomStatus() {
      this.loading = true
      const list = this.liveStore.map(item => ({ ...item }))
      const uids = list.map(item => item.uid)
      const data = await BLive.getRoomStatusByUids(uids)
      list.forEach(item => {
        const roomStatus = data[item.uid]
        Object.assign(item, roomStatus)
      })

      this.list = list
      this.loading = false
    },

    handleRoomAdd(list: LiveInfo[]) {
      const data = list.map(item =>
        only(item, 'uname uid room_id short_id')
      ) as LiveInfo[]
      this.liveStore.push(...data)
      this.updateRoomStatus()
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
