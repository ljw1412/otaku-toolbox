<template>
  <info-group class="media-status-distribution" title="状况分布">
    <a-card :body-style="{ padding: 0, height: '108px' }" :bordered="false">
      <div class="statuses">
        <div
          v-for="item of statusList"
          :key="'status-' + item.name"
          class="status"
          :style="{ width: 100 / statusList.length + '%' }"
        >
          <div class="status-tag" :style="{ backgroundColor: item.color }">
            {{ item.name }}
          </div>
          <div class="status-count">
            <span :style="{ color: item.color }">{{ item.count }}</span> 人
          </div>
        </div>
      </div>
      <div class="percentage-bar">
        <div
          v-for="item of statusList"
          :key="'percentage-' + item.name"
          class="percentage"
          :style="{
            backgroundColor: item.color,
            width: (item.count / sumCount) * 100 + '%'
          }"
        ></div>
      </div>
    </a-card>
  </info-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { fetchStatusCount } from '../utilities/cache'
import InfoGroup from './InfoGroup.vue'
import FAVOURITE_STATUS from '/@/constants/favourite-status.json'

export default defineComponent({
  name: 'MediaStatusDistribution',
  components: { InfoGroup },

  props: { id: String },

  data() {
    return {
      list: [
        { status: 0, count: 0 },
        { status: 1, count: 0 },
        { status: 2, count: 0 },
        { status: -1, count: 0 },
        { status: -2, count: 0 }
      ]
    }
  },

  computed: {
    statusList() {
      return this.list.map((item) => {
        const status = (item.status + '') as '-2' | '-1' | '0' | '1' | '2'
        return { ...item, ...FAVOURITE_STATUS[status] }
      })
    },

    sumCount() {
      return this.list.reduce((sum, item) => {
        return sum + item.count
      }, 0)
    }
  },

  created() {
    this.loadStatusCount()
  },

  methods: {
    async loadStatusCount() {
      const bid = this.$route.params.id as string
      const list = await fetchStatusCount(bid)

      list.forEach((item) => {
        const status = this.list.find((el) => el.status === item._id)
        if (status) {
          status.count = item.count
        }
      })
    }
  }
})
</script>

<style lang="scss">
.media-status-distribution {
  .statuses {
    display: flex;
    flex-wrap: nowrap;
    padding: 24px 10px;
  }

  .status {
    display: inline-block;

    .status-tag {
      border-radius: 4px;
      color: #fff;
      font-size: 14px;
      line-height: 14px;
      margin-bottom: 8px;
      padding: 7px 0;
      margin: 0 6px;
      text-align: center;
    }

    .status-count {
      margin: 8px 6px 0 6px;
      text-align: center;
      font-size: 12px;
      line-height: 12px;
    }
  }

  .percentage-bar {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    border-radius: 0 0 4px 4px;
    overflow: hidden;
    background-color: var(--color-fill-2);

    .percentage {
      display: inline-block;
      height: 12px;
    }
  }
}
</style>
