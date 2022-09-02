<template>
  <div class="anime-rate">
    <div class="the-site">
      <p class="score">暂不支持</p>
      <a-rate :default-value="5" readonly />
    </div>
    <div class="other-site">
      <a-space size="medium">
        <span v-for="(rating, key) of siteRating" :key="key" :title="rating.name + '评分'">
          <img class="icon" :src="rating.icon" />
          <span class="score">{{ rating.score }}</span>
        </span>
      </a-space>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getLogoIcon } from '/@/utils/icons'

interface AnimeRating {
  name: string
  icon: string
  score?: number
}

const ratingConfig = {
  bilibili: {
    url: 'https://api.bilibili.com/pgc/review/user?media_id={:id}',
    icon: getLogoIcon('Bilibili'),
    name: '哔哩哔哩',
    field: 'bilibili',
    resultPath: 'result.media.rating'
  },
  bangumi: {
    url: 'https://api.bgm.tv/v0/subjects/{:id}',
    icon: getLogoIcon('Bangumi'),
    name: 'Bangumi 番组计划',
    field: 'bangumi',
    resultPath: 'rating'
  },
  douban: {
    url: 'https://anltv.cn/douban.php/?id={:id}',
    icon: getLogoIcon('Douban'),
    name: '豆瓣',
    field: 'douban',
    resultPath: 'rating',
    transform: async (resp: Response) => {
      const text = await resp.text()
      const fn = new Function(`return ${text}`)
      const result = fn()
      result.rating = { score: result.data.vod_douban_score }
      return result
    }
  }
}

export default defineComponent({
  name: 'AnimeRate',

  props: { ratingSite: { type: Object, default: () => ({}) } },

  data() {
    return {
      siteRating: {} as Record<string, AnimeRating>
    }
  },

  watch: {
    ratingSite: {
      immediate: true,
      handler() {
        if (this.$global.env.VITE_APP_TYPE === 'Application') {
          Object.keys(this.ratingSite).forEach(key => {
            const config = ratingConfig[key as keyof typeof ratingConfig]
            if (!config) return
            this.fetchOtherSiteRating(config, this.ratingSite[key])
          })
        }
      }
    }
  },

  methods: {
    async fetchOtherSiteRating(config: Record<string, any>, id: string) {
      if (!id) return
      const url = config.url.replace('{:id}', id)
      let result = await this.apiGet(url, { transform: config.transform })
      const pathList = config.resultPath.split('.') as string[]
      let data = result
      pathList.forEach(path => {
        data = data[path]
      })
      console.log(config.field, data)
      this.siteRating[config.field] = Object.assign(
        { icon: config.icon, name: config.name },
        data
      )
    }
  }
})
</script>

<style lang="scss">
.anime-rate {
  .score {
    // display: inline-block;
    line-height: 32px;
    height: 32px;
    font-size: 24px;
    vertical-align: top;
  }

  .other-site {
    font-size: 16px;


    .icon {
      width: 1em;
      height: 1em;
      margin-right: 6px;
    }

    .score {
      font-size: 16px;
      line-height: 1em;
    }
  }
}
</style>
