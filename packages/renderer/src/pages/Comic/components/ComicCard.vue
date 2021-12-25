<template>
  <div class="comic-card-wrap">
    <a-card class="comic-card"
      :body-style="{padding:0}"
      @click="handleCardClick">
      <template #cover>
        <acg-ratio-div :ratio="[3,4]">
          <a-image :src="info.cover"
            :title="info.title"
            :description="info.author"
            :preview="false"
            loading="lazy"
            width="100%"
            height="100%">
          </a-image>
        </acg-ratio-div>
      </template>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { openVueView } from '/@/utils/electron'

export default defineComponent({
  name: 'ComicCard',

  props: { info: { type: Object, default: () => ({}) }, namespace: String },

  methods: {
    handleCardClick() {
      openVueView(
        {
          name: 'ComicDetails',
          params: { namespace: this.$route.params.namespace || this.namespace },
          query: { path: this.info.path || this.info.key }
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
