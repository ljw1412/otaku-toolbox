<template>
  <acg-ratio-div
    ref="itemRef"
    class="bangumi-grid-item"
    :class="{ 'filter-gray': anime.markState.isBan }"
    :data-loaded="isLoaded"
    @click="toBangumiItem"
  >
    <img
      v-if="cover"
      :src="cover"
      :alt="`${anime.title}的视觉图`"
      loading="lazy"
      referrerpolicy="no-referrer"
    />
    <div v-else class="no-cover">
      <span>国王的封面</span>
    </div>
    <div class="anime-title text-stroke">{{ anime.title }}</div>
    <div class="anime-airdate">{{ airdate }}</div>
    <div class="anime-airtime" :class="[`day-${airdayNum}`]">
      <div class="day">{{ airday }}</div>
      <div class="time">{{ airtime }}</div>
    </div>
  </acg-ratio-div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { typeOf } from '/@/utils/assist'

export default defineComponent({
  name: 'BangumiGridItem',

  props: {
    anime: {
      type: Object as PropType<FormatedBangumiBasic>,
      default: () => ({})
    }
  },

  setup() {
    const isLoaded = ref(false)
    const itemRef = ref()

    try {
      const { isSupported, stop } = useIntersectionObserver(
        itemRef,
        ([{ isIntersecting }], observerElement) => {
          if (isIntersecting) {
            isLoaded.value = true
            stop()
          }
        }
      )

      if (!isSupported.value) {
        isLoaded.value = true
      }
    } catch (error) {
      isLoaded.value = true
      console.groupCollapsed('[GridItem] 懒加载监听失败，改用正常加载模式！')
      console.error(error)
      console.groupEnd()
    }

    return { isLoaded, itemRef }
  },

  computed: {
    cover() {
      return this.compressImage(this.anime.coverMin, 'small')
    },
    onair(): FormatedAnimeDatetime {
      return this.anime.formatOnair[this.hourSystem]
    },

    airdate(): string {
      if (this.anime.isSubTagMatched)
        return this.anime.markState.isPostpone ? '延期放送' : '跨季放送'
      return this.onair.dateCH ? `${this.onair.dateCH}首播` : '首播未定'
    },

    airday(): string {
      return this.onair.dayCH ? this.onair.dayCH : '?'
    },

    airdayNum(): number {
      return typeOf(this.onair.day) === 'number' ? this.onair.day : 99
    },

    airtime(): string {
      return this.onair.time ? this.onair.time : '--:--'
    }
  },

  methods: {
    toBangumiItem() {
      const hash = `#anime-${this.anime._id}`
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ block: 'start' })
      }
    }
  }
})
</script>

<style lang="scss">
.bangumi-grid-item {
  --animation-duration: 0.5s;

  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  border-radius: 4px;
  width: 100%;
  overflow: hidden;
  box-shadow: 1px 2px 3px 0 rgb(255 255 255 / 23%);
  transform: translateZ(0);

  &[data-loaded~='false'] .acg-ratio-content {
    display: none;
  }

  .no-cover {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    font-size: 16px;
    white-space: nowrap;
    color: var(--color-text-4);
    z-index: -1;
    > span {
      margin: auto;
      animation: scale-in var(--animation-duration) backwards;
    }
  }

  .anime-title {
    position: absolute;
    top: 0;
    width: 100%;
    padding: 5px 5px 0px;
    color: #fff;
    font-size: 18px;
    line-height: 20px;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0)
      linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0)) repeat
      scroll 0 0;
    animation: move-in-top var(--animation-duration) backwards;
  }

  .anime-airdate {
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    background: #37474f;
    width: 100%;
    height: 28px;
    border-radius: 4px 4px 0 0;
    padding-right: 42px;
    line-height: 28px;
    font-size: 14px;
    color: #eee;
    background-color: rgba(0, 0, 0, 0.35);
    text-align: center;
    animation: move-in-bottom var(--animation-duration) 0.3s backwards;
  }

  .anime-airtime {
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: #000;
    color: #eee;
    width: 42px;
    height: 42px;
    border-top-left-radius: 6px;
    text-align: center;
    box-shadow: 0 0 5px 0 rgb(0 0 0 / 50%);
    animation: move-in-right var(--animation-duration) 0.2s backwards;

    > .day {
      line-height: 26px;
      font-size: 18px;
    }

    > .time {
      font-size: 12px;
    }

    $colors: (0, #d50000) (1, #ff3d00) (2, #ff9100) (3, #00b42a) (4, #0091ea)
      (5, #00bfa5) (6, #6200ea);

    @each $index, $color, $fColor in $colors {
      &.day-#{$index} {
        background-color: $color;
      }
    }
  }
}
</style>
