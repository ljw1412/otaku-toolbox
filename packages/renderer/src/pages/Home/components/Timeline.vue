<template>
  <div class="bangumi-timeline position-relative">
    <div class="bangumi-timeline-header">
      <timeline-picker @change="fetchTimeLine"></timeline-picker>
    </div>

    <ul>
      <li v-for="(item,index) of list"
        :key="index"
        class="item fs-14 w-100 my-10 cursor-pointer">
        <div class="position-relative pl-10">
          <div class="line-dot position-absolute"></div>
          <div>{{ formatDate(item.release).time }}</div>
        </div>
        <div class="bangumi d-flex py-4 px-8"
          @click="onSelect(item)">
          <img :src="minImage(item.image)"
            width="80"
            height="80"
            style="object-fit: cover;"
            class="flex-shrink-0">
          <div class="ml-8">
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
import { bangumiXml2Json, obj2query, minImage } from '/@/utils/dataParser'
import TimelinePicker from './TimelinePicker.vue'

interface TimeLineData {
  list: Record<string, any>[]
}

export default defineComponent({
  name: 'AnimeTimeline',

  components: {
    TimelinePicker
  },

  emits: ['select'],

  data(): TimeLineData {
    return {
      list: []
    }
  },

  methods: {
    minImage,

    onSelect(item: Record<string, any>) {
      this.$emit('select', item)
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
.bangumi-timeline {
  --option-height: 36px;
  height: 100%;
  background-color: var(--bg-bangumi-color);
  border: 1px solid var(--border-color);
  overflow: hidden;
  z-index: 100;

  .bangumi-timeline-header {
    height: var(--option-height);
  }

  > ul {
    height: calc(100% - var(--option-height));
    overflow-y: auto;

    .item {
      box-sizing: border-box;
      .bangumi:hover {
        background-color: rgba(165, 165, 165, 0.25);
      }
    }
  }

  .line-dot {
    width: 4px;
    height: 12px;
    top: 50%;
    left: 0px;
    transform: translateY(-50%);
    background-color: var(--timeline-color, var(--title-bar-color));
  }
}
</style>
