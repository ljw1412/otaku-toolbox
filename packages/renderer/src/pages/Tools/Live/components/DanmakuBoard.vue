<template>
  <div v-show="config.showBoard"
    ref="boardEl"
    class="danmaku-board"
    :class="{'show-setting': isSetting}"
    :style="boardStyle">
    <div class="bg"
      :style="bgStyle"></div>
    <div class="info">
      <div class="d-flex align-items-center flex-shrink-0 mr-8">
        <icon-settings class="cursor-pointer"
          @click="isSetting = !isSetting" />
      </div>
      <a-space size="mini"
        class="flex-grow-1">
        <div class="info-item"
          title="房间号">
          <icon-live-broadcast />
          <span class="pl-2">{{ streamer.room_id }}</span>
        </div>
        <div class="info-item"
          title="人气值">
          <icon-fire />
          <span class="pl-2">{{ online }}</span>
        </div>
      </a-space>

      <div class="d-flex align-items-center flex-shrink-0">
        <icon-menu-unfold v-if="!$route.meta.isMulti"
          class="cursor-pointer"
          @click="$emit('state-change', 'aside')" />
        <icon-close v-else
          class="cursor-pointer"
          @click="config.showBoard = false" />
      </div>
    </div>
    <div v-show="isSetting"
      ref="settingEl"
      class="setting">
      <div class="setting-option py-6">
        <span class="d-inline-block mr-4">背景色</span>
        <span v-for="item of bgColorList"
          :key="item"
          class="d-inline-block bg-color-item mr-2 cursor-pointer"
          :style="{backgroundColor:item, width:'1em', height: '1em'}"
          @click="config.bg = item"></span>
      </div>
      <div class="setting-option py-6">
        <span class="d-inline-block mr-4">透明度</span>
        <span class="d-inline-block mr-6"
          style="width: 36px">{{ config.opacity }}%</span>
        <a-slider v-model="config.opacity"
          :style="{ width: '180px' }"
          :format-tooltip="(value)=>`${value}%`" />
      </div>
      <div class="setting-option py-6">
        <span class="d-inline-block mr-4">虚化量</span>
        <span class="d-inline-block mr-6"
          style="width: 36px">{{ config.blur }}px</span>
        <a-slider v-model="config.blur"
          :style="{ width: '180px' }"
          :max="10"
          :format-tooltip="(value)=>`${value}px`" />
      </div>
    </div>
    <danmaku-list :list="list"
      text-shadow></danmaku-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue'
import { Position, useDraggable } from '@vueuse/core'
import DanmakuList from './DanmakuList.vue'

export default defineComponent({
  name: 'DanmakuBoard',

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
    online: { type: String, default: '0' },
    roomEl: { type: Object as PropType<HTMLElement | null>, default: null },
    maxHeight: Number
  },

  emits: ['state-change'],

  setup(props, ctx) {
    const boardEl = ref<HTMLElement | null>(null)
    const settingEl = ref<HTMLElement | null>(null)
    // @ts-ignore
    const { position, style } = useDraggable(boardEl, {
      initialValue: { x: props.config.x, y: props.config.y },
      onStart: (position: Position, event: PointerEvent) => {
        if (
          settingEl.value &&
          settingEl.value.contains(event.target as HTMLElement)
        ) {
          return false
        }
      },
      onMove: (position: Position, event: PointerEvent) => {
        checkPosition(position)
      },
      onEnd: (position: Position) => {
        const { x, y } = position
        props.config.x = x
        props.config.y = y
      }
    })

    function checkPosition(position: Position) {
      if (props.roomEl && boardEl.value) {
        const { x, y } = position
        const boardWidth = boardEl.value.offsetWidth
        const boardHeight = boardEl.value.offsetHeight
        const roomRect = props.roomEl.getBoundingClientRect()

        const maxX = roomRect.width + roomRect.left - boardWidth
        const maxY = roomRect.height + roomRect.top - boardHeight
        position.x = Math.max(Math.min(x, maxX), roomRect.left)
        position.y = Math.max(Math.min(y, maxY), roomRect.top)
      }
    }
    window.addEventListener('resize', () => {
      checkPosition(position.value)
    })

    const init = () => {
      if (!props.roomEl) {
        setTimeout(init, 500)
        return
      }
      checkPosition(position.value)
    }

    onMounted(() => {
      init()
    })

    return { boardEl, settingEl, style }
  },

  data() {
    return {
      isSetting: false,
      bgColorList: ['#000000', '#ffffff']
    }
  },

  computed: {
    boardStyle() {
      return [
        this.style,
        {
          maxHeight: `${this.maxHeight}px`,
          backdropFilter: `blur(${this.config.blur}px)`
        }
      ]
    },

    bgStyle() {
      return {
        backgroundColor: this.config.bg,
        opacity: this.config.opacity / 100
      }
    }
  },

  methods: {}
})
</script>

<style lang="scss">
.danmaku-board {
  position: fixed;
  width: 300px;
  height: 400px;
  max-height: 100%;
  color: #ffffff;
  box-sizing: border-box;
  transition: box-shadow 0.3s;
  overflow: hidden;
  z-index: 150;
  cursor: move;

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .info {
    display: flex;
    align-items: center;
    height: 24px;
    font-size: 16px;
    padding: 0 5px;

    .info-item {
      display: flex;
      align-items: center;
      span {
        font-size: 14px;
      }
    }
  }

  .setting {
    position: absolute;
    top: 24px;
    left: 0;
    right: var(--scroll-bar-width);
    padding: 4px 6px;
    line-height: 1;
    font-size: 14px;
    cursor: default;
    box-sizing: border-box;
    background: rgba(100, 100, 100, 0.9);
  }

  .danmaku-list {
    height: calc(100% - 24px);
  }

  &.show-setting {
    .info {
      background: rgba(100, 100, 100, 0.9);
      border-bottom: 1px solid rgba(255, 255, 255, 0.5);
      box-sizing: border-box;
    }
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 0;
    cursor: default;
  }

  &:not(:hover) {
    ::-webkit-scrollbar-thumb {
      transition: background 0.3s;
      background: transparent;
    }
  }

  &:hover {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
}
</style>
