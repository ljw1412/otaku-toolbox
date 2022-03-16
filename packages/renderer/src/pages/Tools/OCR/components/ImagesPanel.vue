<script setup lang="ts">
import { computed } from 'vue'
import { state } from '../utils'

const show = computed({
  get() {
    return state.layout.imagePanel.show
  }, set(value: boolean) {
    state.layout.imagePanel.show = value
  }
})

const handleImageSelect = (item: ToolsOCR.ImageFileItem) => {
  if (item.selected) return
  state.imageFileList.forEach(imgItem => {
    imgItem.selected = item === imgItem
  })
}
</script>

<template>
  <div class="ocr-images-panel">
    <a-button type="primary" class="toggle-btn" @click="show = !show">
      <template #icon>
        <component :is="show ? 'icon-menu-fold' : 'icon-layers'"></component>
      </template>
    </a-button>
    <transition name="acg-slide-left">
      <div v-show="show" class="panel">
        <header>图片列表({{ state.imageFileList.length }})</header>
        <main>
          <ul class="image-list">
            <li
              v-for="item of state.imageFileList"
              :key="item.name"
              :title="item.name"
              :class="{ 'is-selected': item.selected }"
              class="image-item mb-8"
              @click="handleImageSelect(item)"
            >
              <div class="image">
                <img :src="item.url" />
              </div>
              <div class="name mt-4 py-4 text-truncate">{{ item.name }}</div>
            </li>
          </ul>
        </main>
        <footer>
          <a-button long @click="state.layout.guide.show = true">+</a-button>
        </footer>
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
.ocr-images-panel {
  position: absolute;
  left: 10px;
  top: 10px;
  bottom: 10px;
  width: 160px;
  z-index: 50;

  .toggle-btn {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
  }

  .panel {
    height: 100%;
    margin-top: -1px;
    box-sizing: border-box;
    border: 1px solid var(--color-neutral-3);
    border-radius: var(--border-radius-small);
    background: var(--color-bg-2);

    header {
      height: 32px;
      line-height: 32px;
      padding-left: 40px;
      border-bottom: 1px solid var(--color-neutral-3);
      overflow: hidden;
    }

    main {
      height: calc(100% - 64px - 2px);
      padding-right: 4px;
      padding-left: calc(var(--scroll-bar-width) + 4px);
      overflow-y: scroll;
      overflow-x: hidden;
    }

    footer {
      height: 32px;
      border-top: 1px solid var(--color-neutral-3);
    }

    .image-list {
      padding: 10px 0;
      .image-item {
        cursor: pointer;
        border: 1px solid transparent;
        &:hover {
          background-color: var(--color-fill-1);
        }
        &.is-selected {
          background-color: rgba(200, 200, 200, 0.3);
          box-shadow: 1px 1px 6px var(--app-color-common);
        }
      }

      .image {
        height: 100px;
        background-color: var(--color-fill-2);
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .name {
        word-break: keep-all;
        text-align: center;
      }
    }
  }
}
</style>
