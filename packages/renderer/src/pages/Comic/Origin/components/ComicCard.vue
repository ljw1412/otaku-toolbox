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

export default defineComponent({
  name: 'ComicCard',

  props: { info: { type: Object, default: () => ({}) } },

  methods: {
    handleCardClick() {
      const route = this.$router.resolve({
        name: 'ComicDetails',
        params: { namespace: this.$route.params.namespace },
        query: {
          app: 'otakutools',
          path: this.info.path,
          'app-config': JSON.stringify({
            width: 960,
            height: 520,
            resizable: false
          })
        }
      })
      window.open(route.href)
    }
  }
})
</script>

<style lang="scss">
.comic-card {
  cursor: pointer;
}
</style>
