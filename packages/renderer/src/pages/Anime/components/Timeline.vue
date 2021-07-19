<template>
  <div class="anime-timeline position-relative">
    <div class="anime-timeline-header">
      <timeline-picker @change="fetchTimeLine"></timeline-picker>
    </div>
    <div v-show="list.length"
      class="line position-absolute"></div>
    <ul>
      <li v-for="(item,index) of list"
        :key="index"
        class="item fs-14 w-100 mb-10 pl-20">
        <div class="position-relative">
          <div class="line-dot position-absolute"></div>
          <div>{{ formatDate(item.release).time }}</div>
        </div>
        <div class="d-flex">
          <div class="mr-8">
            <img :src="minImage(item.image)"
              width="80"
              height="80"
              style="object-fit: cover;">
          </div>
          <div>
            <div>{{ item.title['zh_CN'] }}</div>
            <div>共{{ item.episode }}集</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { bangumiXml2Json, obj2query } from '/@/utils/dataParser'
import TimelinePicker from './TimelinePicker.vue'

interface TimeLineData {
  list: Record<string, any>[]
}

export default defineComponent({
  name: 'AnimeTimeline',

  components: {
    TimelinePicker
  },

  data(): TimeLineData {
    return {
      list: []
    }
  },

  methods: {
    minImage(url?: string) {
      if (url && url.includes('i0.hdslb.com')) {
        return `${url}@268w_358h`
      }
      return url
    },

    formatDate(unix: number): { date: string; time: string } {
      const datetime = window.$dayjs(new Date(unix * 1000))
      return {
        date: datetime.format('YYYY-MM-DD'),
        time: datetime.format('HH:mm')
      }
    },

    async fetchTimeLine(query: Record<string, any>) {
      const queryStr = obj2query(query)

      const response = await fetch(
        `http://lab.gpbeta.com/sao-utils/bangumi/weekday_list.php?${queryStr}`
      )
      if (response.status !== 404) {
        const str = await response.text()
        const data = new window.DOMParser().parseFromString(str, 'text/xml')
        this.list = bangumiXml2Json(data)
      } else {
        this.list = []
      }
    }
  }
})
</script>

<style lang="scss">
.anime-timeline {
  --option-height: 36px;
  height: 100%;
  width: 33.33%;
  box-shadow: 0 0 5px #cccccc;
  overflow: hidden;

  .anime-timeline-header {
    height: var(--option-height);
  }

  > ul {
    height: calc(100% - var(--option-height));
    overflow-y: auto;

    .item {
      box-sizing: border-box;
    }
  }

  .line {
    width: 2px;
    height: 100%;
    left: 10px;
    background-color: var(--timeline-color, var(--title-bar-color));
  }

  .line-dot {
    width: 8px;
    height: 8px;
    top: 50%;
    left: -13px;
    transform: translateY(-50%);
    border-radius: 50%;
    background-color: var(--timeline-color, var(--title-bar-color));
  }
}
</style>
