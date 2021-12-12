<template>
  <div class="mini-news">
    <a-page-header title="动画资讯"
      :show-back="false"> </a-page-header>
    <div class="news-list">
      <mini-news-item v-for="item of news"
        :key="item.id"
        v-bind="item"></mini-news-item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MiniNewsItem from './MiniNewsItem.vue'

export default defineComponent({
  name: 'MiniNews',
  components: { MiniNewsItem },
  data() {
    return {
      news: [
        {
          id: '1',
          cover:
            'https://images.dmzj.com/news/article/72539/row_61754540e83ff.jpg',
          title: '津田尚克×CloverWorks原创TV动画《东京24区》2022年1月播出',
          desc:
            '​津田尚克导演×故事构成/脚本·下倉バイオ（Nitroplus）×动画制作CloverWorks的全新原创TV动画《东京24区》将于2022年1月开始播出！',
          from: '',
          url: 'http://www.baidu.com'
        },
        {
          id: '2',
          cover:
            'https://images.dmzj.com/news/article/72538/row_617539c94e7b9.jpg',
          title: 'TV动画《不要欺负我、长瀞同学》第2期制作决定',
          desc:
            'TV动画《不要欺负我、长瀞同学》第2期制作决定，这一消息在近日的官方见面会活动中公布。',
          from: ''
        },
        {
          id: '3',
          cover:
            'https://images.dmzj.com/news/article/72537/row_6175366daa5c0.jpg',
          title: 'TV动画《LoveLive!SuperStar!!》第2期制作决定',
          desc:
            'TV动画《LoveLive!SuperStar!!》第2期制作决定，近日公开了制作决定PV。',
          from: ''
        },
        {
          id: '4',
          cover:
            'https://images.dmzj.com/news/article/72529/row_61728e0e159a4.jpg',
          title: '《Muv-Luv》连线谏山创：迫害角色是让故事有趣的方法？',
          desc:
            '作为10月番《Muv-Luv Alternative》动画化的庆祝，官方请来了谏山创发表评价……',
          from: ''
        }
      ]
    }
  }
})
</script>

<style lang="scss">
.mini-news {
  .news-list {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-column-gap: 30px;

    box-sizing: border-box;
    padding: 0 15px;
    margin: 0 -15px;
    width: 100%;
  }
}
</style>
