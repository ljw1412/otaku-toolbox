<template>
  <div class="one-day-bangumi"
    :class="{today}"
    :data-day="day">
    <header class="data-header">
      <section class="data-header-body">
        <div class="en">{{ headerList[day].en }}</div>
        <div class="jp">{{ headerList[day].jp }}曜日</div>
        <div class="cn">{{ headerList[day].cn }}</div>
      </section>
    </header>
    <ul class="data-list">
      <li v-for="anime of data"
        :key="anime._id"
        :title="anime.title">
        <router-link target="_blank"
          :to="{name:'Wiki',params:{id:anime._id},query:{app:'otakutools'}}">
          <div class="time">{{anime.formatOnair[hourSystem].time}}</div>
          <acg-ratio-div :ratio="vertical?[1,1]:[3,4]">
            <img :src="compressImage(anime.coverMin)"
              loading="lazy">
          </acg-ratio-div>
          <div class="title">{{anime.title}}</div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { dayList } from '/@/utils/date'
import { compressImage } from '/@/utils/image'

export default defineComponent({
  name: 'OneDayBangumi',

  props: {
    today: Boolean,
    vertical: Boolean,
    day: { type: Number, default: 0 },
    data: { type: Array as PropType<BangumiBasicWithTime[]>, default: () => [] }
  },

  data() {
    return {
      headerList: dayList
    }
  },

  methods: {
    compressImage
  }
})
</script>

<style lang="scss">
$colors: (0, #d50000) (1, #ff3d00) (2, #ff9100) (3, #00b42a) (4, #0091ea)
  (5, #00bfa5) (6, #6200ea);

@mixin base-pseudo-element($content: '') {
  content: $content;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.one-day-bangumi {
  position: relative;
  color: #ffffff;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: translateZ(0);
  }

  @each $index, $color in $colors {
    &[data-day='#{$index}'] {
      background-color: $color;
      > .data-header {
        background-color: $color;
      }
    }
  }

  .data-header {
    position: relative;
    user-select: none;
    .cn,
    .en,
    .jp {
      position: absolute;
      font-weight: bold;
    }
  }

  .data-list {
    li {
      position: relative;
      .time {
        position: absolute;
        left: 0;
        top: 12px;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1;
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
  }

  &.today {
    &::before {
      @include base-pseudo-element;
      border: 4px solid currentColor;
      z-index: 1;
      pointer-events: none;
    }

    .data-header {
      &::before {
        @include base-pseudo-element;
        border-width: 0;
        border-style: solid;
        border-color: currentColor;
      }

      &-body {
        &::after {
          @include base-pseudo-element('今');
          font-size: 50px;
          text-align: center;
          opacity: 0.25;
          overflow: hidden;
        }
      }
    }
  }
}

[data-direction='vertical'] > .one-day-bangumi {
  .data-header {
    position: sticky;
    top: 0;
    // top: var(--app-header-height);
    height: 60px;
    z-index: 400;

    &::before {
      border-width: 4px 0;
    }

    .cn {
      bottom: 12px;
      right: 10px;
      font-size: 36px;
    }
    .en {
      bottom: 12px;
      left: 10px;
      opacity: 0.8;
    }
    .jp {
      top: 14px;
      left: 10px;
      opacity: 0.8;
    }
  }

  .data-list {
    width: var(--week-bangumi-item-size);
    li {
      height: var(--week-bangumi-item-size);
    }
  }

  &.today {
    padding: 0 4px;
  }
}

[data-direction='horizontal'] > .one-day-bangumi {
  display: flex;

  &.today {
    padding: 4px 0;
  }

  .data-header {
    width: 120px;
    flex-shrink: 0;

    &::before {
      border-right-width: 4px;
    }

    &-body {
      position: sticky;
      top: 0;
      width: 100%;
      height: 100px;
      overflow: hidden;
    }
    .cn {
      top: 20px;
      right: 10px;
      font-size: 48px;
    }
    .en {
      bottom: 4px;
      right: 10px;
      font-size: 18px;
      opacity: 0.4;
    }
    .jp {
      top: 14px;
      left: 10px;
      opacity: 0.8;
    }
  }

  .data-list {
    display: flex;
    flex-wrap: wrap;
    flex-shrink: 0;
    width: calc(100% - 120px);

    > li {
      width: var(--week-bangumi-v-item-width);
    }
  }
}
</style>
