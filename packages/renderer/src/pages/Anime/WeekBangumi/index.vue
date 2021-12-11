<template>
  <div class="week-bangumi"
    :data-direction="direction">
    <week-bangumi-header :date="now"></week-bangumi-header>
    <div v-show="!isLoading && !isError"
      class="bangumi-grid"
      :data-direction="direction">
      <one-day-bangumi v-for="day of mList.length"
        :key="`day-${day}`"
        :day="day-1"
        :data="mList[day-1]"
        :vertical="isVertical"
        :today="today === day-1"></one-day-bangumi>
    </div>
    <acg-api-result :loading="isLoading"
      :error="isError"
      @retry="fetchWeekBangumi"></acg-api-result>
    <acg-fixed-button title="切换方向"
      always
      style="font-size: 16px;"
      :bottom="85"
      @click="handleSwitchModeClick">
      <component :is="isVertical ? 'icon-drag-dot-vertical' : 'icon-drag-dot'"></component>
    </acg-fixed-button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import WeekBangumiHeader from './components/WeekBangumiHeader.vue'
import OneDayBangumi from './components/OneDayBangumi.vue'
import { useNow } from '@vueuse/core'

export default defineComponent({
  name: 'WeekBangumi',

  components: { WeekBangumiHeader, OneDayBangumi },

  setup() {
    const now = useNow()

    const today = computed(() => now.value.getDay())
    console.log(today)

    return { now, today }
  },

  data() {
    return {
      isLoading: true,
      isError: false,
      bangumiList: [] as BangumiBasicWithTime[]
    }
  },

  computed: {
    direction: {
      get(): string {
        return this.$global.config.weekBangumiDirection
      },
      set(val: string) {
        this.$global.config.weekBangumiDirection = val
      }
    },

    isVertical(): boolean {
      return this.direction === 'vertical'
    },

    mList(): BangumiBasic[][] {
      const list = [[], [], [], [], [], [], []] as BangumiBasicWithTime[][]
      this.bangumiList.forEach(item => {
        const onairData = item.formatOnair[this.hourSystem]
        if (onairData.day === undefined) return
        list[onairData.day].push(item)
      })

      return list.map(item =>
        item.sort((a, b) => {
          const aTime = a.formatOnair[this.hourSystem].time
          const bTime = b.formatOnair[this.hourSystem].time
          return aTime > bTime ? 1 : -1
        })
      )
    }
  },

  created() {
    this.fetchWeekBangumi()
  },

  methods: {
    async fetchWeekBangumi() {
      this.isLoading = true
      this.isError = false
      try {
        const data = await this.$API.Bangumi.listWeekBangumi()
        this.bangumiList = data
      } catch (error) {
        this.isError = true
      }
      this.isLoading = false
    },

    scrollIntoToday() {
      const el = document.querySelector('.one-day-bangumi.today')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },

    handleSwitchModeClick() {
      this.direction = this.isVertical ? 'horizontal' : 'vertical'
      this.$nextTick(this.scrollIntoToday)
    }
  }
})
</script>

<style lang="scss">
.week-bangumi {
  --week-bangumi-item-size: 140px;
  --week-bangumi-v-item-width: 12.5%;
  --week-bangumi-width: calc(var(--week-bangumi-item-size) * 7);
  --week-bangumi-header-width: 100%;

  width: var(--week-bangumi-width);
  margin: 0 auto;

  .bangumi-grid {
    display: flex;
  }

  &[data-direction='horizontal'] {
    --week-bangumi-width: 100%;
    padding-bottom: 160px;

    .bangumi-grid {
      flex-direction: column;
    }
  }
}

@media (max-width: 1599.9px) {
  .week-bangumi {
    --week-bangumi-v-item-width: 20%;
  }
}

@media (max-width: 1199.9px) {
  .week-bangumi {
    --week-bangumi-v-item-width: 25%;
  }
}

@media (max-width: 991.9px) {
  .week-bangumi {
    --week-bangumi-header-width: 100vw;
    --week-bangumi-v-item-width: 33.33%;
  }
}

@media (max-width: 767.9px) {
  .week-bangumi {
    --week-bangumi-v-item-width: 50%;
  }
}
</style>
