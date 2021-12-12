<template>
  <a-space v-show="keyword || tags.length"
    :wrap="wrap"
    size="mini"
    class="index-filter-status">
    <a-tag v-if="keyword"
      :closable="keywordClose"
      color="orange"
      @close="$emit('remove-keyword')">关键词：{{keyword}}</a-tag>
    <a-tag v-for="tag of tags"
      :color="tag.group==='type' ? 'green' : 'arcoblue'"
      :key="tag._id">{{tag.name}}</a-tag>
  </a-space>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'IndexFilterStatus',

  props: {
    wrap: { type: Boolean, default: true },
    keyword: String,
    keywordClose: { type: Boolean, default: true },
    tags: { type: Array as PropType<Tag[]>, default: () => [] }
  },

  emits: ['remove-keyword']
})
</script>

<style lang="scss">
</style>
