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
      <a-card v-for="item of list"
        :key="item.id"
        class="live-card"
        :body-style="{padding:0}"
        @click="gotoLiveRoom(item.room_id)">
        <acg-ratio-div :ratio="[16,9]">
          <div class="room-info">
            <div class="uname">
              <a-badge :status="!item.live_status?'danger':'success'"
                :text="item.uname" />
            </div>
          </div>
          <img :src="item[coverType]"
            :class="{'filter-gray': !item.live_status}"
            loading="lazy">
        </acg-ratio-div>
      </a-card>
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

export default defineComponent({
  name: 'AppLive',

  components: { AddRoomDialog },

  setup() {
    const liveStore = useLocalStorage(
      'MY_LIVE_LIST',
      [] as Record<string, any>[]
    )
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
      this.list = this.liveStore.map(item => ({ ...item }))
      const uids = this.list.map(item => item.uid)
      const data = await BLive.getRoomStatusByUids(uids)
      this.list.forEach(item => {
        const roomStatus = data[item.uid]
        Object.assign(item, roomStatus)
      })
      this.loading = false
    },

    handleRoomAdd(list: Record<string, any>[]) {
      const data = list.map(item => only(item, 'uname uid room_id short_id'))
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

  .live-card {
    display: inline-block;
    cursor: pointer;
    margin-right: 12px;
    margin-bottom: 12px;
    width: calc(20% - 12px);
    box-sizing: border-box;

    .room-info {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;

      .uname {
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 2px 6px;
        width: 100%;
        background: linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.6) 0,
          rgba(0, 0, 0, 0)
        );
        box-sizing: border-box;

        .arco-badge-status-text {
          color: #ffffff;
          text-shadow: 1px 1px 3px #000000;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
