<template>
  <div class="anime-bangumi" :class="{ 'page-container': $route.meta.separate }">
    <div v-show="bangumiList.length" class="anime-bangumi-header mb-20">
      <acg-ratio-div class="cover" :ratio="[4, 3]">
        <img
          :src="currentSTopic.cover || 'http://i0.hdslb.com/bfs/album/8a9094bb72b681a815ddf4b7010d4d356b9b5467.png'"
        />
      </acg-ratio-div>

      <bangumi-filter
        :animes="bangumiList"
        @change="handleFilterChange"
        @group-by-change="handleFilterGroupByChange"
      >
        <template #header>
          <h1 class="page-title">
            {{ title }}
            <span v-show="total">[{{ total }}部]</span>
          </h1>
        </template>
      </bangumi-filter>
    </div>
    <template v-if="code && !isLoading">
      <bangumi-grid :anime-group-list="bangumiGroupList" class="mb-20"></bangumi-grid>
      <bangumi-list :animes="filterBangumiList" class="mb-20"></bangumi-list>
    </template>
    <div v-else>
      <acg-api-result :error="isError" @retry="retry"></acg-api-result>
    </div>

    <special-topic-switch :code="code" :list="specialTopicList"></special-topic-switch>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BangumiFilter from './components/BangumiFilter.vue'
import BangumiGrid from './components/BangumiGrid.vue'
import BangumiList from './components/BangumiList.vue'
import SpecialTopicSwitch from './components/SpecialTopicSwitch.vue'
import { betterWeekdayName } from '/@/utils/date'

const nowYear = new Date().getFullYear() + ''

export default defineComponent({
  name: 'AnimeBangumi',

  components: { BangumiFilter, BangumiGrid, BangumiList, SpecialTopicSwitch },

  props: { code: String },

  data() {
    return {
      isLoading: true,
      isError: false,
      isDisplaySwitch: false,
      groupBy: '',
      filterTagList: [] as Tag[],
      specialTopicList: [] as SpecialTopic[],
      bangumiList: [] as BangumiBasicWithTime[]
    }
  },

  computed: {
    currentSTopic() {
      return this.specialTopicList.find(
        (item) => item.code === this.code
      ) || { cover: '', name: '' }
    },

    title(): string {
      if (!this.currentSTopic) return ''
      return this.currentSTopic.name
    },

    total() {
      return this.bangumiList.filter(item => !item.isSubTagMatched).length
    },

    filterBangumiList(): BangumiBasicWithTime[] {
      let list = [...this.bangumiList]
      if (this.groupBy === 'day') {
        list = this.sortByDay(list)
      } else if (this.groupBy === 'onair') {
        list = this.sortByOnair(list)
      }
      if (!this.filterTagList.length) return list
      const filterTagIdList = this.filterTagList.map(tag => tag._id)
      return list.filter(bangumi => {
        let i = 0
        bangumi.tags.forEach(tag => {
          if (filterTagIdList.includes(tag._id)) i++
        })
        return i === filterTagIdList.length
      })
    },

    bangumiGroupList(): BangumiBasicGroup[] {
      if (this.groupBy === 'day') {
        return this.filterByDay(this.filterBangumiList)
      } else if (this.groupBy === 'onair') {
        return this.filterByOnair(this.filterBangumiList)
      }
      return [{ list: this.filterBangumiList }]
    }
  },

  watch: {
    '$route.path'() {
      this.$nextTick(() => {
        if (this.$route.name !== 'AnimeBangumi') return
        if (!this.code) {
          this.initCode()
          return
        }
        this.fetchBangumiByCode()
      })
    }
  },

  created() {
    this.init()
  },

  methods: {
    async init() {
      this.fetchSpecialTopicList()
      if (this.code) {
        this.fetchBangumiByCode()
      }
    },

    initCode() {
      if (!this.code && this.specialTopicList.length) {
        const { code } =
          this.specialTopicList.find(item => item.current) ||
          this.specialTopicList[0]

        this.$router.replace({
          params: { code }
        })
      }
    },

    sortByDay(bangumiList: BangumiBasicWithTime[]) {
      return bangumiList.sort((a, b) => {
        let aDay = a.formatOnair[this.hourSystem].day
        let bDay = b.formatOnair[this.hourSystem].day
        if (aDay === undefined) aDay = 99
        if (bDay === undefined) bDay = 99
        if (aDay > bDay) return 1
        if (aDay === bDay) return a.onair > b.onair ? 1 : -1
        return -1
      })
    },

    sortByOnair(bangumiList: BangumiBasicWithTime[]) {
      return bangumiList.sort((a, b) => {
        const aOnair = a.onair ? +new Date(a.onair) : Infinity
        const bOnair = b.onair ? +new Date(b.onair) : Infinity
        return aOnair > bOnair ? 1 : -1
      })
    },

    filterByDay(filterBangumiList: BangumiBasicWithTime[]) {
      const groupList: BangumiBasicGroup[] = []
      filterBangumiList.forEach(item => {
        let day = item.formatOnair[this.hourSystem].day
        if (day === undefined) day = 7
        if (!groupList[day]) {
          groupList[day] = {
            title: day < 7 ? betterWeekdayName(day) : '暂未定档',
            list: [item]
          }
        } else {
          groupList[day].list.push(item)
        }
      })
      return groupList
    },

    filterByOnair(filterBangumiList: BangumiBasicWithTime[]) {
      const onairGroup: Record<string, BangumiBasicWithTime[]> = {}
      filterBangumiList.forEach(item => {
        const formatOnair = item.formatOnair[this.hourSystem]
        let dateCH =
          nowYear === formatOnair.years
            ? formatOnair.dateCH
            : formatOnair.fullDateCH
        if (dateCH === undefined) dateCH = '暂未定档'
        if (item.isSubTagMatched) dateCH = '跨季放送'
        if (!onairGroup[dateCH]) {
          onairGroup[dateCH] = [item]
        } else {
          onairGroup[dateCH].push(item)
        }
      })
      return Object.keys(onairGroup).map(key => ({
        title: key,
        list: onairGroup[key]
      }))
    },

    async fetchBangumiByCode() {
      this.isLoading = true
      try {
        this.bangumiList = []
        const list = await this.$API.SpecialTopic.preview(this.code!)

        this.bangumiList = list.sort((a, b) => {
          const onairA = a.isSubTagMatched ? '2098' : a.onair || '2099'
          const onairB = b.isSubTagMatched ? '2098' : b.onair || '2099'
          return onairA > onairB ? 1 : -1
        })
        this.isLoading = false
        // if (location.hash) {
        //   this.$nextTick(() => {
        //     const el = document.querySelector(location.hash)
        //     this.$nextTick(() => {
        //       if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        //     })
        //   })
        // }
      } catch (error) {
        this.isError = true
      }
    },

    async fetchSpecialTopicList() {
      try {
        this.specialTopicList = await this.$API.SpecialTopic.listSpecialTopic(
          'TV'
        )

        this.initCode()
      } catch (error) {
        this.isError = true
      }
    },

    async retry() {
      this.isError = false
      if (!this.code) {
        this.init()
      } else {
        this.fetchBangumiByCode()
      }
    },

    handleFilterChange(list: Tag[]) {
      this.filterTagList = list
    },

    handleFilterGroupByChange(groupBy: string) {
      this.groupBy = groupBy
    }
  }
})
</script>

<style lang="scss">
.anime-bangumi {
  --grid-item-size: 156px;
  --list-item-header-height: 60px;
  --list-item-info-font-size: 16px;
  --list-item-info-min-font-size: 13px;
  --list-item-gallery-item-size: 80px;
  --list-item-link-icon-size: 4em;

  .anime-bangumi-header {
    display: flex;
    margin-top: 20px;

    .cover {
      width: 40%;
      flex-grow: 1;
    }

    .bangumi-filter {
      width: 60%;
      box-sizing: border-box;
      flex-shrink: 0;
    }
  }

  .page-title {
    margin: 16px 0;
    font-size: 32px;
    padding-left: 8px;
  }

  .mb-20 {
    margin-bottom: 20px;
  }

  .acg-area-header {
    .left::before {
      content: "";
      width: 4px;
      height: 18px;
      margin-top: 3px;
      margin-right: 8px;
      background-color: var(--app-color-common);
    }
  }
}

@media (min-width: 1750px) {
  .anime-bangumi {
    --grid-item-size: 164px;
  }
}

@media (max-width: 1599.9px) {
  .anime-bangumi {
    --list-item-info-font-size: 14px;
    --list-item-info-min-font-size: 12px;
    --list-item-gallery-item-size: 64px;
  }
}
</style>
