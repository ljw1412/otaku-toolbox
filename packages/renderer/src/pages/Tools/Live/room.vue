<template>
  <div class="live-room">
    <div v-show="!isLiving"
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
    <div class="helper">
      <danmaku-board :online="online"
        :list="danmakuList"></danmaku-board>
    </div>
    <div id="live-player">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as BLive from './utils/blive'
import Player from 'xgplayer'
import HlsPlayer from 'xgplayer-hls.js'
import { KeepLiveWS } from 'bilibili-live-ws'
import DanmakuBoard from './components/DanmakuBoard.vue'

export default defineComponent({
  name: 'LiveRoom',

  components: {
    DanmakuBoard
  },

  props: {
    id: { type: String, default: '' }
  },

  data() {
    return {
      player: null as null | Player,
      streamer: { face: '', uname: '主播' },
      url: '',
      info: { live_status: -1 },
      livews: null as null | KeepLiveWS,
      online: 0,
      danmakuList: [],
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
      const { title, uname } = data[uid]
      this.$global.setTitle(`[${uname}] ${title}`)
    },

    async getRoomInfo() {
      const roomInfo = await BLive.getRoomPlayInfo(this.id)
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

    addDanmaku(danmaku: any) {
      this.danmakuList.push(danmaku)
      if (this.danmakuList.length > this.maxDanmakuSize) {
        this.danmakuList.splice(0, 1)
      }
      if (this.player) {
        const playerDanmuList = this.danmakuList.map(danmaku => ({
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
        }))
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
      this.livews = new KeepLiveWS(parseInt(this.id))
      this.livews.on('open', () => {
        console.log('已连接直播弹幕服务器')
        // addInfoDanmaku('已连接直播弹幕服务器');
      })
      this.livews.on('live', () => {
        console.log('已连接直播间', this.id)
        // addInfoDanmaku(`已连接直播间 ${props.room}`);
      })
      this.livews.on('close', () => console.log('已断开与直播弹幕服务器的连接'))
      this.livews.on('heartbeat', online => {
        this.online = online
        console.log('当前人气值', online)
      })
      this.livews.on(
        'DANMU_MSG',
        ({
          info: [
            ,
            message,
            [uid, uname, isOwner /*, isVip, isSvip*/],
            ,
            ,
            ,
            ,
            ,
            ,
            { ts, ct }
          ]
        }) => {
          const danmaku = {
            type: 'message',
            uid,
            uname,
            message,
            ts,
            ct,
            isAnchor: uid === this.$route.query.uid,
            isOwner: !!isOwner
          }
          console.log(danmaku)
          this.addDanmaku(danmaku)
        }
      )
    },

    async loadLive() {
      this.player = new HlsPlayer({
        lang: 'zh-cn',
        id: 'live-player',
        url: this.url,
        autoplay: true,
        width: '100%',
        height: '100%',
        closeVideoClick: true,
        danmu: {
          area: {
            //弹幕显示区域
            start: 0, //区域顶部到播放器顶部所占播放器高度的比例
            end: 1 //区域底部到播放器顶部所占播放器高度的比例
          },
          live: true,
          defaultOff: false
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

  #live-player {
    width: 100%;
    height: 100%;
    background-color: #000;
  }
}
</style>
