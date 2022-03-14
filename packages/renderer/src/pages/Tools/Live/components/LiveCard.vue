<template>
  <a-card
    class="live-card"
    :class="{ 'not-living': info.live_status !== 1 }"
    :body-style="{ padding: 0 }"
    draggable="true"
    @dragstart="handleDragStart"
    @click="gotoLiveRoom"
  >
    <acg-ratio-div :ratio="[16, 9]">
      <div class="room-info">
        <div class="status">
          <a-badge :status="badgeStatus" :text="statusStr" />
        </div>
        <div class="uname">
          <a-avatar v-if="info.face" :size="28">
            <img :src="info.face" />
          </a-avatar>
          <span class="ml-4">{{ info.uname }}</span>
        </div>
      </div>
      <img class="cover" :src="info[coverType]" loading="lazy" />
    </acg-ratio-div>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'LiveCard',

  props: {
    coverType: {
      type: String as PropType<'cover_from_user' | 'keyframe'>,
      default: 'keyframe'
    },
    info: { type: Object as PropType<LiveInfo>, default: () => ({}) }
  },

  computed: {
    statusStr() {
      if (this.info.live_status === 0) {
        return '未开播'
      } else if (this.info.live_status === 2) {
        return '轮播中'
      }
      return '直播中'
    },

    badgeStatus() {
      if (this.info.live_status === 1) {
        return 'success'
      } else if (this.info.live_status === 2) {
        return 'warning'
      }
      return 'danger'
    }
  },

  methods: {
    gotoLiveRoom() {
      this.$API.Electron.win.openVue(
        {
          name: 'SingleLiveRoom',
          query: { uid: this.info.uid },
          params: { id: this.info.room_id }
        },
        { minWidth: 854, minHeight: 480 }
      )
    },

    handleDragStart(event: DragEvent) {
      event.dataTransfer?.setData('Room', JSON.stringify(this.info))
    }
  }
})
</script>

<style lang="scss">
.live-card {
  display: inline-block;
  cursor: pointer;
  margin-right: 12px;
  margin-bottom: 12px;
  width: calc(20% - 12px);
  box-sizing: border-box;
  overflow: hidden;

  .room-info {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    color: #ffffff;
    text-shadow: 1px 1px 3px #000000;

    .status {
      position: absolute;
      bottom: 0;
      left: 4px;

      .arco-badge-status-text {
        color: inherit;
      }
    }

    .uname {
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      padding: 4px 6px;
      width: 100%;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0) 0);
      box-sizing: border-box;
      font-size: 24px;
    }
  }

  &.not-living {
    .cover {
      filter: grayscale(100%) blur(2px);
    }
    .status {
      bottom: 50%;
      left: calc(50% - 8px);
      transform: translate(-50%, 50%);
      .arco-badge-status-text {
        font-size: 20px;
      }
    }
  }
}
</style>
