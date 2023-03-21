<template>
  <info-group
    v-if="streamingPlatforms.length"
    class="media-resources"
    title="媒体资源"
  >
    <a-space wrap size="small">
      <acg-stream-item
        v-for="link of streamingPlatforms"
        :key="link.url"
        v-bind="link"
      ></acg-stream-item>
      <acg-stream-item
        v-if="isSecretMode"
        from="DMHY"
        name="动漫花园"
        region="资源"
        :button-props="{ status: 'warning' }"
        :url="`https://share.dmhy.org/topics/list?keyword=${bangumi.title}`"
      >
      </acg-stream-item>
    </a-space>
  </info-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InfoGroup from './InfoGroup.vue'
import detailMixin from '../utilities/mixin'

export default defineComponent({
  name: 'MediaResources',

  components: { InfoGroup },

  mixins: [detailMixin],

  computed: {
    resources(): BangumiStreaming[] {
      return this.bangumi.streamingPlatforms || []
    },

    streamingPlatforms(): BangumiStreaming[] {
      if (!Array.isArray(this.resources)) return []
      if (this.isSecretMode) return this.resources
      return this.resources.filter((item) => !item.hide)
    }
  }
})
</script>

<style lang="scss"></style>
