<template>
  <a-card
    class="comic-history-card"
    hoverable
    :bordered="false"
    :body-style="{ padding: '4px 8px' }"
    @click="handleCardClick"
  >
    <template #cover>
      <acg-ratio-div :ratio="[3, 4]">
        <img :src="history.cover" loading="lazy" :class="{ 'filter-gray': !originName }" />
      </acg-ratio-div>
    </template>

    <h5 class="title multi-text-truncate color-text-1" data-line="2">{{ history.title }}</h5>
    <div class="description mt-8">
      <div>看到{{ history.name }} 第{{ history.index }}页</div>
      <div class="mt-4">{{ historyTime }}</div>
    </div>
    <div class="origin-tag text-right">
      <a-tag :color="originName ? 'green' : 'red'">{{ originName || '源不存在' }}</a-tag>
    </div>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { comicStore } from '/@/stores'

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
    },
    originName() {
      return comicStore.nameMap[this.history.namespace!]
    }
  },

  methods: {
    handleCardClick() {
      if (!this.originName) {
        this.$message.error('源不存在，无法阅读！')
        return
      }
      this.$API.Electron.win.openVue(
        {
          name: 'ComicDetails',
          params: { namespace: this.history.namespace },
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
  position: relative;
  cursor: pointer;
  display: flex;
  &.arco-card {
    transition-property: box-shadow, transform;
    &:hover {
      transform: translateY(-4px);
    }
  }

  .arco-card-cover {
    width: 30%;
    flex-shrink: 0;
  }

  .arco-card-body {
    flex-grow: 1;
    width: 0;
  }

  .title {
    height: 2.2em;
    margin-bottom: 4px;
    white-space: normal;
  }

  .origin-tag {
    position: absolute;
    bottom: 8px;
    right: 8px;
  }
}
</style>
