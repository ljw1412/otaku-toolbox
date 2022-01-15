<template>
  <div ref="LiveRoomEl"
    class="live-room">
    <div v-if="!isLiving"
      class="status">
      <div class="streamer">
        <a-avatar :size="128">
          <img v-if="streamer.face"
            :src="streamer.face">
          <span v-else>{{ streamer.uname }}</span>
        </a-avatar>
      </div>
      <div class="not-living mt-10">主播还未开播哦</div>
    </div>
    <div v-if="isLiving && !hideHeader"
      class="room-header">
      <div class="title">[{{ streamer.uname }}] {{ streamer.title }}</div>
    </div>
    <div class="helper">
      <danmaku-board :online="online"
        :monitor-id="monitorId"
        :key-id="keyId"
        :list="danmakuList"
        :room-id="roomId"
        :room-el="$refs.LiveRoomEl"></danmaku-board>
    </div>
    <div ref="livePlayerEl"
      class="live-player"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as BLive from '../utils/blive'
import connectLiveWs, { KeepLiveWS } from '../utils/bliveWs'
import Player from 'xgplayer'
import HlsPlayer from 'xgplayer-hls.js'
import DanmakuBoard from './DanmakuBoard.vue'

export default defineComponent({
  name: 'LiveRoom',

  components: {
    DanmakuBoard
  },

  props: {
    hideHeader: Boolean,
    monitorId: { type: [String, Number], default: '' },
    keyId: { type: Number, default: -1 },
    roomId: { type: [Number, String], default: '' }
  },

  emits: ['status-change'],

  data() {
    return {
      player: null as null | Player,
      streamer: { face: '', uname: '主播', title: '' },
      url: '',
      info: { live_status: -1, uid: -1 },
      livews: null as null | KeepLiveWS,
      online: 0,
      danmakuList: [] as LivePlayer.BLiveMessageDanmaku[],
      maxDanmakuSize: 100
    }
  },

  computed: {
    isLiving() {
      return !!this.info.live_status
    }
  },

  mounted() {
    this.initLive()
  },

  beforeUnmount() {
    if (this.livews) {
      this.livews.close()
    }
  },

  methods: {
    async getRoomStatus(uid: string) {
      const data = await BLive.getRoomStatusByUids([uid])
      this.streamer = data[uid]
      this.$emit('status-change', data[uid])
    },

    async getRoomInfo() {
      const roomInfo = await BLive.getRoomPlayInfo(this.roomId)
      await this.getRoomStatus(roomInfo.uid)
      this.info = roomInfo
      if (!roomInfo.live_status) {
        this.url = ''
        return
      }
      const { base_url, url_info } = roomInfo.stream.http_hls.ts[0]
      const urls = url_info.map(
        (item: any) => `${item.host}${base_url}${item.extra}`
      )
      this.url = urls[0] || ''
    },

    addDanmaku(danmaku: LivePlayer.BLiveMessageDanmaku) {
      this.danmakuList.push(danmaku)
      if (this.danmakuList.length > this.maxDanmakuSize) {
        this.danmakuList.splice(0, 1)
      }
      if (this.player) {
        const playerDanmuList: LivePlayer.XGDanmaku[] = this.danmakuList.map(
          danmaku => ({
            start: 0,
            duration: 15000,
            id: danmaku.ct,
            txt: danmaku.message,
            mode: 'scroll',
            prior: true, //该条弹幕优先显示，默认false
            color: true, //该条弹幕为彩色弹幕，默认false
            style: {
              //弹幕自定义样式
              color: '#ffffff',
              fontSize: '25px',
              fontWeight: 'bold',
              textShadow:
                '1px 0 1px #000000,0 1px 1px #000000,0 -1px 1px #000000,-1px 0 1px #000000'
            }
          })
        )
        // @ts-ignore
        this.player.danmu.updateComments(playerDanmuList)
      }
    },

    async initLive() {
      await this.getRoomInfo()
      if (this.isLiving) {
        this.loadLive()
      }
      this.connectLiveWs()
    },

    async connectLiveWs() {
      this.livews = connectLiveWs(this.roomId, {
        roomUid: this.info.uid,
        on: {
          heartbeat: online => {
            this.online = online
          },
          danmu: danmaku => {
            this.addDanmaku(danmaku)
          }
        }
      })
    },

    async loadLive() {
      // @ts-ignore
      this.player = new HlsPlayer({
        lang: 'zh-cn',
        el: this.$refs.livePlayerEl,
        url: this.url,
        autoplay: true,
        width: '100%',
        height: '100%',
        closeVideoClick: true,
        danmu: {
          area: {
            //弹幕显示区域
            start: 0, //区域顶部到播放器顶部所占播放器高度的比例
            end: 0.25 //区域底部到播放器顶部所占播放器高度的比例
          },
          live: true,
          defaultOff: false //开启此项后弹幕不会初始化，默认初始化弹幕
        }
      })
    }
  }
})
</script>

<style lang="scss">
.live-room {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .status {
    position: absolute;
    top: 100px;
    left: 0;
    width: 100%;
    font-size: 48px;
    text-align: center;
  }

  .room-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 48px;
    align-items: center;
    z-index: 10;
    background-image: linear-gradient(
      0deg,
      transparent,
      rgba(0, 0, 0, 0.37),
      rgba(0, 0, 0, 0.75),
      rgba(0, 0, 0, 0.75)
    );
    display: none;
    .title {
      font-size: 16px;
      padding-left: 12px;
    }
  }

  #live-player {
    width: 100%;
    height: 100%;
    background-color: #000;

    .xgplayer-panel .xgplayer-panel-slider {
      left: -230px;
    }
  }

  &:hover {
    .room-header {
      display: flex;
    }
  }
}
</style>
