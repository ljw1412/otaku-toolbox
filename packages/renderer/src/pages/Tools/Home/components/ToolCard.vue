<template>
  <a-tooltip :content="desc" mini position="bottom">
    <a-card class="tool-card" hoverable :bordered="false" @click="handleCardClick">
      <template #cover>
        <component :is="iconType" class="icon" v-bind="iconProps"></component>
      </template>
      <div v-if="isPlugin" class="plugin-tag">
        <icon-thunderbolt size="18" />
        <div class="bg"></div>
      </div>
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
    isPlugin: Boolean,
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
      const to = Object.assign({}, this.to)
      if (this.icon && this.iconType !== 'AImage') {
        if (!to.query) to.query = {}
        if (!to.query.icon) to.query.icon = this.icon
      }

      this.$API.Electron.win.openVue(to,
        Object.assign(
          { resizable: false, singleInstance: true, title: this.name },
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
  width: 158px;
  height: 158px;
  text-align: center;
  box-shadow: 1px 1px 3px var(--color-fill-3);

  .arco-card-cover {
    display: flex;
    align-items: flex-end;
    height: 90px;
  }

  .icon {
    font-size: 60px;
  }

  .plugin-tag {
    position: absolute;
    top: 0;
    right: 0;
    width: 42px;
    height: 42px;
    overflow: hidden;

    .arco-icon {
      position: absolute;
      top: 2px;
      right: 2px;
      z-index: 1;
      color: #fff;
    }

    .bg {
      position: absolute;
      top: -14px;
      right: -14px;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      background-color: var(--app-color-common);
      z-index: 0;
    }
  }
}
</style>
