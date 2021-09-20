<template>
  <div class="today-bangumi">
    <h2 class="py-10">
      <span>今日番剧</span>
    </h2>
    <div class="today-bangumi-list pt-10">
      <acg-card v-for="item of bangumiList"
        :key="item.title"
        class="bangumi-card"
        no-border
        hover-up
        fill
        @mouseenter="currentImage = item.cover">
        <div class="cover">
          <img :src="item.cover"
            loading="lazy">
        </div>
        <div class="info px-16 py-10">
          <h4 class="title text-truncate">{{ item.title }}</h4>
        </div>
      </acg-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AnimeTodayBangumi',
  data() {
    return {
      currentImage: '',
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
  }
})
</script>

<style lang="scss">
// @import '/@/styles/scss/index.scss';

.today-bangumi {
  position: relative;
  min-height: 340px;

  &-list {
    display: flex;
    // white-space: nowrap;
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
        }
      }
    }
  }
}
</style>
