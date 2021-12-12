<template>
  <div class="today-bangumi">
    <a-page-header :show-back="false">
      <template #title>
        <a-space size="mini">
          <span>今日番剧</span>
          <a-tag size="small">{{ weekdayName }}</a-tag>
        </a-space>
      </template>
    </a-page-header>

    <div v-watch-scroll
      class="today-bangumi-list pt-6">
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

export default defineComponent({
  name: 'AnimeTodayBangumi',

  components: {
    TodayBangumiItem
  },

  data() {
    return {
      isError: false,
      isFirstLoaded: false,
      weekdayName: '',
      bangumiList: [] as BangumiBasicWithTime[]
    }
  },

  computed: {
    mBangumiList(): BangumiBasicWithTime[] {
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

    scrollToNextBangumi() {
      const now = this.$dayjs(this.$global.now.value)
      let nearBangumiId = ''
      let minDiff = Infinity
      this.bangumiList.forEach(item => {
        const onair = item.formatOnair[this.hourSystem]
        if (onair.time) {
          const diff = this.$dayjs(onair.time, 'HH:mm').diff(now)
          if (minDiff > Math.abs(diff)) {
            minDiff = Math.abs(diff)
            nearBangumiId = item._id
          }
        }
      })
      if (nearBangumiId) {
        this.$nextTick(() => {
          const el = document.querySelector(
            `.today-bangumi-item[data-id="${nearBangumiId}"]`
          )
          if (el) {
            console.dir(el)
            el.parentElement?.scrollBy({
              behavior: 'smooth',
              left: el.offsetLeft
            })
            // el.scrollIntoView({ behavior: 'smooth', inline: 'center' })
          }
        })
      }
    },

    async fetchTodayBangumiList() {
      try {
        this.bangumiList = await this.$API.Bangumi.listTodayBangumi()
        this.isFirstLoaded = true
        this.scrollToNextBangumi()
      } catch (error) {
        this.isError = true
      }
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
    border: 1px solid var(--color-border);
    padding: 2px;
    margin-left: 4px;
  }
}
</style>
