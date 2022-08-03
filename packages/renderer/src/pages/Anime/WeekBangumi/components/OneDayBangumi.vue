<template>
  <router-link
    target="_blank"
    class="one-day-bangumi"
    :class="direction"
    :to="{name:'AnimeWiki',params:{id:anime._id},query:{app:'otakutools'}}"
  >
    <div class="time">{{startDate.time}}</div>
    <div class="status" :class="{ start: isStart, end: isEnd }">{{ statusStr }}</div>
    <acg-ratio-div
      :ratio="direction === 'vertical' ? [1,1]:[3,4]"
      :class="{'filter-gray': anime.markState.isBan}"
    >
      <img :src="compressImage(anime.coverMin)" loading="lazy" />
    </acg-ratio-div>
    <div class="title">{{anime.title}}</div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { formatUnixTime } from '/@/utils/date'
import { compressImage } from '/@/utils/image'

export default defineComponent({
  name: 'OneDayBangumi',

  props: {
    date: String,
    direction: { type: String, default: 'vertical' },
    anime: {
      type: Object as PropType<FormatedBangumiBasic>,
      default: () => ({})
    }
  },

  computed: {
    startDate() {
      return (
        formatUnixTime(this.anime.onair, this.hourSystem) ||
        ({} as FormatedAnimeDatetime)
      )
    },
    endDate() {
      return (
        formatUnixTime(this.anime.endTime, this.hourSystem) ||
        ({} as FormatedAnimeDatetime)
      )
    },

    isStart() {
      return this.startDate.fullDate === this.date
    },

    isEnd() {
      return this.endDate.fullDate === this.date
    },

    statusStr() {
      if (this.isStart) return 'NEW'
      if (this.isEnd) return 'END'
      return ''
    }
  },

  methods: {
    compressImage
  }
})
</script>

<style lang="scss">
.one-day-bangumi {
  position: relative;
  display: block;
  overflow: hidden;

  .time {
    position: absolute;
    left: 0;
    top: 12px;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }

  .status {
    position: absolute;
    right: -30px;
    top: -30px;
    width: 60px;
    height: 60px;
    padding-top: 45px;
    z-index: 1;
    text-align: center;
    transform: rotate(45deg);
    box-sizing: border-box;
    font-size: 12px;
    line-height: 12px;

    &.end {
      background: rgb(var(--red-4));
    }
    &.start {
      background: rgb(var(--green-4));
    }
  }

  .title {
    position: absolute;
    left: 0;
    bottom: 0;
    min-height: 20px;
    line-height: 16px;
    width: 100%;
    padding: 2px 4px;
    font-size: 14px;
    background-color: rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &:hover {
    .title {
      white-space: initial;
      text-overflow: initial;
    }
  }
}
</style>
