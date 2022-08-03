<template>
  <div class="one-day-bangumi-list" :class="{today}" :data-day="day">
    <header class="data-header">
      <section class="data-header-body">
        <div class="en">{{ headerList[day].en }}</div>
        <div class="jp">{{ headerList[day].jp }}曜日</div>
        <div class="cn">{{ headerList[day].cn }}</div>
        <div v-show="direction !== 'vertical'" class="date">{{ date }}</div>
      </section>
    </header>
    <ul class="data-list">
      <div v-show="direction === 'vertical'" class="date">{{ date }}</div>
      <li v-for="anime of data" :key="anime._id" :title="anime.title">
        <one-day-bangumi :anime="anime" :date="date" :direction="direction"></one-day-bangumi>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import OneDayBangumi from './OneDayBangumi.vue'
import { dayList } from '/@/utils/date'
import { compressImage } from '/@/utils/image'

export default defineComponent({
  name: 'OneDayBangumiList',

  components: { OneDayBangumi },

  props: {
    date: String,
    today: Boolean,
    direction: { type: String, default: 'vertical' },
    day: { type: Number, default: 0 },
    data: { type: Array as PropType<FormatedBangumiBasic[]>, default: () => [] }
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

@mixin base-pseudo-element($content: "") {
  content: $content;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.one-day-bangumi-list {
  position: relative;
  color: #ffffff;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: translateZ(0);
  }

  @each $index, $color in $colors {
    &[data-day="#{$index}"] {
      background-color: $color;
      &.today {
        box-shadow: 0 0 10px $color;
      }

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
    .jp,
    .date {
      position: absolute;
      font-weight: bold;
    }
  }

  &.today {
    z-index: 10;

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
          @include base-pseudo-element("今");
          font-size: 50px;
          text-align: center;
          opacity: 0.25;
          overflow: hidden;
        }
      }
    }
  }
}

[data-direction="vertical"] > .one-day-bangumi-list {
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
      top: 10px;
      right: 10px;
      font-size: 36px;
    }
    .en {
      top: 34px;
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

    .date {
      text-align: center;
      line-height: 24px;
      height: 24px;
      background-color: rgba(0, 0, 0, 0.2);
    }

    li {
      height: var(--week-bangumi-item-size);
    }
  }

  &.today {
    padding: 0 4px 4px 4px;
  }
}

[data-direction="horizontal"] > .one-day-bangumi-list {
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

      &::after {
        padding-top: 20px;
        padding-right: 24px;
      }
    }
    .cn {
      top: 10px;
      right: 10px;
      font-size: 48px;
    }
    .en {
      bottom: 16px;
      right: 10px;
      font-size: 18px;
      opacity: 0.4;
    }
    .jp {
      top: 14px;
      left: 10px;
      opacity: 0.8;
    }

    .date {
      bottom: 0;
      left: 10px;
      opacity: 0.4;
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
