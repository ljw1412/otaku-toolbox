<template>
  <div class="anime-bangumi"
    :class="{'page-container':$route.meta.separate}">
    <h1>{{ title }}</h1>
    <template v-if="code && !loading">
      <bangumi-grid :animes="bangumiList"
        class="mb-20"></bangumi-grid>
      <bangumi-list :animes="bangumiList"
        class="mb-20"></bangumi-list>
    </template>
    <div v-else-if="isError">
      <span>与母星的通讯受到干扰！</span>
      <span style="color:var(--app-common-color);cursor: pointer;"
        @click="retry">重新连接</span>
    </div>
    <div v-else>
      少女祈祷中……
    </div>

    <special-topic-switch :code="code"
      :list="specialTopicList"
      @code-change="handleCodeChange"></special-topic-switch>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BangumiGrid from './components/BangumiGrid.vue'
import BangumiList from './components/BangumiList.vue'
import SpecialTopicSwitch from './components/SpecialTopicSwitch.vue'

export default defineComponent({
  name: 'AnimeBangumi',

  components: { BangumiGrid, BangumiList, SpecialTopicSwitch },

  data() {
    return {
      loading: true,
      isError: false,
      code: '',
      specialTopicList: [] as SpecialTopic[],
      bangumiList: []
    }
  },
  computed: {
    title(): string {
      const current = this.specialTopicList.find(
        item => item.code === this.code
      )
      if (!current) return ''
      return current.name
    }
  },

  created() {
    this.init()
  },

  methods: {
    async init() {
      this.isError = false
      await this.fetchSpecialTopicList()
      if (this.specialTopicList.length) {
        this.code = this.specialTopicList[0].code
        this.fetchBangumiByCode()
      }
    },

    handleCodeChange(code: string) {
      this.code = code
      this.fetchBangumiByCode()
    },

    async fetchBangumiByCode() {
      this.loading = true
      try {
        this.bangumiList = await this.apiGet('special_topic/preview', {
          data: { code: this.code }
        })
        this.loading = false
      } catch (error) {
        this.isError = true
      }
    },

    async fetchSpecialTopicList() {
      try {
        this.specialTopicList = await this.apiGet('special_topic/codes', {
          data: { type: '新番表' }
        })
      } catch (error) {
        this.isError = true
      }
    },

    async retry() {
      if (!this.code) {
        this.init()
      } else {
        this.fetchBangumiByCode()
      }
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
