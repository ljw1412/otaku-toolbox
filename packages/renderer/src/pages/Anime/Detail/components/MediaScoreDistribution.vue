<template>
  <info-group class="media-score-distribution" title="评分分布">
    <a-card
      :body-style="{ padding: 0, height: '108px', boxSizing: 'border-box' }"
      :bordered="false"
    >
      <div class="ct-chart-score"></div>
    </a-card>
  </info-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InfoGroup from './InfoGroup.vue'
import { BarChart } from 'chartist'
import { fetchReviewStats } from '../utilities/cache'

export default defineComponent({
  name: 'MediaScoreDistribution',

  components: { InfoGroup },

  data() {
    return {
      chart: null as BarChart | null,
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      series: [] as number[][]
    }
  },

  mounted() {
    this.initChart()
    this.loadStats()
  },

  methods: {
    initChart() {
      this.chart = new BarChart(
        '.ct-chart-score',
        {
          labels: this.labels,
          series: this.series
        },
        {
          width: '100%',
          height: '100%',
          seriesBarDistance: 0,
          chartPadding: {
            top: 30,
            right: 10,
            bottom: 5,
            left: 10
          },
          axisX: {
            offset: 20,
            showGrid: false,
            scaleMinSpace: 1,
            labelOffset: { x: 0, y: 5 }
          },
          axisY: {
            showLabel: false,
            offset: 0,
            showGrid: false
          }
        }
      )

      this.chart.on('draw', (data) => {
        if ('bar' === data.type) {
          // @ts-ignore
          const value = data.value.y || '0'
          data.group
            .elem(
              'text',
              { x: data.x1, y: data.y2 - 12, style: 'text-anchor: middle;' },
              'label-text'
            )
            .text(value)
          data.element.attr({
            style: `stroke: hsl(${
              // @ts-ignore
              data.axisX.ticks[data.index] * 10
            }, 65%, 50%)`,
            'stroke-linecap': 'round'
          })
        }
      })
    },

    async loadStats() {
      const bid = this.$route.params.id as string
      const result = await fetchReviewStats(bid)

      const list = new Array(10).fill(0)
      result.forEach((item) => {
        list[item.score - 1] = item.count
      })
      this.series = [list]
      if (this.chart) {
        this.chart.update({ labels: this.labels, series: this.series })
      }
    }
  }
})
</script>

<style lang="scss">
.media-score-distribution {
  .ct-chart-score {
    position: relative;
    height: 100%;
  }

  .ct-bar {
    stroke-width: 15px;
  }
}
</style>
