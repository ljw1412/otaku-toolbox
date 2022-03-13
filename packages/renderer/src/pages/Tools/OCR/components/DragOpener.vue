<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { store, createImageItem } from '../utils'

const vm = getCurrentInstance()
const props = defineProps<{ visible: boolean }>()
const emit = defineEmits(['update:visible'])

const useMessage = () => {
  if (vm) {
    return vm.appContext.config.globalProperties.$message
  } else {
    return { error: () => { } }
  }
}

const handleDragleave = (e: DragEvent) => {
  emit('update:visible', false)
  console.log('Dragleave', e)
}

const handleDrop = async (event: DragEvent) => {
  console.log('Drop', event)
  const { dataTransfer } = event
  const file = dataTransfer && dataTransfer.files[0]
  if (file) {
    console.log('打开文件', file)
    if (!file.type.startsWith('image')) {
      console.error('Master! 我无法识别该文件类型！', file)
      useMessage().error('Master! 我无法识别该文件类型！')
    } else {
      store.imageFileList.push(createImageItem(file))
      if (store.layout.guide.show) {
        store.layout.guide.show = false
      }
    }
  } else {
    console.error('(((φ(◎ロ◎;)φ)))未知的拖拽行为！')
    useMessage().error('(((φ(◎ロ◎;)φ)))未知的拖拽行为！')
  }
  emit('update:visible', false)
}
</script>

<template>
  <div
    v-show="visible"
    class="ocr-drag-opener"
    @dragleave="handleDragleave"
    @dragover.prevent
    @drop="handleDrop"
  >
    <div class="tips m-auto">
      <icon-upload :size="80" />
      <div class="mt-8">松手以上传(仅限图片格式)</div>
    </div>
  </div>
</template>

<style lang="scss">
.ocr-drag-opener {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  z-index: 200;
  display: flex;
  color: #fff;
  text-align: center;
  border: 4px dashed var(--app-color-common);
  background-color: rgba(0, 0, 0, 0.5);

  .tips {
    pointer-events: none;
  }
}
</style>
