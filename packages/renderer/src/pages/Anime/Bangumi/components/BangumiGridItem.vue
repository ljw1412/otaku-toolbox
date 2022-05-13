<template>
  <div class="bangumi-grid-item" :class="{ 'filter-gray': anime.markState.isBan }">
    <acg-ratio-div class="anime-cover">
      <img :src="cover" loading="lazy" />
    </acg-ratio-div>
    <div class="anime-title">{{ anime.title }}</div>
    <div class="anime-airdate">{{ airdate }}</div>
    <div class="anime-airtime" :class="[`day-${airdayNum}`]">
      <div class="day">{{ airday }}</div>
      <div class="time">{{ airtime }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { typeOf } from '/@/utils/assist'
import { compressImage } from '/@/utils/image'

export default defineComponent({
  name: 'BangumiGridItem',

  props: {
    anime: {
      type: Object as PropType<BangumiBasicWithTime>,
      default: () => ({})
    }
  },

  computed: {
    cover(): string {
      return compressImage(this.anime.coverMin)
    },
    onair(): FormatedAnimeDatetime {
      return this.anime.formatOnair[this.hourSystem]
    },

    airdate(): string {
      if (this.anime.isSubTagMatched) return '跨季放送'
      return this.onair.dateCH ? `${this.onair.dateCH}首播` : '暂未定档'
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
  }
})
</script>

<style lang="scss">
.bangumi-grid-item {
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  border-radius: 4px;
  width: var(--grid-item-size);
  overflow: hidden;
  box-shadow: 1px 2px 3px 0 rgb(255 255 255 / 23%);
  transform: translateZ(0);

  .anime-title {
    position: absolute;
    top: 0;
    width: 100%;
    padding: 5px 5px 0px;
    color: #fff;
    font-size: 18px;
    line-height: 20px;
    text-shadow: 0 0 3px #000;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0)
      linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0)) repeat
      scroll 0 0;
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
    > .day {
      line-height: 26px;
      font-size: 18px;
    }
    > .time {
      font-size: 12px;
    }

    $colors: (0, #d50000) (1, #ff3d00) (2, #ff9100) (3, #00b42a) (4, #0091ea)
      (5, #00bfa5) (6, #6200ea);

    @each $index, $color in $colors {
      &.day-#{$index} {
        background-color: $color;
      }
    }
  }
}
</style>
