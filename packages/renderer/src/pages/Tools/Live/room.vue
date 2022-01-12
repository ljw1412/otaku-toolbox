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
    <div class="player">
      <video ref="videoEl"
        autoplay></video>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import * as BLive from './utils/blive'
import Hls from 'hls.js'

export default defineComponent({
  name: 'LiveRoom',

  props: {
    id: { type: String, default: '' }
  },

  setup() {
    const videoEl = ref<HTMLMediaElement>()
    return { videoEl }
  },

  data() {
    return {
      hls: new Hls(),
      streamer: { face: '', uname: '主播' },
      url: '',
      info: { live_status: -1 }
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

    async initLive() {
      await this.getRoomInfo()
      this.loadLive()
    },

    async loadLive() {
      if (Hls.isSupported() && this.videoEl) {
        this.hls.loadSource(this.url)
        this.hls.attachMedia(this.videoEl)
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
  .status {
    position: absolute;
    top: 100px;
    left: 0;
    width: 100%;
    font-size: 48px;
    text-align: center;
  }

  .player {
    width: 100%;
    height: 100%;
    background-color: #000;
    video {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
