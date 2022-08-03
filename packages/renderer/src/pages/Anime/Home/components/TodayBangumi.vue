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

    <div v-watch-scroll class="today-bangumi-list pt-6 px-8">
      <today-bangumi-item
        v-for="(bangumi, i) of mBangumiList"
        :key="bangumi.title || `bangumi-${i}`"
        :bangumi="bangumi"
        :skeleton="isSkeleton"
      ></today-bangumi-item>
      <acg-api-result :loading="false" :error="isError" @retry="fetchTodayBangumiList"></acg-api-result>
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
      isLoading: true,
      bangumiList: [] as FormatedBangumiBasic[]
    }
  },

  computed: {
    isSkeleton(): boolean {
      return this.isLoading || this.isError
    },

    weekdayName(): string {
      return betterWeekdayName(this.$dayjs(this.$global.now.value).day())
    },

    mBangumiList(): FormatedBangumiBasic[] {
      if (this.isSkeleton) {
        return new Array(3).fill({ title: '', cover: '', onairList: [{}] })
      }
      return this.bangumiList
    },

    nearestBangumiId(): string {
      const now = this.$dayjs(this.$global.now.value)
      let nearBangumiId = this.bangumiList.length ? this.bangumiList[0]._id : ''
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
      return nearBangumiId
    }
  },

  watch: {
    weekdayName() {
      this.fetchTodayBangumiList()
    }
  },

  created() {
    this.fetchTodayBangumiList()
  },

  activated() {
    this.$forceUpdate()
  },

  methods: {
    scrollToNextBangumi() {
      if (this.nearestBangumiId) {
        this.$nextTick(() => {
          const el = document.querySelector(
            `.today-bangumi-item[data-id="${this.nearestBangumiId}"]`
          ) as HTMLElement | null
          if (el) {
            console.dir(el)
            const left = Math.max(el.offsetLeft - (el.offsetWidth * 3) / 2, 0)
            el.parentElement?.scrollBy({ behavior: 'smooth', left })
            // el.scrollIntoView({ behavior: 'smooth', inline: 'center' })
          }
        })
      }
    },

    async fetchTodayBangumiList() {
      this.isError = false
      this.isLoading = true
      this.bangumiList = []
      try {
        this.bangumiList = await this.$API.Bangumi.listTodayBangumi()
        this.isLoading = false
        this.scrollToNextBangumi()
      } catch (error) {
        this.isError = true
      }
      this.isLoading = false
    }
  }
})
</script>

<style lang="scss">
.today-bangumi {
  &-list {
    position: relative;
    display: flex;
    overflow-x: scroll;
    min-height: 280px;

    .acg-api-result {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      backdrop-filter: blur(10px);
    }
  }

  &-weekday {
    font-size: 14px;
    border: 1px solid var(--color-border);
    padding: 2px;
    margin-left: 4px;
  }
}
</style>
