<template>
  <info-group
    v-if="episodes.length"
    class="media-ep-score-distribution"
    title="各话评分"
  >
    <a-card :body-style="{ padding: 0, height: '208px' }" :bordered="false">
      <div class="ct-chart-ep-score" :style="chartStyles"></div>
    </a-card>
  </info-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InfoGroup from './InfoGroup.vue'
import cache from '../utilities/cache'
import { LineChart, SeriesObjectValue } from 'chartist'

export default defineComponent({
  name: 'MediaEpScoreDistribution',

  components: { InfoGroup },

  data() {
    return {
      chart: null as LineChart | null
    }
  },

  computed: {
    episodes() {
      const bid = this.$route.params.id as string
      if (cache.episodesInfo[bid]) {
        return cache.episodesInfo[bid].episodeList
      }
      return []
    },

    labels(): number[] {
      return this.episodes.map((item) => item.ep)
    },

    series(): SeriesObjectValue<number>[][] {
      return [
        this.episodes.map((item) => ({
          meta: item.state.review,
          value: item.state.score
        }))
      ]
    },

    chartStyles() {
      if (this.episodes.length < 15) return {}
      return {
        width: `${(this.episodes.length / 13) * 100}%`
      }
    }
  },

  watch: {
    episodes: {
      immediate: true,
      handler(episodes) {
        this.$nextTick(() => {
          if (this.chart) {
            this.chart.update({ labels: this.labels, series: this.series })
          } else if (episodes.length) {
            this.initChart()
          }
        })
      }
    }
  },

  methods: {
    initChart() {
      this.chart = new LineChart(
        '.ct-chart-ep-score',
        {
          labels: this.labels,
          series: this.series
        },
        {
          width: '100%',
          height: '100%',
          chartPadding: {
            top: 30,
            right: 30,
            bottom: 15,
            left: 10
          },
          fullWidth: true,
          axisX: {
            offset: 30,
            showGrid: true,
            scaleMinSpace: 1,
            onlyInteger: true,
            labelOffset: { x: -4, y: 15 }
          },
          axisY: {
            low: 0,
            high: 10,
            onlyInteger: true,
            scaleMinSpace: 20,
            showLabel: true,
            offset: 30,
            showGrid: true,
            labelOffset: { x: -4, y: 4 }
          }
        }
      )

      this.chart.on('draw', (data) => {
        if ('point' === data.type) {
          // @ts-ignore
          const value = data.value.y || '0'
          data.group
            .elem(
              'text',
              { x: data.x, y: data.y - 8, style: 'text-anchor: start;' },
              'label-text'
            )
            .text(value)
          if (data.meta) {
            data.group
              .elem(
                'text',
                {
                  x: data.x,
                  y: data.y + 16,
                  style: 'text-anchor: start;font-size: 10px;'
                },
                'label-text hoverable'
              )
              .text(data.meta + '人')
          }
          data.element.attr({
            style: `stroke: hsl(${value * 10}, 65%, 50%)`
          })
        }
        // console.log(data);
      })
    }
  }
})
</script>

<style lang="scss">
.media-ep-score-distribution {
  .arco-card-body {
    box-sizing: border-box;
    overflow-y: hidden;
    overflow-x: auto;
  }

  .ct-chart-ep-score {
    height: 100%;
  }

  .ct-grid {
    stroke: var(--color-border);
  }

  .ct-point {
    stroke-width: 8px;
  }

  .ct-line {
    stroke: var(--app-color-common);
    stroke-width: 2px;
  }

  .label-text.hoverable {
    opacity: 0;
  }

  &:hover .label-text.hoverable {
    opacity: 1;
  }
}
</style>
