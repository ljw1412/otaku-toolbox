<template>
  <a-tooltip :content="desc" mini position="bottom">
    <a-card class="tool-card" hoverable :bordered="false" @click="handleCardClick">
      <template #cover>
        <component :is="iconType" class="icon" v-bind="iconProps"></component>
      </template>
      <a-card-meta :title="name">
        <template #description>
          <a-tag v-if="isDev" color="orange" size="small">开发版</a-tag>
        </template>
      </a-card-meta>
    </a-card>
  </a-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ToolCard',

  props: {
    isDev: { type: Boolean, default: false },
    icon: { type: String, default: 'icon-common' },
    name: { type: String, default: '' },
    desc: { type: String, default: '' },
    to: { type: Object, default: () => ({}) },
    config: { type: Object, default: () => ({}) }
  },

  computed: {
    iconType() {
      return this.icon.startsWith('icon-') || !this.icon ? this.icon : 'AImage'
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
      this.$API.Electron.win.openVue(this.to,
        Object.assign(
          {
            resizable: false,
            singleInstance: true,
            title: this.name
          },
          this.config
        )
      )
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
