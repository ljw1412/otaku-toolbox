<template>
  <a-card class="media-base-info" :bordered="false">
    <a-descriptions
      layout="vertical"
      :column="isMobileSize ? 2 : 1"
      :data="bangumiInfo"
      :label-style="{
        'font-size': '13px',
        'font-weight': 700,
        color: 'var(--color-text-2)',
        'padding-bottom': 0
      }"
      :value-style="{ 'font-size': '12px', color: 'var(--color-text-3)' }"
    ></a-descriptions>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue'
import { DescData } from '@arco-design/web-vue'
import detailMixin from '../utilities/mixin'

export default defineComponent({
  name: 'MediaBaseInfo',

  mixins: [detailMixin],

  computed: {
    onair(): FormatedAnimeDatetime {
      if (this.bangumi && this.bangumi.formatOnair) {
        return this.bangumi.formatOnair[this.hourSystem]
      }
      return {} as FormatedAnimeDatetime
    },

    invalidOnair() {
      return !this.onair.unix
    },

    bangumiInfo() {
      const list: DescData[] = [
        {
          label: '首播日期',
          value: this.invalidOnair ? '未知' : this.onair.fullDateCH
        },
        {
          label: '放送时间',
          value: this.invalidOnair
            ? '未知'
            : `每周${this.onair.dayCH} ${this.onair.time}`
        },
        {
          label: '类型',
          value: this.bangumi.type
        },
        {
          label: '集数',
          value: this.bangumi.episodes
            ? this.bangumi.episodes +
              (this.bangumi.status < 2 ? '（预计）' : '')
            : '-'
        },
        {
          label: '状态',
          value: this.bangumi.statusCH,
          span: this.isMobileSize ? 2 : 1
        }
      ]

      if (this.bangumi.titleMore && this.bangumi.titleMore.length) {
        list.push({
          label: '更多名称',
          value: () => {
            if (this.isMobileSize) {
              return h('p', (this.bangumi.titleMore || []).join('、'))
            }
            return (this.bangumi.titleMore || []).map((item) => h('p', item))
          },
          span: this.isMobileSize ? 2 : 1
        })
      }

      return list
    }
  }
})
</script>

<style lang="scss"></style>
