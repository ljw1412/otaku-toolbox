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
          title: '无敌侠：舞动的英雄',
          titleOriginal: 'MUTEKING THE Dancing HERO',
          titleMore: ['萬能戰士無比敵', '熱舞無比敵', '舞蹈英雄無比敵'],
          tags: ['漫画改', '喜剧', '科幻'],
          onair: 1633195560000,
          onairInSteaming: 1633195560000,
          copyright: '',
          coverMin:
            'https://static.acgsecrets.hk/img/5d/5dd949d4718bc4d2ecc8e098bda7f6dd/554363d7df1c3221d3ef4b2ccfe50d73b87e891af4623ed6b2bd18720775654d.jpg',
          cover: [
            'https://static.acgsecrets.hk/img/5d/5dd949d4718bc4d2ecc8e098bda7f6dd/554363d7df1c3221d3ef4b2ccfe50d73b87e891af4623ed6b2bd18720775654d.jpg',
            'https://static.acgsecrets.hk/img/35/35b10a52546c146ab550631159699d56/f82e305710196f3a9f84e51997c72b82cbed5d2710912d1ebedebed04dcb7e20.jpg'
          ],
          links: [{ name: '官方网站', url: 'https://muteking.jp/' }],
          streamingPlatforms: [
            {
              name: '哔哩哔哩',
              url: 'https://www.bilibili.com/bangumi/media/md28235143/',
              from: 'Bilibili'
            },
            {
              name: '[台]巴哈姆特動畫瘋',
              url: 'https://ani.gamer.com.tw/animeVideo.php?sn=25692',
              from: 'Baha'
            }
          ],
          cast: [
            { name: 'ムテキ', entity: '真白 健太朗' },
            { name: 'DJ', entity: '江口 拓也' },
            { name: 'セオ', entity: '日野 聡' },
            { name: 'アイダさん', entity: '高橋 李依' },
            { name: 'アン', entity: '米澤 円' },
            { name: 'ナオミ', entity: '田所 あずさ' },
            { name: 'サラ', entity: '愛河 里花子' },
            { name: 'ヴィヴィ', entity: '興津 和幸' },
            { name: 'ハル', entity: '京雅' },
            { name: 'サマー', entity: '木村 隼人' },
            { name: 'アキ', entity: '田中 美海' },
            { name: 'ウィンター', entity: '西山 宏太朗' },
            { name: 'ステキング', entity: 'KENN' },
            { name: 'マット', entity: '青山 穣' },
            { name: 'トミー', entity: '松山 鷹志' },
            { name: 'ジョージ', entity: '羽多野 渉' },
            { name: 'オーウェン', entity: '鈴村 健一' }
          ],
          staff: [
            { name: '原作', entity: 'タツノコプロ' },
            { name: '角色原案', entity: 'Utomaru' },
            { name: 'エグゼクティブディレクター', entity: '笹川ひろし' },
            { name: '總導演', entity: '髙橋良輔' },
            { name: '導演', entity: 'サトウユーゾー' },
            { name: '副導演', entity: 'バトルダンスディレクター' },
            { name: '3DCG導演', entity: '乙部善弘' },
            { name: '劇本統籌', entity: '近藤祐次' },
            { name: '音樂', entity: '島崎貴光・増田武史' },
            { name: '音楽プロデューサー', entity: '島崎貴光' },
            {
              name: '音楽制作',
              entity: 'ビクターエンタテインメント、スマイルカンパニー'
            },
            { name: '音效指導', entity: '伊藤巧' },
            {
              name: '動畫製作',
              entity:
                '龍之子Productionタツノコプロ、手塚Production手塚プロダクション'
            }
          ],
          desc:
            '本次故事舞台在自由、热情的海滨城市——新旧金山。搬到这里的无敌，遇到了一位自称DJ的男子。而DJ使无敌变身成为了名叫“无敌侠”的劲舞英雄。二人立志携手用歌声与舞蹈击退突然出现的怪物，守护整个城市。而这一切的背后，一场威胁整个人类的危机正暗流涌动……'
        },

        {
          id: 3,
          title: '世界尽头的圣骑士',
          titleOriginal: '最果てのパラディン',
          titleMore: [
            '世界盡頭的聖騎士',
            'Saihate no Paladin',
            'The Faraway Paladin'
          ],
          tags: ['漫画改', '冒险', '奇幻'],
          onair: 1633788000000,
          onairInSteaming: 1633788000000,
          copyright:
            '© 柳野かなた・オーバーラップ／最果てのパラディン製作委員会',
          coverMin:
            'https://static.acgsecrets.hk/img/cf/cfff49b1922e28a8f060553ea64ea212/d7cc7db99e2c035c57ed2e410fe914b461d084c810e4065d1da7ce6136298103.jpg',
          cover: [
            'https://static.acgsecrets.hk/img/cf/cfff49b1922e28a8f060553ea64ea212/d7cc7db99e2c035c57ed2e410fe914b461d084c810e4065d1da7ce6136298103.jpg'
          ],
          links: [{ name: '官方网站', url: 'https://farawaypaladin.com/' }],
          streamingPlatforms: [
            {
              name: '哔哩哔哩',
              url: 'https://www.bilibili.com/bangumi/media/md28235026/',
              from: 'Bilibili'
            },
            {
              name: '[港澳台]哔哩哔哩',
              url: 'https://www.bilibili.com/bangumi/media/md28235234/',
              from: 'Bilibili'
            },
            {
              name: '[港澳台]爱奇艺',
              url: 'https://ani.gamer.com.tw/animeVideo.php?sn=23337',
              from: 'IQiyi'
            },
            {
              name: '[台]巴哈姆特動畫瘋',
              url: 'https://ani.gamer.com.tw/animeVideo.php?sn=25559',
              from: 'Baha'
            }
          ],
          cast: [
            { name: 'ウィル', entity: '河瀬茉希' },
            { name: 'ブラッド', entity: '小西克幸' },
            { name: 'マリー', entity: '堀江由衣' },
            { name: 'ガス', entity: '飛田展男' },
            { name: 'メネル', entity: '村瀬歩' },
            { name: 'グレイスフィール', entity: '悠木碧' },
            { name: 'スタグネイト', entity: '高橋広樹' }
          ],
          staff: [
            { name: '原作', entity: '柳野かなた' },
            { name: 'キャラクター原画', entity: '輪くすさが' },
            { name: '導演', entity: '信田ユウ' },
            { name: '劇本統籌', entity: '髙橋龍也' },
            { name: '人物設計', entity: '羽田浩二' },
            {
              name: '動畫製作',
              entity: "童園娛樂Children's Playground Entertainment"
            }
          ],
          desc:
            '曾经灭亡的死者之街。那里有一个孩子和三个不死的人。被曾经作为英雄的不死者们养育的少年。继承技能继承知识，注入爱的少年成长。阐发了下去，不死者的过去，奥秘的谜。当知道那一切的时候，少年踏上了通往圣骑士的道路。一个温馨和带有伤感的故事。'
        },
        {
          id: 2,
          title: '国王排名',
          titleOriginal: '王様ランキング',
          titleMore: ['Osama Ranking', 'Ranking of Kings', '國王排名'],
          tags: ['漫画改', '冒险', '奇幻'],
          onair: 1634230500000,
          onairInSteaming: 1634230500000,
          copyright:
            '© 十日草輔・KADOKAWA刊／アニメ「王様ランキング」製作委員会',
          coverMin:
            'https://static.acgsecrets.hk/img/66/66798cf0e440c2b838f28927c3198b0f/2d5c934202cdce2a7442ea8195c3fe1d87b0a0609874c8a203568c1bf2c058a4.jpg',
          cover: [
            'https://static.acgsecrets.hk/img/66/66798cf0e440c2b838f28927c3198b0f/2d5c934202cdce2a7442ea8195c3fe1d87b0a0609874c8a203568c1bf2c058a4.jpg',
            'https://static.acgsecrets.hk/img/86/86b5d5620785b6a5e13732184809609f/19d00a99f484221136c7f7c767d381f3fcacbd49390d5e3f29622606006985c6.jpg',
            'https://static.acgsecrets.hk/img/f0/f040b7f26399c9120375514549c7cf1b/375d1d31b919b69e28f72893f7554c3cd1d3fcb226b68ed9938b73363aaed4b5.jpg'
          ],
          links: [{ name: '官方网站', url: 'https://osama-ranking.com/' }],
          streamingPlatforms: [
            {
              name: '哔哩哔哩',
              url: 'https://www.bilibili.com/bangumi/media/md28235154/',
              from: 'Bilibili'
            }
          ],
          cast: [
            { name: 'ボッジ', entity: '日向未南' },
            { name: 'カゲ', entity: '村瀬歩' },
            { name: 'ダイダ', entity: '梶 裕貴' },
            { name: 'ヒリング', entity: '佐藤利奈' },
            { name: 'ドーマス', entity: '江口拓也' },
            { name: 'ベビン', entity: '上田燿司' },
            { name: 'アピス', entity: '安元洋貴' },
            { name: 'ドルーシ', entity: '田所陽向' },
            { name: 'ホクロ', entity: '山下大輝' }
          ],
          staff: [
            { name: '原作', entity: '十日草輔' },
            { name: '導演', entity: '八田洋介' },
            { name: '副導演', entity: '今井有文' },
            { name: '劇本統籌', entity: '岸本 卓' },
            { name: '人物設計', entity: '野崎あつこ' },
            { name: '總作畫監督', entity: '野崎あつこ、河毛雅妃' },
            { name: '配角人物設計', entity: '河毛雅妃' },
            { name: 'チーフ演出', entity: '渕上 真' },
            { name: '主動畫師', entity: '大城 勝、小笠原真、藤井 望' },
            { name: '美術監督', entity: '金子雄司' },
            { name: '美術設定', entity: '藤井一志' },
            { name: '色彩設計', entity: '橋本 賢' },
            { name: '撮影監督', entity: '出水田和人、上田程之' },
            { name: '編集', entity: '廣瀬清志' },
            { name: '音樂', entity: 'MAYUKO' },
            { name: '音響効果', entity: '緒方康恭' },
            { name: '音效指導', entity: 'えびなやすのり' },
            { name: '動畫製作人', entity: '岡田麻衣子' },
            { name: '動畫製作', entity: 'WIT STUDIO' }
          ],
          desc:
            '国家的丰饶、麾下勇者的数量、以及国王本人如何像勇者一般强大，这些要素的综合排名，便是所谓的“国王排名”。主人公波吉是国王排名第七名的伯斯王治下王国的第一王子。但是波吉却生来又聋又哑，贫弱到挥不动剑。不止家臣甚至连民众都轻蔑地说「他实在不是当国王的料」。这样的波吉人生中第一位交到的朋友，卡克。与卡克的邂逅，以及那些微小的勇气中诞生的，波吉人生的巨变将要开始——'
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
