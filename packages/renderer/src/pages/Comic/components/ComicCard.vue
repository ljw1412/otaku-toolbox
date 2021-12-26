<template>
  <div class="comic-card-wrap">
    <a-card class="comic-card"
      :body-style="{padding:'6px 4px'}"
      @click="handleCardClick">
      <template #cover>
        <acg-ratio-div :ratio="[3,4]">
          <a-image :src="info.cover"
            :preview="false"
            loading="lazy"
            width="100%"
            height="100%">
          </a-image>
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
import { openVueView } from '/@/utils/electron'

export default defineComponent({
  name: 'ComicCard',

  props: { info: { type: Object, default: () => ({}) } },

  methods: {
    handleCardClick() {
      openVueView(
        {
          name: 'ComicDetails',
          params: {
            namespace: this.$route.params.namespace || this.info.namespace
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
}
</style>
