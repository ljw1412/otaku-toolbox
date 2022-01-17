<template>
  <div ref="LiveRoomEl"
    class="live-room"
    :style="roomStyle">

    <div class="live-container">
      <div ref="livePlayerEl"
        class="live-player"></div>
      <div v-if="!isLiving"
        class="status">
        <div class="streamer">
          <a-avatar style="width:2em; height:2em; font-size:2em;">
            <img v-if="streamer.face"
              :src="streamer.face">
            <span v-else>{{ streamer.uname }}</span>
          </a-avatar>
        </div>
        <div class="not-living mt-10">主播还未开播哦</div>
      </div>
      <div v-if="!hideHeader"
        class="room-header">
        <div class="title">[{{ streamer.uname }}] {{ streamer.title }}</div>
        <div class="extra">
          <a-tooltip content="版聊"
            position="br">
            <icon-nav style="font-size: 20px;"
              class="cursor-pointer"
              :class="{'board-active': config.danmaku.showBoard}"
              @click="toggleDisplayBoard" />
          </a-tooltip>
        </div>
      </div>
    </div>

    <div class="helper">
      <live-aside :config="config.danmaku"
        :online="onlineStr"
        :streamer="streamer"
        :list="danmakuList"
        @state-change="handleBoardStateChange"></live-aside>
      <danmaku-board :config="config.danmaku"
        :online="onlineStr"
        :streamer="streamer"
        :list="danmakuList"
        :room-el="$refs.LiveRoomEl"
        :max-height="roomSize.height"
        @state-change="handleBoardStateChange"></danmaku-board>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import * as BLive from '../utils/blive'
import connectLiveWs, { KeepLiveWS } from '../utils/bliveWs'
import Player from 'xgplayer'
import HlsPlayer from 'xgplayer-hls.js'
// import installPlayerPlugins from '../plugins/index'
import DanmakuBoard from './DanmakuBoard.vue'
import LiveAside from './LiveAside.vue'
import { toReactive, useElementSize } from '@vueuse/core'

const units = ['', '万', '亿']

export default defineComponent({
  name: 'LiveRoom',

  components: { LiveAside, DanmakuBoard },

  props: {
    config: {
      type: Object as PropType<LiveRoomConfig>,
      default: () => ({})
    },
    hideHeader: Boolean,
    monitorId: { type: [String, Number], default: '' },
    keyId: { type: Number, default: -1 },
    roomId: { type: [Number, String], default: '' }
  },

  emits: ['status-change'],

  setup() {
    const LiveRoomEl = ref(null)
    const roomSize = useElementSize(LiveRoomEl)

    const roomStyle = computed(() => {
      const { width, height } = roomSize
      const size = Math.min(
        (width.value / 1280) * 100,
        (height.value / 720) * 100,
        100
      )

      return { fontSize: size + 'px' }
    })

    return { LiveRoomEl, roomSize: toReactive(roomSize), roomStyle }
  },

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
      return this.info.live_status === 1
    },

    onlineStr() {
      let online = this.online
      let i = 0
      while (online >= 10000) {
        online = online / 10000
        i++
      }
      return online.toFixed(i ? 1 : 0) + units[i]
    }
  },

  mounted() {
    this.initLive()
  },

  beforeUnmount() {
    if (this.player) {
      this.player.destroy()
    }

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
      if (!this.isLiving) {
        this.url = ''
        return
      }
      const { base_url, url_info } = roomInfo.stream.http_hls.ts[0]
      const urls = url_info.map(
        (item: any) => `${item.host}${base_url}${item.extra}`
      )
      this.url = urls[0] || ''
    },

    toggleDisplayBoard() {
      this.config.danmaku.showBoard = !this.config.danmaku.showBoard
    },

    handleBoardStateChange(state: 'aside' | 'board') {
      if (state === 'aside') {
        this.config.danmaku.aside = true
        this.config.danmaku.showBoard = false
      } else if (state === 'board') {
        this.config.danmaku.aside = false
        this.config.danmaku.showBoard = true
      }
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
      // TODO: 修复点击刷新后，再点击屏幕中的刷新可能会加载两个
      // installPlayerPlugins(HlsPlayer)
      // @ts-ignore
      this.player = new HlsPlayer({
        lang: 'zh-cn',
        el: this.$refs.livePlayerEl,
        url: this.url,
        autoplay: true,
        width: '100%',
        height: '100%',
        volume: this.config.volume,
        closeVideoClick: true,
        danmu: {
          area: {
            //弹幕显示区域
            start: 0, //区域顶部到播放器顶部所占播放器高度的比例
            end: 0.4 //区域底部到播放器顶部所占播放器高度的比例
          },
          live: true,
          defaultOff: false //开启此项后弹幕不会初始化，默认初始化弹幕
        }
      })
      if (this.player) {
        this.player.on('volumechange', (player: Player) => {
          // eslint-disable-next-line vue/no-mutating-props
          this.config.volume = player.volume
        })
      }
    }
  }
})
</script>

<style lang="scss">
.live-room {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  color: #ffffff;
  background-color: #2a2a2b;

  .status {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
    font-size: 0.48em;
    text-align: center;
  }

  .room-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 48px;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
    background-image: linear-gradient(
      0deg,
      transparent,
      rgba(0, 0, 0, 0.37),
      rgba(0, 0, 0, 0.75),
      rgba(0, 0, 0, 0.75)
    );
    display: none;
    font-size: 16px;

    .title {
      padding-left: 12px;
    }

    .extra {
      padding-right: 12px;
    }
  }

  .board-active {
    color: #f85959;
  }

  .live-container {
    position: relative;
    flex-grow: 1;
    width: 100%;
    height: 100%;
  }

  .helper {
    flex-shrink: 0;
  }

  #live-player {
    width: 100%;
    height: 100%;
    background-color: #000;
    order: 2;

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
