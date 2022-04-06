<script setup lang="ts">
import { ocrStore } from '/@/stores'
import API from '/@/apis/index'

function openOriginManager() {
  API.Electron.win.openVue(
    { name: 'OriginManager', query: { type: 'ocr-lang' } },
    { resizable: false, singleInstance: true, title: '源管理' }
  )
}

</script>

<template>
  <div v-if="!ocrStore.list.length" class="ocr-preset">
    <a-result
      status="error"
      title="检测到您未安装OCR语言模型文件"
      subtitle="请先前往源管理进行下载"
      class="m-auto ocr-preset-result"
    >
      <template #subtitle></template>

      <template #extra>
        <a-space>
          <a-button type="primary" @click="openOriginManager">前往源管理</a-button>
        </a-space>
      </template>
    </a-result>
  </div>
</template>

<style lang="scss">
.ocr-preset {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 300;
  background-color: var(--color-mask-bg);
  backdrop-filter: blur(5px);

  .ocr-preset-result {
    background-color: var(--color-bg-1);
  }
}
</style>
