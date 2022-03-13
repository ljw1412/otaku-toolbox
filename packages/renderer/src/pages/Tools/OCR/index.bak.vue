<script setup lang="ts">
import { Ref, ref, watch, reactive, computed } from 'vue'
import {
  useFileSystemAccess,
  useMagicKeys,
  useMouse,
  useMousePressed, useElementBounding
} from '@vueuse/core'

// 图片文件操作
const dataType = ref('Blob') as Ref<'Text' | 'ArrayBuffer' | 'Blob'>
const fs = useFileSystemAccess({
  dataType,
  types: [{ description: '图片', accept: { 'image/*': [] } }],
  excludeAcceptAllOption: true
})
const imageBlob = ref('')
watch(
  () => fs.file.value!,
  (file: File) => {
    imageBlob.value = URL.createObjectURL(file)
  }
)
const handleImageOpen = () => fs.open()
const isImageLoaded = computed(() => !!imageBlob.value)

// 图片显示区域移动
const editorContainerEl = ref(null)
const editorEl = ref(null)
const imgEl = ref(null)
const isDrag = ref(false)
const editorBounding = useElementBounding(editorEl)
const { space } = useMagicKeys()
const { pressed } = useMousePressed({ target: editorContainerEl })
const { x: mouseX, y: mouseY } = useMouse()
const imageOptions = reactive({ x: 0, y: 0, scale: 1 })
const startMouse = { x: 0, y: 0, imgX: 0, imgY: 0 }
const rectList = reactive([] as Record<string, any>[])
const tempRect = reactive({ show: false, startX: 0, startY: 0, endX: 0, endY: 0, preview: '' })

const rect = computed(() => {
  const { startX, startY, endX, endY, preview } = tempRect
  return {
    preview,
    x: Math.min(startX, endX),
    y: Math.min(startY, endY),
    width: Math.abs(startX - endX),
    height: Math.abs(startY - endY)
  }
})

const canvasDom = document.createElement('canvas')
const canvasCtx = canvasDom.getContext("2d")

watch(rect, (rect) => {
  console.log(rect)
  canvasDom.width = rect.width
  canvasDom.height = rect.height
  canvasCtx!.drawImage(imgEl.value!, -rect.x, -rect.y)
  tempRect.preview = canvasDom.toDataURL()
})

watch(pressed, (pressed) => {
  if (isImageLoaded.value) {
    if (pressed) {
      isDrag.value = space.value
      startMouse.x = mouseX.value
      startMouse.y = mouseY.value
      startMouse.imgX = imageOptions.x
      startMouse.imgY = imageOptions.y
      console.log(isDrag.value, startMouse)
      if (!isDrag.value) {
        tempRect.show = true
        tempRect.startX = tempRect.endX = startMouse.x - editorBounding.x.value - startMouse.imgX
        tempRect.startY = tempRect.endY = startMouse.y - editorBounding.y.value - startMouse.imgY
      }
    } else {
      if (!isDrag.value) {
        if (rect.value.width > 20 && rect.value.height > 20) {
          rectList.push(rect.value)
        } else {
          console.error('选取太小')
        }

        tempRect.show = false
        tempRect.startX = tempRect.endX = tempRect.startY = tempRect.endY = 0
        tempRect.preview = ''
      }
    }
  }
})

watch([mouseX, mouseY], ([x, y]) => {
  if (isImageLoaded.value && pressed.value) {
    if (isDrag.value) {
      // 移动图片
      imageOptions.x = startMouse.imgX + x - startMouse.x
      imageOptions.y = startMouse.imgY + y - startMouse.y
    } else {
      // 画框
      tempRect.endX = x - editorBounding.x.value - startMouse.imgX
      tempRect.endY = y - editorBounding.y.value - startMouse.imgY
    }
  }
})
</script>

<template>
  <a-layout class="app-ocr">
    <a-layout-sider :width="150">Sider</a-layout-sider>
    <a-layout-content class="overflow-hidden">
      <div
        ref="editorContainerEl"
        class="core"
        :class="{
          'is-space': isImageLoaded && space,
          'is-pressed': isImageLoaded && pressed
        }"
      >
        <a-button v-if="!imageBlob" @click="handleImageOpen">打开</a-button>
        <div
          v-else
          ref="editorEl"
          class="editor"
          :style="{ left: imageOptions.x + 'px', top: imageOptions.y + 'px' }"
        >
          <img ref="imgEl" :src="imageBlob" />
          <svg width="100%" height="100%">
            <rect
              v-for="(item, i) of rectList"
              :key="i"
              v-bind="item"
              style="fill:blue;stroke:pink;stroke-width:2;fill-opacity:0.1;stroke-opacity:0.9"
            />
            <rect
              v-if="tempRect.show"
              :x="rect.x"
              :y="rect.y"
              :width="rect.width"
              :height="rect.height"
              style="fill:blue;stroke:pink;stroke-width:2;fill-opacity:0.1;stroke-opacity:0.9"
            />
          </svg>
        </div>
      </div>
    </a-layout-content>
    <a-layout-sider :width="300">
      <div v-for="(item, i) of rectList" :key="i" class="rect-item">
        <img :src="item.preview" style="width:100%" />
      </div>
      <div v-if="tempRect.show" class="rect-item">
        <img :src="tempRect.preview" style="width:100%" />
      </div>
    </a-layout-sider>
  </a-layout>
</template>

<style lang="scss">
.app-ocr {
  position: relative;
  height: 100%;

  .core {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;

    .editor {
      position: absolute;
      left: 0;
      top: 0;

      > svg {
        position: absolute;
        left: 0;
        top: 0;
      }
    }

    &.is-space {
      cursor: grab;
      &.is-pressed {
        cursor: grabbing;
      }
    }
  }
}
</style>
