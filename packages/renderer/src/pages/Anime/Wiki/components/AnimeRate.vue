<template>
  <div class="anime-rate">
    <div class="the-site">
      <p class="score">暂不支持</p>
      <a-rate :default-value="5"
        readonly />
    </div>
    <div class="other-site">
      <a-space size="medium">
        <span v-for="(rating,key) of siteRating"
          :key="key"
          :title="rating.name+'评分'">
          <img :src="rating.icon">
          <span>{{ rating.score }}</span>
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
  score: number
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
      const url = config.url.replace('{:id}', id)
      const result = await this.apiGet(url)
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
    img {
      width: 1em;
      height: 1em;
      margin-right: 4px;
    }
  }
}
</style>
