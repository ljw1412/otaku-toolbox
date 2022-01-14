<template>
  <div ref="boardEl"
    class="danmaku-board"
    :style="style">
    <div class="info">
      <div>房间号:{{ $route.params.id }}</div>
      <div class="ml-6">人气值:{{ online }}</div>
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
import { defineComponent, PropType, ref } from 'vue'
import { Position, useDraggable, useScroll } from '@vueuse/core'

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
    const boardEl = ref<HTMLElement | null>(null)
    const { position, style } = useDraggable(boardEl, {
      initialValue: { x: 40, y: 40 },
      onMove: (position: Position, event: PointerEvent) => {
        checkPosition(position)
      }
    })
    const listEl = ref<HTMLElement | null>(null)
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

    return {
      boardEl,
      listEl,
      style,
      isScrolling,
      arrivedState,
      directions
    }
  },

  watch: {
    list: {
      deep: true,
      handler() {
        console.log(this.list.length)
        if (this.listEl && this.arrivedState.bottom) {
          this.listEl.scrollTo({ top: 999999 })
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

  .info {
    display: flex;
    align-items: center;
    height: 24px;
    font-size: 16px;
    text-shadow: 1px 1px 3px #333333;
    padding-left: 5px;
  }

  .danmaku-list {
    height: calc(100% - 24px);
    overflow-y: auto;

    .danmaku-item {
      padding: 5px;
      .uname {
        color: #aaaaaa;
      }
    }
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
