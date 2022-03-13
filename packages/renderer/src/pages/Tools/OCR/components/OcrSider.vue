<script setup lang="ts">
import { computed } from 'vue'
import { currentImage, store } from '../utils'

const rectList = computed(() =>
  currentImage.value ? currentImage.value.rectList : []
)

const selectedCrop = computed(() => rectList.value.find(item => item.selected))

const handleItemClick = (item: ToolsOCR.CroppedRect) => {
  if (item.selected) return
  rectList.value.forEach(rect => { rect.selected = item === rect })
}
</script>

<template>
  <div class="ocr-sider">
    <div class="current-crop">
      <template v-if="selectedCrop">
        <div class="image-preview">
          <img :src="selectedCrop.preview" />
        </div>
        <div class="crop-text p-4">
          <a-textarea v-model="selectedCrop.text" placeholder="OCR文本" :rows="2"></a-textarea>
          <a-textarea v-model="selectedCrop.translation" placeholder="翻译文本" :rows="2"></a-textarea>
        </div>
      </template>
      <div class="action"></div>
    </div>
    <div class="crop-image-list py-4">
      <div
        v-for="(item, i) of rectList"
        :key="i"
        class="crop-item"
        :class="{ 'is-selected': item.selected }"
        @click="handleItemClick(item)"
      >
        <div class="number d-flex">
          <span class="m-auto">{{ i + 1 }}</span>
        </div>
        <div class="image-preview">
          <img :src="item.preview" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ocr-sider {
  width: 300px;
  flex-shrink: 0;
  background: var(--color-bg-2);
  border-left: 1px solid var(--color-neutral-3);

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .current-crop {
    display: flex;
    flex-direction: column;
    height: 400px;

    .image-preview {
      flex-grow: 1;
      height: 0;
      background-color: var(--color-fill-4);
    }

    .crop-text {
      flex-shrink: 0;
      .arco-textarea {
        resize: none;
      }
    }

    .action {
      height: 32px;
      border-top: 1px solid var(--color-neutral-3);
    }
  }

  .crop-image-list {
    height: calc(100% - 400px);
    border-top: 1px solid var(--color-neutral-3);
    overflow-x: hidden;
    overflow-y: scroll;

    .crop-item {
      display: flex;
      height: 60px;
      margin-bottom: 2px;
      cursor: pointer;

      &.is-selected {
        background-color: var(--color-fill-3);
      }

      .number {
        flex-shrink: 0;
        width: 30px;
      }

      .image-preview {
        flex-grow: 1;
      }
    }
  }
}
</style>
