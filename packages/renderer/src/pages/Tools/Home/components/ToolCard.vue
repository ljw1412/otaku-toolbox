<template>
  <a-tooltip :content="desc" mini position="bottom">
    <a-card class="tool-card" hoverable :bordered="false" @click="handleCardClick">
      <template #cover>
        <app-favicon :icon="icon" :size="48" class="m-auto mb-8" />
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

  methods: {
    handleCardClick() {
      const to = Object.assign({}, this.to)

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
  width: var(--tool-card-size);
  height: var(--tool-card-size);
  text-align: center;
  box-shadow: 1px 1px 3px var(--color-fill-3);

  &:hover {
    box-shadow: 0 4px 10px rgba(var(--app-color-common-rgb), 0.4) !important;
  }

  .arco-card-cover {
    display: flex;
    align-items: flex-end;
    height: 90px;
  }

  .icon {
    font-size: 60px;

    &.image-icon {
      width: 50px;
      margin: auto;
      margin-top: 20px;
      box-sizing: border-box;
      img {
        width: 100%;
        height: 100%;
      }
    }
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
