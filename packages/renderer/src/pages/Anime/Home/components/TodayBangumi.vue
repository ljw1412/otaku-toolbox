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
      <!-- 骨架屏 -->
      <template v-if="!isFirstLoaded">
        <acg-card v-for="i of 3"
          :key="`skeleton-bangumi-card-${i}`"
          class="bangumi-card is-skeleton"
          data-skeleton-animate
          shadow="never"
          no-border
          fill>
          <div class="cover skeleton-bg">
          </div>
          <div class="info px-16 py-10">
            <h4 class="title text-truncate skeleton-bg"></h4>
          </div>
        </acg-card>
      </template>
      <template v-else>
        <acg-card v-for="item of bangumiList"
          :key="item.title"
          class="bangumi-card"
          no-border
          hover-up
          fill>
          <div class="cover">
            <img :src="item.cover"
              loading="lazy">
          </div>
          <div class="info px-16 py-10">
            <h4 class="title text-truncate">{{ item.title }}</h4>
          </div>
        </acg-card>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { betterWeekdayName } from '/@/utils/date'

export default defineComponent({
  name: 'AnimeTodayBangumi',
  data() {
    return {
      isFirstLoaded: false,
      weekdayName: '',
      bangumiList: [
        {
          title: '见面5秒开始战斗',
          cover:
            'https://i0.hdslb.com/bfs/archive/f949d75199264ae7deece9c8a7a9eb68eab40e42.png@672w_378h_1c_100q'
        },
        {
          title: '月光下的异世界之旅',
          cover:
            'https://i0.hdslb.com/bfs/archive/460582b33d6d2ba709f50dff710a27b000bfc468.jpg@672w_378h_1c_100q.webp'
        },
        {
          title: '平家物语',
          cover:
            'https://i0.hdslb.com/bfs/archive/5820c6ba694ea301a56f6bb71c89d10d79df2c73.jpg@672w_378h_1c_100q.webp'
        },
        {
          title: '开挂药师的奇幻世界悠闲生活',
          cover:
            'https://i0.hdslb.com/bfs/archive/7364f1c5642cb0652989a7906de7751357ca7abd.png@672w_378h_1c_100q.webp'
        },
        {
          title: '关于我转生变成史莱姆这档事 第二季',
          cover:
            'https://i0.hdslb.com/bfs/archive/1604294f1a0b48a5a2adf29c256feb424676026a.png@672w_378h_1c_100q.webp'
        }
      ]
    }
  },
  created() {
    setTimeout(() => {
      this.isFirstLoaded = true
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
  position: relative;
  min-height: 340px;

  &-list {
    display: flex;
    overflow-x: auto;
    .bangumi-card {
      cursor: pointer;
      flex: 0 0 auto;
      --acg-card-border-raduis: 8px;
      display: inline-block;
      width: 280px;
      margin-bottom: 10px;

      &:not(:first-child) {
        margin-left: 20px;
      }

      .cover {
        height: 200px;
        > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .info {
        .title {
          font-size: 16px;
          height: 22px;
          line-height: 22px;
        }
      }
    }

    .bangumi-card.is-skeleton {
      cursor: default;
      .title {
        width: 60%;
        border-radius: 4px;
      }
    }
  }

  &-weekday {
    // align-self: flex-end;
    font-size: 14px;
    border: 1px solid var(--border-color);
    padding: 2px;
    margin-left: 4px;
  }
}
</style>
