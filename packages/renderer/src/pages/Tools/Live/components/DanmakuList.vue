<template>
  <div ref="listEl"
    class="danmaku-list">
    <div v-for="danmaku of list"
      :key="danmaku.key"
      class="danmaku-item"
      :class="{'is-text-shadow': textShadow}">
      <span class="uname">{{ danmaku.uname }}：</span>
      <span class="message">{{ danmaku.message }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { useScroll } from '@vueuse/core'
import { defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  name: 'DanmakuList',

  props: {
    list: {
      type: Array as PropType<LivePlayer.BLiveMessageDanmaku[]>,
      default: () => []
    }
  },

  setup() {
    const listEl = ref<HTMLElement | null>(null)
    // @ts-ignore
    const { isScrolling, arrivedState } = useScroll(listEl)
    arrivedState.bottom = true

    return { listEl, isScrolling, arrivedState }
  },

  data() {
    return {
      scrollBottomLocked: true
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
.danmaku-list {
  font-size: 14px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;

  .danmaku-item {
    padding: 5px;
    text-shadow: 1px 0 1px #000000, 0 1px 1px #000000, 0 -1px 1px #000000,
      -1px 0 1px #000000;
    font-weight: bold;

    .uname {
      color: #aaaaaa;
    }
  }
}
</style>
