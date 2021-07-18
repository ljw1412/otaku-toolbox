<template>
  <div class="anime-timeline position-relative">
    <div class="options">
      <span class="option">2021</span>
      <span class="option">夏</span>
      <span class="option">日</span>

      <span class="option">今:{{ todayDate }}</span>
      <span></span>
    </div>
    <div class="line position-absolute"></div>
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
import { bangumiXml2Json } from '/@/utils/dataParser'

interface TimeLineData {
  list: Record<string, any>[]
  now: Date
  timer: null | number
}

export default defineComponent({
  name: 'AnimeTimeline',

  data(): TimeLineData {
    return {
      list: [],
      now: new Date(),
      timer: null
    }
  },

  computed: {
    todayDate() {
      const now = this.now as Date
      return window.$dayjs(now).format('M-DD')
    }
  },

  created() {
    this.fetchTimeLine()
  },

  beforeUnmount() {
    this.timer && clearInterval(this.timer)
  },

  methods: {
    timeRunner() {
      // @ts-ignore
      this.timer = setInterval(() => {
        this.now = new Date()
      }, 60 * 1000)
    },

    minImage(url: string) {
      if (url.includes('i0.hdslb.com')) {
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

    fetchTimeLine() {
      fetch(
        'http://lab.gpbeta.com/sao-utils/bangumi/weekday_list.php?version=1.2.0.27900&locale=zh_CN&year=2021&season=summer&weekday=sunday'
      )
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
        .then(data => {
          this.list = bangumiXml2Json(data)
        })
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

  .options {
    height: var(--option-height);
    .option {
      padding: 4px;
      background-color: green;
    }
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
