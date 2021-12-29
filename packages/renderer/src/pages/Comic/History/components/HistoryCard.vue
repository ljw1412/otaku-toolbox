<template>
  <a-card class="comic-history-card"
    :bordered="false"
    @click="handleCardClick">
    <template #cover>
      <acg-ratio-div :ratio="[3,4]">
        <img :src="history.cover"
          loading="lazy">
      </acg-ratio-div>
    </template>
    <a-card-meta>
      <template #title>
        <div class="title">{{ history.title }}</div>
      </template>
      <template #description>
        <div>看到{{ history.name }} 第{{ history.index }}页</div>
        <div>{{ historyTime }}</div>
      </template>
    </a-card-meta>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { openVueView } from '/@/utils/electron'

export default defineComponent({
  name: 'ComicHistoryCard',

  props: {
    history: { type: Object as PropType<ComicHistory>, default: () => ({}) }
  },

  computed: {
    historyTime() {
      if (this.history.time) {
        return this.$dayjs(this.history.time).format('YYYY-MM-DD hh:mm:ss')
      }
      return ''
    }
  },

  methods: {
    handleCardClick() {
      openVueView(
        {
          name: 'ComicDetails',
          params: {
            namespace: this.history.namespace
          },
          query: { path: this.history.ppath }
        },
        { width: 960, height: 520, resizable: false }
      )
    }
  }
})
</script>

<style lang="scss">
.comic-history-card {
  cursor: pointer;
  display: flex;
  .arco-card-cover {
    width: 30%;
  }

  .title {
    height: 2em;
    margin-bottom: 4px;
  }
}
</style>
