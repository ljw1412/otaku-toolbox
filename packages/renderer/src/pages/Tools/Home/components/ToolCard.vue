<template>
  <a-card class="tool-card"
    hoverable
    :bordered="false"
    @click="handleCardClick">
    <template #cover>
      <component :is="iconType"
        class="icon"
        v-bind="iconProps"></component>
    </template>
    <a-tooltip :content="desc"
      mini
      position="bottom">
      <a-card-meta :title="name"></a-card-meta>
    </a-tooltip>
  </a-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { openVueView } from '/@/utils/electron'

export default defineComponent({
  name: 'ToolCard',

  props: {
    icon: { type: String, default: 'icon-common' },
    name: { type: String, default: '' },
    desc: { type: String, default: '' },
    to: { type: Object, default: () => ({}) }
  },

  computed: {
    iconType() {
      return this.icon.startsWith('icon-') || !this.icon
        ? 'icon-common'
        : 'AImage'
    },

    iconProps() {
      if (this.iconType === 'AImage') {
        return { src: this.icon }
      }
      return {}
    }
  },

  methods: {
    handleCardClick() {
      openVueView(this.to, { resizable: false })
    }
  }
})
</script>

<style lang="scss">
.tool-card {
  cursor: pointer;
  width: 160px;
  height: 160px;
  text-align: center;

  .arco-card-cover {
    display: flex;
    align-items: flex-end;
    height: 90px;
  }

  .icon {
    font-size: 60px;
  }
}
</style>
