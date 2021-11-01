<template>
  <div class="today-bangumi">
    <app-area-header title="今日番剧">
      <template #left>
        <div v-show="weekdayName"
          class="today-bangumi-weekday">{{ weekdayName }}</div>
      </template>
    </app-area-header>

    <div v-watch-scroll
      class="today-bangumi-list pt-10">
      <today-bangumi-item v-for="(bangumi,i) of mBangumiList"
        :key="bangumi.title || `bangumi-${i}`"
        :bangumi="bangumi"
        :skeleton="!isFirstLoaded"></today-bangumi-item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { betterWeekdayName } from '/@/utils/date'
import TodayBangumiItem from './TodayBangumiItem.vue'
import tempdata from './data.json'

export default defineComponent({
  name: 'AnimeTodayBangumi',

  components: {
    TodayBangumiItem
  },

  data() {
    return {
      isFirstLoaded: false,
      weekdayName: '',
      bangumiList: [] as TodayBangumiItem[]
    }
  },

  computed: {
    mBangumiList(): TodayBangumiItem[] {
      if (!this.isFirstLoaded) {
        return new Array(3).fill({ title: '', cover: '', onairList: [{}] })
      }
      return this.bangumiList
    }
  },

  created() {
    this.fetchTodayBangumiList()

    this.updateWeekday()
  },
  activated() {
    this.$forceUpdate()
  },
  methods: {
    updateWeekday() {
      this.weekdayName = betterWeekdayName(window.$dayjs().day())
    },

    async fetchTodayBangumiList() {
      this.bangumiList = tempdata
      this.isFirstLoaded = true
      // try {
      //   const data = await fetch(
      //     'http://rap2api.taobao.org/app/mock/288559/today_bangumi'
      //   ).then(data => data.json())
      //   this.bangumiList = data
      //   this.isFirstLoaded = true
      //   console.log(data)
      // } catch (error) {
      //   console.error(error)
      // }
    }
  }
})
</script>

<style lang="scss">
.today-bangumi {
  &-list {
    display: flex;
    overflow-x: scroll;
    min-height: 280px;
  }

  &-weekday {
    font-size: 14px;
    border: 1px solid var(--border-color);
    padding: 2px;
    margin-left: 4px;
  }
}
</style>
