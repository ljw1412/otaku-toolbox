<script setup lang="ts">
import { useFileSystemAccess } from '@vueuse/core'
import { computed, watch } from 'vue'
import { state, createImageItem } from '../utils'

const show = computed(() => state.layout.guide.show)

const fs = useFileSystemAccess({
  dataType: 'Blob',
  types: [{ description: '图片', accept: { 'image/*': [] } }],
  excludeAcceptAllOption: true
})

watch(
  () => fs.file.value!,
  (file: File) => {
    state.imageFileList.push(createImageItem(file))
    state.layout.guide.show = false
  }
)

watch(show, (show: boolean) => {
  if (show) { state.layout.guide.allowClose = !!state.imageFileList.length }
})

const handleImageOpen = () => fs.open()
</script>

<template>
  <div v-show="show" class="ocr-file-opener">
    <div class="file-actions m-auto">
      <a-link class="opener-btn" @click="handleImageOpen">
        <icon-file-image :size="128" />
        <div>打开图片</div>
      </a-link>
      <span class="fs-36 px-12">OR</span>
      <a-link class="opener-btn">
        <icon-folder :size="128" />
        <div>打开文件夹</div>
      </a-link>
      <a-button
        v-if="state.layout.guide.allowClose"
        size="large"
        status="danger"
        class="btn-close"
        @click="state.layout.guide.show = false"
      >取消</a-button>
    </div>
  </div>
</template>

<style lang="scss">
.ocr-file-opener {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
  background-color: var(--color-mask-bg);
  backdrop-filter: blur(5px);

  .file-actions {
    position: relative;
    padding-bottom: var(--app-header-mini-height);
  }

  .opener-btn {
    text-align: center;
    width: 180px;
    font-size: 24px;
  }

  .btn-close {
    position: absolute;
    left: 50%;
    bottom: -16px;
    transform: translateX(-50%);
  }
}
</style>


