<template>
  <div ref="LiveRoomEl"
    class="live-room"
    :class="{'is-hovered': isRoomHovered}"
    :style="roomStyle">

    <div class="live-container"
      @contextmenu="handleDisplayContextMenu">
      <div v-if="isLiving"
        class="state-mark">
        <div v-show="isMuted"
          class="mute">M</div>
      </div>
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
        <div class="title pl-12"
          :title="`[${streamer.uname}] ${streamer.title}`">
          <div class="text-truncate">{{ streamer.title }}</div>
          <div class="fs-12">
            <span class="fs-12">{{ streamer.uname }}</span>
          </div>
        </div>
        <div class="extra flex-shrink-0 pl-4 pr-12">
          <icon-nav v-tooltip.bottom="'版聊'"
            style="font-size: 20px;"
            class="cursor-pointer"
            :class="{'board-active': config.danmaku.showBoard}"
            @click="toggleDisplayBoard" />
          <icon-close v-if="$route.meta.isMulti"
            v-tooltip.bottom="'关闭'"
            style="font-size: 20px;"
            class="cursor-pointer ml-8"
            @click="$emit('close')" />
        </div>
      </div>
      <!-- 截图预览 -->
      <screen-shot-preview v-model="screenShotUrl"></screen-shot-preview>
    </div>

    <teleport to="body">
      <app-context-menu v-model:visible="contextMenu.isDisplay"
        :menus="contextMenu.list"
        v-bind="contextMenu.position"
        @menu-item-click="handleMenuItemClick"></app-context-menu>
    </teleport>

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
        :max-width="roomSize.width"
        :max-height="roomSize.height"
        @state-change="handleBoardStateChange"></danmaku-board>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import {
  onKeyStroke,
  toReactive,
  useElementHover,
  useElementSize,
  useEventListener
} from '@vueuse/core'
import connectLiveWs, { KeepLiveWS } from '../utils/bliveWs'
import * as BLive from '../utils/blive'
import Player from 'xgplayer'
import HlsPlayer from 'xgplayer-hls.js'
import installPlayerPlugins from '../plugins/index'
import DanmakuBoard from './DanmakuBoard.vue'
import LiveAside from './LiveAside.vue'
import ScreenShotPreview from './ScreenShotPreview.vue'

const units = ['', '万', '亿']

export default defineComponent({
  name: 'LiveRoom',

  components: { LiveAside, DanmakuBoard, ScreenShotPreview },

  props: {
    config: {
      type: Object as PropType<LiveRoomConfig>,
      default: () => ({})
    },
    hideHeader: Boolean,
    roomId: { type: [Number, String], default: '' }
  },

  emits: ['status-change', 'close'],

  setup() {
    const LiveRoomEl = ref()
    const isRoomHovered = useElementHover(LiveRoomEl)
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

    return {
      LiveRoomEl,
      isRoomHovered,
      roomSize: toReactive(roomSize),
      roomStyle
    }
  },

  data() {
    return {
      player: null as null | Player,
      savedVolume: 1,
      streamer: {
        face: '',
        uname: '主播',
        title: '',
        keyframe: '',
        live_time: 0
      },
      url: '',
      info: {
        live_status: -1,
        uid: -1,
        qnDesc: [] as Record<string, any>[],
        stream: [] as Record<string, any>[]
      },
      livews: null as null | KeepLiveWS,
      online: 0,
      danmakuList: [] as LivePlayer.BLiveMessageDanmaku[],
      maxDanmakuSize: 100,
      screenShotUrl: '',
      contextMenu: {
        isDisplay: false,
        position: { left: 0, top: 0 },
        list: [
          { name: '刷新', icon: 'icon-refresh', action: 'reload' },
          { name: '切换画质', icon: 'icon-desktop', action: '', list: [] }
        ]
      }
    }
  },

  computed: {
    isLiving() {
      return this.info.live_status === 1
    },

    isMuted() {
      return !this.config.volume
    },

    onlineStr() {
      let online = this.online
      let i = 0
      while (online >= 10000) {
        online = online / 10000
        i++
      }
      return online.toFixed(i ? 1 : 0) + units[i]
    },

    qn: {
      get() {
        return this.config.qn || 150
      },
      set(val: number) {
        this.config.qn = val
      }
    }
  },

  mounted() {
    this.initLive()
    useEventListener(window, 'contextmenu', e => {
      if (this.contextMenu.isDisplay) {
        this.contextMenu.isDisplay = false
      }
    })

    onKeyStroke(['m', 'M'], e => {
      if (this.player && this.isRoomHovered) {
        this.player.muted = !this.player.muted
        this.toggleMute(this.player.muted)
      }
    })
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
      this.info.live_status = roomInfo.live_status
      this.info.uid = roomInfo.uid
      await this.getRoomStatus(roomInfo.uid)
    },

    async getPlayerUrl() {
      const { durl, qnDesc, current_qn } = await BLive.getLiveRoomPlayUrl(
        this.roomId,
        this.qn
      )
      this.url = durl[0].url
      const qnItem = qnDesc.find(
        (item: { qn: number }) => item.qn === current_qn
      )
      if (qnItem) qnItem.url = this.url
      this.info.stream = durl
      this.info.qnDesc = qnDesc
      this.contextMenu.list[1].list = qnDesc.map((item: { name: string }) => ({
        name: item.name,
        action: `qn-${item.name}`,
        status: qnItem === item ? 'success' : undefined
      }))
    },

    toggleMute(mute: boolean) {
      if (!this.player) return
      if (mute) {
        this.savedVolume = this.player.volume
        this.player.volume = 0
      } else {
        this.player.volume = this.savedVolume || 1
      }
    },

    toggleDisplayBoard() {
      this.config.danmaku.showBoard = !this.config.danmaku.showBoard
    },

    handleDisplayContextMenu(ev: MouseEvent) {
      this.contextMenu.position.left = ev.clientX
      this.contextMenu.position.top = ev.clientY

      setTimeout(() => {
        this.contextMenu.isDisplay = true
      }, 100)
    },

    async handleMenuItemClick(action: string) {
      if (action === 'reload') {
        if (this.player) {
          this.player.destroy()
          this.loadLive()
        }
      } else if (action.startsWith('qn-')) {
        const [, name] = action.split('-')
        const qnItem = this.info.qnDesc.find(item => item.name === name)
        if (qnItem) {
          this.qn = qnItem.qn
          await this.getPlayerUrl()
        }
        if (this.player) {
          this.player.src = this.url
          this.player.emit('resourceReady', this.info.qnDesc)
        }
      }
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
        const playerDanmuList: LivePlayer.XGDanmaku[] = [
          {
            start: 0,
            duration: 10000,
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
          }
        ]
        // @ts-ignore
        this.player.danmu.updateComments(playerDanmuList, false)
      }
    },

    async initLive() {
      await this.getRoomInfo()
      if (this.isLiving) {
        await this.getPlayerUrl()
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
      installPlayerPlugins(HlsPlayer)
      // @ts-ignore
      this.player = new HlsPlayer({
        lang: 'zh-cn',
        el: this.$refs.livePlayerEl,
        url: this.url,
        poster: this.streamer.keyframe,
        autoplay: true,
        width: '100%',
        height: '100%',
        volume: this.config.volume,
        closeVideoClick: true,
        definitionActive: 'hover',
        liveTime: this.streamer.live_time,
        danmu: {
          comments: [],
          area: {
            //弹幕显示区域
            start: 0, //区域顶部到播放器顶部所占播放器高度的比例
            end: 0.4 //区域底部到播放器顶部所占播放器高度的比例
          },
          live: true,
          defaultOff: false //开启此项后弹幕不会初始化，默认初始化弹幕
        },
        screenShot: {
          saveImg: false,
          quality: 0.92,
          type: 'image/png',
          format: '.png'
        }
      })

      if (this.player) {
        this.player.on('volumechange', (player: Player) => {
          // eslint-disable-next-line vue/no-mutating-props
          this.config.volume = player.volume
        })
        this.player.on('screenShot', (data: string) => {
          this.screenShotUrl = data
        })
        this.player.on('definitionChange', async data => {
          const qnItem = this.info.qnDesc.find(item => item.name === data.to)
          if (qnItem) {
            this.qn = qnItem.qn
            await this.getPlayerUrl()
          }
          this.player && (this.player.src = this.url)
        })

        this.player.emit('resourceReady', this.info.qnDesc)
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
    z-index: 150;
    background-image: linear-gradient(
      0deg,
      transparent,
      rgba(0, 0, 0, 0.37),
      rgba(0, 0, 0, 0.75),
      rgba(0, 0, 0, 0.75)
    );
    display: none;
    font-size: 16px;
  }

  .board-active {
    color: #f85959;
  }

  .live-container {
    position: relative;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    background-color: #000000;
  }

  .helper {
    flex-shrink: 0;
  }

  .live-player {
    width: 100%;
    height: 100%;
    background-color: #000;
    order: 2;

    .xgplayer-panel .xgplayer-panel-slider {
      left: -230px;
    }

    .xgplayer-volume {
      order: 1;
    }

    .xgplayer-live {
      display: none !important;
    }
  }

  .state-mark {
    position: absolute;
    z-index: 200;
    font-size: 16px;
    color: var(--app-color-common);
    text-shadow: 1px 0 1px #000000, 0 1px 1px #000000, 0 -1px 1px #000000,
      -1px 0 1px #000000;
    user-select: none;
  }

  &:hover {
    .room-header {
      display: flex;
    }
  }
}
</style>
