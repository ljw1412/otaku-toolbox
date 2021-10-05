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
    setTimeout(() => {
      this.isFirstLoaded = true
      this.bangumiList = [
        {
          title: '见面5秒开始战斗',
          cover:
            'https://i0.hdslb.com/bfs/archive/f949d75199264ae7deece9c8a7a9eb68eab40e42.png@672w_378h_1c_100q',
          onairList: [
            {
              name: '哔哩哔哩',
              time: '10:00',
              from: 'Bilibili',
              url: 'https://www.bilibili.com/bangumi/media/md28234627/'
            },
            {
              name: '电视台',
              time: '09:00',
              from: 'TV',
              url: ''
            }
          ]
        },
        {
          title: '月光下的异世界之旅',
          cover:
            'https://i0.hdslb.com/bfs/archive/460582b33d6d2ba709f50dff710a27b000bfc468.jpg@672w_378h_1c_100q.webp',
          onairList: [
            {
              name: '电视台',
              time: '09:00',
              from: 'TV',
              url: ''
            }
          ]
        },
        {
          title: '平家物语',
          cover:
            'https://i0.hdslb.com/bfs/archive/5820c6ba694ea301a56f6bb71c89d10d79df2c73.jpg@672w_378h_1c_100q.webp',
          onairList: []
        },
        {
          title: '开挂药师的奇幻世界悠闲生活',
          cover:
            'https://i0.hdslb.com/bfs/archive/7364f1c5642cb0652989a7906de7751357ca7abd.png@672w_378h_1c_100q.webp',
          onairList: []
        },
        {
          title: '关于我转生变成史莱姆这档事 第二季',
          cover:
            'https://i0.hdslb.com/bfs/archive/1604294f1a0b48a5a2adf29c256feb424676026a.png@672w_378h_1c_100q.webp',
          onairList: []
        }
      ]
    }, 3000)
    this.updateWeekday()
  },
  activated() {
    this.$forceUpdate()
  },
  methods: {
    updateWeekday() {
      this.weekdayName = betterWeekdayName(window.$dayjs().day())
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
