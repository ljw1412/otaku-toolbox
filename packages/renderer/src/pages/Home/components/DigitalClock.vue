<template>
  <div class="home-digital-clock">
    <div class="digits">
      <div v-for="i of 8" :key="i" :class="[{ 'dots': !(i % 3) }, time[i - 1]]">
        <template v-if="(i % 3)">
          <span v-for="j of 7" :key="j" :class="`d${j}`"></span>
        </template>
      </div>
    </div>
    <p class="date">{{ date }}</p>
    <div class="hour-system">{{ hourSystem }}</div>
  </div>
</template>

<script lang="ts">
import { useNow } from '@vueuse/core'
import { Dayjs } from 'dayjs'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeDigitalClock',

  setup() {
    const now = useNow()
    return { now }
  },

  data() {
    return {
      digitName: [
        'zero',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine'
      ]
    }
  },

  computed: {
    dayDate(): Dayjs {
      return this.$dayjs(this.now)
    },

    date(): string {
      const { hours } = this.dayDate.toObject()
      const d =
        this.hourSystem === 30 && hours < 6
          ? this.dayDate.subtract(1, 'day')
          : this.dayDate
      return d.format('YYYY-MM-DD dddd')
    },

    time(): string[] {
      const time = this.dayDate.format('HH:mm:ss').split('')

      if (this.hourSystem === 30 && time[0] === '0' && time[1] < '6') {
        time[0] = '2'
        time[1] = 4 + parseInt(time[1]) + ''
      }
      return time.map(i => this.digitName[parseInt(i)])
    }
  }
})
</script>

<style lang="scss">
.home-digital-clock {
  position: relative;
  user-select: none;
  padding: 16px 0;
  border-radius: 4px;
  background-color: var(--color-bg-2);
  box-shadow: 0 1px 1px var(--color-fill-2) inset, 0 1px 3px var(--color-fill-3);
  overflow: hidden;

  .hour-system {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 2px 4px;
    background-color: rgba(255, 255, 255, 0.2);
    border-top-left-radius: 6px;
    opacity: 0.5;
  }

  .digits {
    text-align: center;

    > div {
      text-align: left;
      position: relative;
      width: 28px;
      height: 50px;
      display: inline-block;
      margin: 0 4px;
    }

    > div > span {
      opacity: 0.05;
      position: absolute;
      background-color: currentColor;

      -webkit-transition: 0.25s;
      -moz-transition: 0.25s;
      transition: 0.25s;

      &::before,
      &::after {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border: 5px solid transparent;
      }
    }

    .d1 {
      height: 5px;
      width: 16px;
      top: 0;
      left: 6px;
      &::before {
        border-width: 0 5px 5px 0;
        border-right-color: inherit;
        left: -5px;
      }
      &::after {
        border-width: 0 0 5px 5px;
        border-left-color: inherit;
        right: -5px;
      }
    }

    .d2 {
      height: 5px;
      width: 16px;
      top: 24px;
      left: 6px;
      &::before {
        border-width: 3px 4px 2px;
        border-right-color: inherit;
        left: -8px;
      }
      &::after {
        border-width: 3px 4px 2px;
        border-left-color: inherit;
        right: -8px;
      }
    }

    .d3 {
      height: 5px;
      width: 16px;
      top: 48px;
      left: 6px;
      &::before {
        border-width: 5px 5px 0 0;
        border-right-color: inherit;
        left: -5px;
      }
      &::after {
        border-width: 5px 0 0 5px;
        border-left-color: inherit;
        right: -5px;
      }
    }

    .d4 {
      width: 5px;
      height: 14px;
      top: 7px;
      left: 0;
      &::before {
        border-width: 0 5px 5px 0;
        border-bottom-color: inherit;
        top: -5px;
      }
      &::after {
        border-width: 0 0 5px 5px;
        border-left-color: inherit;
        bottom: -5px;
      }
    }

    .d5 {
      width: 5px;
      height: 14px;
      top: 7px;
      right: 0;
      &::before {
        border-width: 0 0 5px 5px;
        border-bottom-color: inherit;
        top: -5px;
      }
      &::after {
        border-width: 5px 0 0 5px;
        border-top-color: inherit;
        bottom: -5px;
      }
    }

    .d6 {
      width: 5px;
      height: 14px;
      top: 32px;
      left: 0;
      &::before {
        border-width: 0 5px 5px 0;
        border-bottom-color: inherit;
        top: -5px;
      }
      &::after {
        border-width: 0 0 5px 5px;
        border-left-color: inherit;
        bottom: -5px;
      }
    }

    .d7 {
      width: 5px;
      height: 14px;
      top: 32px;
      right: 0;
      &::before {
        border-width: 0 0 5px 5px;
        border-bottom-color: inherit;
        top: -5px;
      }
      &::after {
        border-width: 5px 0 0 5px;
        border-top-color: inherit;
        bottom: -5px;
      }
    }

    .one {
      .d5,
      .d7 {
        opacity: 1;
      }
    }

    .two {
      .d1,
      .d5,
      .d2,
      .d6,
      .d3 {
        opacity: 1;
      }
    }

    .three {
      .d1,
      .d5,
      .d2,
      .d7,
      .d3 {
        opacity: 1;
      }
    }

    .four {
      .d5,
      .d2,
      .d4,
      .d7 {
        opacity: 1;
      }
    }

    .five {
      .d1,
      .d2,
      .d4,
      .d3,
      .d7 {
        opacity: 1;
      }
    }

    .six {
      .d1,
      .d2,
      .d4,
      .d3,
      .d6,
      .d7 {
        opacity: 1;
      }
    }

    .seven {
      .d1,
      .d5,
      .d7 {
        opacity: 1;
      }
    }

    .eight {
      .d1,
      .d2,
      .d3,
      .d4,
      .d5,
      .d6,
      .d7 {
        opacity: 1;
      }
    }

    .nine {
      .d1,
      .d2,
      .d3,
      .d4,
      .d5,
      .d7 {
        opacity: 1;
      }
    }

    .zero {
      .d1,
      .d3,
      .d4,
      .d5,
      .d6,
      .d7 {
        opacity: 1;
      }
    }

    .dots {
      width: 5px;
      &::before,
      &::after {
        width: 5px;
        height: 5px;
        content: "";
        position: absolute;
        left: 0;
        top: 14px;
        background-color: currentColor;
      }

      &::after {
        top: 34px;
      }
    }
  }

  > p {
    margin-top: 8px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
