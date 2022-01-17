<template>
  <div v-if="!$route.meta.isMulti"
    class="live-aside-board">

    <div v-show="!config.showBoard"
      class="toggle-btn-container">
      <div class="toggle-btn cursor-pointer"
        @click="config.aside = !config.aside">
        <component :is="config.aside?'icon-right':'icon-left'"></component>
      </div>
    </div>

    <div v-show="config.aside"
      class="aside-container">
      <div title="切换版聊模式"
        class="btn-toggle-board cursor-pointer"
        @click="$emit('state-change', 'board')">
        <icon-menu-fold class="btn-fold" />
      </div>

      <div class="info px-6">
        <a-avatar :size="36"
          v-tooltip.bottom="streamer.uname"
          class="flex-shrink-0">
          <img v-if="streamer.face"
            :src="streamer.face">
          <span v-else>{{ streamer.uname }}</span>
        </a-avatar>
        <div class="title px-4 flex-grow-1">
          <div class="w-100 text-truncate mb-2 font-weight-bold"
            :title="streamer.title">{{ streamer.title }}</div>
          <a-space>
            <a-tag size="small"
              color="orange">{{ streamer.area_v2_name }}</a-tag>
            <div title="房间号">
              <icon-live-broadcast />
              <span class="pl-2 fs-12">{{ streamer.room_id }}</span>
            </div>
            <div title="人气值">
              <icon-fire />
              <span class="pl-2 fs-12">{{ online }}</span>
            </div>
          </a-space>
        </div>
      </div>

      <danmaku-list :list="list"></danmaku-list>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import DanmakuList from './DanmakuList.vue'

export default defineComponent({
  name: 'LiveAside',

  components: {
    DanmakuList
  },

  props: {
    config: {
      type: Object as PropType<LiveRoomDanmakuConfig>,
      default: () => ({})
    },
    list: {
      type: Array as PropType<LivePlayer.BLiveMessageDanmaku[]>,
      default: () => []
    },
    streamer: { type: Object, default: () => ({}) },
    online: { type: String, default: '0' }
  }
})
</script>

<style lang="scss">
.live-aside-board {
  position: relative;
  font-size: 14px;
  height: 100%;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.1);

  .toggle-btn-container {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-100%, 0);
    height: 100%;
    width: 2px;
    background-color: var(--app-color-common);
    z-index: 150;
    opacity: 0;
    transition: opacity 0.2s;
    color: #ffffff;
    &:hover {
      opacity: 1;
    }

    .toggle-btn {
      position: absolute;
      top: 50%;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-100%, -50%);
      background-color: var(--app-color-common);
      padding: 20px 2px;
      padding-left: 4px;
      border-radius: 10px 0 0 10px;
      font-size: 20px;
    }
  }

  .aside-container {
    height: 100%;
    width: 300px;
  }

  .btn-toggle-board {
    position: absolute;
    left: 0;
    top: 0;
    transform: translateX(-100%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    width: 48px;
    height: 48px;
    z-index: 150;
    opacity: 0;
    transition: opacity 0.2s;
    color: #ffffff;
    &:hover {
      background-color: var(--app-color-common);
      opacity: 1;
    }
  }

  .info {
    display: flex;
    align-items: center;
    height: 54px;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid var(--color-border);
    box-sizing: border-box;

    .title {
      width: 0;
    }
  }

  .danmaku-list {
    height: calc(100% - 54px);
    padding: 4px;
  }
}
</style>
