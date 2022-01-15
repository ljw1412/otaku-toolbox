<template>
  <div ref="boardEl"
    class="danmaku-board"
    :class="{'show-setting': isSetting}"
    :style="boardStyle">
    <div class="bg"
      :style="bgStyle"></div>
    <div class="info">
      <div class="d-flex align-items-center flex-shrink-0">
        <icon-settings class="cursor-pointer"
          @click="isSetting = !isSetting" />
      </div>
      <div class="d-flex align-items-center flex-shrink-0 flex-grow-1 px-4">
        <div class="info-item px-6"
          title="房间号">
          <icon-live-broadcast />
          <span class="pl-2">{{ $route.params.id }}</span>
        </div>
        <div class="info-item px-6"
          title="人气值">
          <icon-fire />
          <span class="pl-2">{{ onlineStr }}</span>
        </div>
      </div>
      <div class="d-flex align-items-center flex-shrink-0">
        <icon-menu-unfold class="cursor-pointer" />
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
    <div ref="listEl"
      class="danmaku-list">
      <div v-for="danmaku of list"
        :key="danmaku.key"
        class="danmaku-item">
        <span class="uname">{{ danmaku.uname }}：</span>
        <span class="message">{{ danmaku.message }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue'
import {
  Position,
  useDraggable,
  useLocalStorage,
  useScroll
} from '@vueuse/core'

const units = ['', '万', '亿']

export default defineComponent({
  name: 'DanmakuBoard',

  props: {
    online: { type: Number, default: 0 },
    list: {
      type: Array as PropType<Record<string, any>>,
      default: () => []
    }
  },

  setup() {
    const config = useLocalStorage('DANMAKU_BOARD_CONFIG', {
      bg: '#000000',
      opacity: 50,
      blur: 2,
      x: 0,
      y: 240
    })

    const boardEl = ref<HTMLElement | null>(null)
    const settingEl = ref<HTMLElement | null>(null)
    // @ts-ignore
    const { position, style } = useDraggable(boardEl, {
      initialValue: { x: config.value.x, y: config.value.y },
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
        config.value.x = x
        config.value.y = y
      }
    })
    const listEl = ref<HTMLElement | null>(null)
    // @ts-ignore
    const { isScrolling, arrivedState, directions } = useScroll(listEl)
    arrivedState.bottom = true

    function checkPosition(position: Position) {
      if (boardEl.value) {
        const { x, y } = position
        const boardWidth = boardEl.value.offsetWidth
        const boardHeight = boardEl.value.offsetHeight
        const maxX = window.innerWidth - boardWidth
        const maxY = window.innerHeight - boardHeight
        position.x = Math.max(Math.min(x, maxX), 0)
        position.y = Math.max(Math.min(y, maxY), 40)
      }
    }
    window.addEventListener('resize', () => {
      checkPosition(position.value)
    })

    onMounted(() => {
      checkPosition(position.value)
    })

    return {
      boardEl,
      settingEl,
      listEl,
      style,
      isScrolling,
      arrivedState,
      directions,
      config
    }
  },

  data() {
    return {
      isSetting: false,
      bgColorList: ['#000000', '#ffffff'],
      scrollBottomLocked: true
    }
  },

  computed: {
    onlineStr() {
      let online = this.online
      let i = 0
      while (online >= 10000) {
        online = online / 10000
        i++
      }
      return online.toFixed(i ? 1 : 0) + units[i]
    },
    boardStyle() {
      return [
        this.style,
        {
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

  watch: {
    isScrolling(isScrolling: boolean) {
      if (!isScrolling) {
        this.scrollBottomLocked = this.arrivedState.bottom
      }
    },

    list: {
      deep: true,
      handler() {
        if (!this.isScrolling && this.scrollBottomLocked) {
          this.$nextTick(() => {
            this.listEl && this.listEl.scrollTo({ top: 999999 })
          })
        }
      }
    }
  }
})
</script>

<style lang="scss">
.danmaku-board {
  position: fixed;
  width: 300px;
  height: 400px;
  color: #ffffff;
  box-sizing: border-box;
  border: 2px solid transparent;
  transition: border-color 0.3s;
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
    overflow-y: auto;

    .danmaku-item {
      padding: 5px;
      text-shadow: 1px 0 1px #000000, 0 1px 1px #000000, 0 -1px 1px #000000,
        -1px 0 1px #000000;
      .uname {
        color: #aaaaaa;
      }
    }
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
    border-color: rgba(255, 255, 255, 0.15);
  }
}
</style>
