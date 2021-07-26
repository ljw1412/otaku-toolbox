<template>
  <div class="anime-timeline-picker px-10">
    <span class="picker">{{ year }}</span>
    <acg-tooltip :interactive="true"
      placement="bottom-start"
      theme="transparent"
      content-class="timeline-season-picker"
      :offset="[0,0]">
      <span class="picker"
        :style="{backgroundColor:`var(--bg-season-${season.value})`}">{{ season.name }}</span>
      <template #content>
        <span v-for="item of seasons"
          :key="item.value"
          :style="{backgroundColor:`var(--bg-season-${item.value})`}"
          class="option cursor-pointer"
          @click="onSeasonChange(item)">{{ item.name }}</span>
      </template>
    </acg-tooltip>
    <acg-tooltip :interactive="true"
      placement="bottom"
      theme="transparent"
      content-class="timeline-weekday-picker"
      :offset="[14,0]">
      <span class="picker">{{ weekday.name }}</span>
      <template #content>
        <span v-for="item of weekdays"
          :key="item.value"
          class="option cursor-pointer"
          @click="onWeekdayChange(item)">{{ item.name }}</span>
      </template>
    </acg-tooltip>

    <span class="picker"
      @click="initDate">今:{{ todayDate }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue'

interface BaseKeyValue {
  name: string
  value: string
}

interface TimelinePicker {
  seasons: BaseKeyValue[]
  weekdays: BaseKeyValue[]
  now: Date
  timer: null | number
  year: number | string
  season: BaseKeyValue
  weekday: BaseKeyValue
}

export default defineComponent({
  name: 'AnimeTimelinePicker',
  emits: ['change'],

  data(): TimelinePicker {
    return {
      seasons: [
        { name: '冬', value: 'winter' },
        { name: '春', value: 'spring' },
        { name: '夏', value: 'summer' },
        { name: '秋', value: 'fall' }
      ],
      weekdays: [
        { name: '一', value: 'monday' },
        { name: '二', value: 'tuesday' },
        { name: '三', value: 'wednesday' },
        { name: '四', value: 'thursday' },
        { name: '五', value: 'friday' },
        { name: '六', value: 'saturday' },
        { name: '日', value: 'sunday' }
      ],
      now: new Date(),
      timer: null,
      season: { name: '季', value: '' },
      year: 1970,
      weekday: { name: '周', value: '' }
    }
  },

  computed: {
    todayDate() {
      const now = this.now as Date
      return window.$dayjs(now).format('M-DD')
    },

    query(): any {
      return {
        version: '2.0.27900',
        locale: 'zh_CN',
        year: this.year,
        season: this.season.value,
        weekday: this.weekday.value
      }
    }
  },

  created() {
    this.timeRunner()
    this.initDate()
  },

  beforeUnmount() {
    this.timer && clearInterval(this.timer)
  },

  methods: {
    timeRunner() {
      // @ts-ignore
      this.timer = setInterval(() => {
        this.now = new Date()
      }, 60 * 1000)
    },

    initDate() {
      const d = window.$dayjs(this.now)
      this.year = d.format('YYYY')
      const month = d.format('M')
      this.season = this.seasons[(month - 1) / 3]
      this.weekday = this.weekdays[d.isoWeekday() - 1]
      this.$emit('change', this.query)
    },

    onSeasonChange(item: BaseKeyValue) {
      this.season = item
      nextTick(() => {
        this.$emit('change', this.query)
      })
    },

    onWeekdayChange(item: BaseKeyValue) {
      this.weekday = item
      nextTick(() => {
        this.$emit('change', this.query)
      })
    }
  }
})
</script>

<style lang="scss">
.anime-timeline-picker {
  height: 100%;
  background-color: rgba($color: #047200, $alpha: 0.5);
  color: #ffffff;
  .picker {
    display: inline-block;
    padding: 0 8px;
    cursor: pointer;
    line-height: var(--option-height);
    &:hover {
      background-color: rgba(255, 255, 255, 0.25);
    }
  }
}

.timeline-season-picker,
.timeline-weekday-picker {
  .option {
    display: inline-block;
    width: 36px;
    height: 36px;
    line-height: 36px;
    font-size: 16px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.9);

    &:hover {
      background-color: rgba(0, 0, 0, 0.7);
    }
  }
}
</style>
