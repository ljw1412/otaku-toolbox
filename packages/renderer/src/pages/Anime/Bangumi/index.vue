<template>
  <div class="anime-bangumi"
    :class="{'page-container':$route.meta.separate}">
    <bangumi-grid :animes="bangumiList"
      class="mb-20"></bangumi-grid>
    <bangumi-list :animes="bangumiList"
      class="mb-20"></bangumi-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BangumiGrid from './components/BangumiGrid.vue'
import BangumiList from './components/BangumiList.vue'

export default defineComponent({
  name: 'AnimeBangumi',

  components: { BangumiGrid, BangumiList },

  data() {
    return {
      bangumiList: [
        {
          id: 1,
          title: '见面5秒开始战斗',
          titleJP: '出会って5秒でバトル',
          titleMore: [
            '急戰5秒殊死鬥',
            '見面5秒開始戰鬥',
            'Deatte 5-byou de Battle',
            '见面5秒开始战斗',
            '见面之后5秒开始战斗',
            '急战5秒殊死斗'
          ],
          tags: ['漫画改', '智斗', '奇幻'],
          copyright:
            '© 2021 みやこかしわ，はらわたさいぞう，小学館／出会って5秒でバトル製作委員会',
          links: [{ name: '官方网站', url: 'https://dea5-anime.com/' }],
          streamingPlatforms: [
            {
              name: '哔哩哔哩',
              url: 'https://www.bilibili.com/bangumi/media/md28234627/',
              from: 'Bilibili'
            },
            {
              name: '[港澳台]哔哩哔哩',
              url: 'https://www.bilibili.com/bangumi/media/md28234727/',
              from: 'Bilibili'
            },
            {
              name: '[台]巴哈姆特動畫瘋',
              url: 'https://ani.gamer.com.tw/animeVideo.php?sn=23337',
              from: 'Baha'
            },
            {
              name: '[港]木棉花YouTube',
              url:
                'https://www.youtube.com/playlist?list=PLuxqoToY7Ucin4gYt5FYbWjLn6NDJ8itB',
              from: 'YouTube'
            }
          ],
          cast: [
            { name: '白柳啓', entity: '村瀬歩' },
            { name: '天翔優利', entity: '愛美' },
            { name: '魅音', entity: '新谷真弓' },
            { name: '霧崎円', entity: '中井和哉' },
            { name: '熊切真', entity: '中村悠一' },
            { name: '多々良りんご', entity: '島袋美由利' },
            { name: '楊婷婷', entity: '鬼頭明里' }
          ],
          staff: [
            { name: '漫画', entity: 'みやこかしわ' },
            { name: '總導演', entity: '内藤明吾' },
            { name: '導演', entity: '新井宣圭' },
            { name: '劇本統籌', entity: '待田堂子' },
            { name: '人物設計', entity: '永作友克' },
            { name: '製作', entity: '小学館集英社プロダクション' },
            { name: '動畫製作', entity: 'シナジーSP' },
            { name: 'CGアニメーション制作', entity: 'Studio A-CAT' }
          ],
          coverMin:
            'https://i0.hdslb.com/bfs/archive/f949d75199264ae7deece9c8a7a9eb68eab40e42.png@672w_378h_1c_100q',
          cover: [
            'https://i0.hdslb.com/bfs/bangumi/image/24d82bc77a58f8b85395a922b61bc97058467614.png',
            'https://i0.hdslb.com/bfs/bangumi/image/91eeb1dd4f6d7c1b29e7122f50d56926fc0c059a.png',
            'https://i0.hdslb.com/bfs/bangumi/cb157a50d75f806e97d228a8f50c43be80c2b61e.jpg',
            'https://i0.hdslb.com/bfs/bangumi/image/290b0c5c399777a6359f1c0dc3cb5e79d3cfd6ca.png'
          ],
          airdate: '12月5日',
          airday: '日',
          airtime: '23:15',
          desc:
            '事情开始在一个与平常并无区别的早晨。最喜欢游戏和金平糖的高中生白柳启，因为一名自称魅音的神秘少女而突然被卷入战场之中。对着被聚集此处的人们，魅音如此说道「各位的户籍已经不存在了」「你们将成为实验的观测器」还有「你们已经被赋予了能力」启决定要利用获得的能力不断赢得游戏，最终击溃这个组织。用谁都不可能猜到的能力，以及极其稀少的“脑”能力作为武器，新时代的头脑派能力战斗开始！'
        },
        {
          id: 2,
          title: '社长，战斗时间到！',
          coverMin:
            'https://i0.hdslb.com/bfs/bangumi/image/290b0c5c399777a6359f1c0dc3cb5e79d3cfd6ca.png@672w_378h_1c_100q',
          cover: [
            'https://i0.hdslb.com/bfs/bangumi/image/290b0c5c399777a6359f1c0dc3cb5e79d3cfd6ca.png',
            'https://i0.hdslb.com/bfs/bangumi/image/24d82bc77a58f8b85395a922b61bc97058467614.png',
            'https://i0.hdslb.com/bfs/bangumi/image/91eeb1dd4f6d7c1b29e7122f50d56926fc0c059a.png',
            'https://i0.hdslb.com/bfs/bangumi/cb157a50d75f806e97d228a8f50c43be80c2b61e.jpg'
          ],
          airdate: '12月5日',
          airday: '日',
          airtime: '23:15'
        }
      ]
    }
  }
})
</script>

<style lang="scss">
.anime-bangumi {
  --grid-item-size: 150px;
  --list-item-header-height: 60px;
  --list-item-info-font-size: 14px;
  --list-item-info-min-font-size: 12px;
}

@media (min-width: 1701px) {
  .anime-bangumi {
    --grid-item-size: 163px;
    --list-item-info-font-size: 16px;
    --list-item-info-min-font-size: 15px;
  }
}
</style>
