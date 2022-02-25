<template>
  <div class="comic-card-wrap">
    <a-card class="comic-card"
      hoverable
      :bordered="false"
      :body-style="{padding:'6px 4px'}"
      @click="handleCardClick">
      <template #cover>
        <acg-ratio-div :ratio="[3,4]">
          <a-image :src="info.cover"
            :preview="false"
            loading="lazy"
            width="100%"
            height="100%"
            :class="{'filter-gray': !originName}">
          </a-image>
          <a-tag v-if="showTag" class="origin-tag"
            :color="originName ? '#00b42a' : '#f53f3f'"
            size="small">{{ originName || '源不存在' }}</a-tag>
        </acg-ratio-div>
      </template>
      <a-card-meta :title="info.title">
        <template #description>
          <div class="author text-truncate">{{ info.author }}</div>
        </template>
      </a-card-meta>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { comicStore } from '/@/stores'
import { openVueView } from '/@/utils/electron'

export default defineComponent({
  name: 'ComicCard',

  props: {showTag:Boolean, info: { type: Object, default: () => ({}) } },

  computed: {
    namespace() {
      return this.$route.params.namespace || this.info.namespace
    },

    originName(): string {
      return comicStore.nameMap[this.namespace]
    }
  },

  methods: {
    handleCardClick() {
      if (!this.originName) {
        this.$message.error('源不存在，无法阅读！')
        return
      }
      openVueView(
        {
          name: 'ComicDetails',
          params: {
            namespace: this.namespace
          },
          query: { path: this.info.path }
        },
        { width: 960, height: 520, resizable: false }
      )
    }
  }
})
</script>

<style lang="scss">
.comic-card {
  cursor: pointer;

  &.arco-card {
    transition-property: box-shadow, transform;
    &:hover {
      transform: translateY(-4px);
    }
  }

  .origin-tag {
    position: absolute;
    left: 10px;
    top: 10px;
  }
}
</style>
