<template>
  <div class="bangumi-grid-item">
    <div class="anime-cover">
      <img :src="anime.coverMin">
    </div>
    <div class="anime-title">{{ anime.title }}</div>
    <div class="anime-airdate">{{ airdate }}</div>
    <div class="anime-airtime"
      :class="[`day-${airdayNum}`]">
      <div class="day">{{ airday }}</div>
      <div class="time">{{ airtime }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { formatUnixTime } from '/@/utils/date'

export default defineComponent({
  name: 'BangumiGridItem',

  props: {
    anime: { type: Object as PropType<AnimeOfBangumi>, default: () => ({}) }
  },

  computed: {
    onair(): FormatedAnimeDatetime | null {
      return formatUnixTime(this.anime.onair)
    },

    onairInSteaming(): FormatedAnimeDatetime | null {
      return formatUnixTime(this.anime.onairInSteaming)
    },

    airdate(): string {
      return this.onair ? `${this.onair.dateCH}首播` : '暂未定档'
    },

    airday(): string {
      return this.onair ? this.onair.dayCH : '?'
    },

    airdayNum(): number {
      return this.onair ? this.onair.day : 99
    },

    airtime(): string {
      return this.onair ? this.onair.time : '--:--'
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
  height: var(--grid-item-size);
  overflow: hidden;
  box-shadow: 1px 2px 3px 0 rgb(255 255 255 / 23%);

  .anime-cover {
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .anime-title {
    font-size: 18px;
    line-height: 20px;
    position: absolute;
    bottom: 0;
    color: #fff;
    padding: 0 5px 5px;
    text-shadow: 0 0 3px #000;
    background: rgba(0, 0, 0, 0)
      linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4)) repeat
      scroll 0 0;
  }

  .anime-airdate {
    position: absolute;
    top: 0;
    box-sizing: border-box;
    background: #37474f;
    width: 100%;
    height: 28px;
    border-radius: 4px 4px 0 0;
    padding-right: 42px;
    line-height: 28px;
    font-size: 15px;
    color: #eee;
    background-color: rgba(0, 0, 0, 0.35);
    text-align: center;
  }

  .anime-airtime {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #000;
    color: #eee;
    width: 42px;
    height: 42px;
    border-bottom-left-radius: 6px;
    text-align: center;
    box-shadow: 0 0 5px 0 rgb(0 0 0 / 50%);
    > .day {
      line-height: 26px;
      font-size: 18px;
    }
    > .time {
      font-size: 12px;
    }

    $colors: (0, #d50000) (1, #6200ea) (2, #ff3d00) (3, #0091ea) (4, #00bfa5)
      (5, #ffea00, #333) (6, #ff9100);

    @each $index, $color, $fColor in $colors {
      &.day-#{$index} {
        background-color: $color;
        color: $fColor;
      }
    }
  }
}
</style>