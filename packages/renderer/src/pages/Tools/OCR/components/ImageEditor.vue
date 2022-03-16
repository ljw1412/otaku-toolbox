<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { currentImage, allRectList, state } from '../utils'
import {
  useMagicKeys, useMouse, useMousePressed, useElementBounding
} from '@vueuse/core'
import API from '/@/apis/index'
import { ipcOff, ipcOn } from '/@/utils/electron'
import { ocrStore } from '/@/stores'

const vm = getCurrentInstance()
const editorContainerEl = ref(null)
const editorEl = ref<HTMLElement | null>(null)
const imgEl = ref(null)
const isDrag = ref(false)

const useMessage = () => {
  if (vm) {
    return vm.appContext.config.globalProperties.$message
  } else {
    return { error: () => { } }
  }
}

const editorRect = useElementBounding(editorContainerEl)
const { space } = useMagicKeys()
const { pressed } = useMousePressed({ target: editorContainerEl })
const { x: mouseX, y: mouseY } = useMouse()


const tempRect = reactive({
  show: false,
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  preview: ''
} as ToolsOCR.TwoPointRect)

const previewRect = computed(() => {
  const { show, startX, startY, endX, endY, preview } = tempRect
  return {
    id: +new Date(),
    show,
    preview,
    selected: false,
    x: Math.min(startX, endX),
    y: Math.min(startY, endY),
    width: Math.abs(startX - endX),
    height: Math.abs(startY - endY),
    lang: ocrStore.defaultLang,
    vertical: false,
    text: '',
    translation: ''
  }
})
// 临时存储鼠标和图片上一次的位置
const tempInfo = reactive({ x: 0, y: 0, imgX: 0, imgY: 0 })
// 按下鼠标时
watch(pressed, (pressed) => {
  if (currentImage.value) {
    if (pressed) {
      isDrag.value = space.value
      Object.assign(tempInfo, {
        x: mouseX.value,
        y: mouseY.value,
        imgX: currentImage.value.x,
        imgY: currentImage.value.y
      })
      console.log(isDrag.value, tempInfo)
      if (!isDrag.value) {
        tempRect.show = true
        console.log(editorRect)

        tempRect.startX = tempRect.endX = tempInfo.x - tempInfo.imgX - editorRect.x.value
        tempRect.startY = tempRect.endY = tempInfo.y - tempInfo.imgY - editorRect.y.value
      }
    } else {
      if (!isDrag.value) {
        if (previewRect.value.width > 20 && previewRect.value.height > 20) {
          currentImage.value.rectList.push(previewRect.value)
          if (currentImage.value.rectList.length === 1) {
            currentImage.value.rectList[0].selected = true
          }
          API.Electron.ocr.recognize({
            lang: 'chi_sim',
            id: previewRect.value.id,
            image: previewRect.value.preview,
            options: {}
          })
        } else {
          useMessage().error('选取太小')
        }

        tempRect.show = false
        tempRect.startX = tempRect.endX = tempRect.startY = tempRect.endY = 0
        tempRect.preview = ''
      }

    }
  }
})
watch([mouseX, mouseY], ([x, y]) => {
  if (currentImage.value && pressed.value) {
    if (isDrag.value) {
      // 移动图片
      currentImage.value.x = tempInfo.imgX + x - tempInfo.x
      currentImage.value.y = tempInfo.imgY + y - tempInfo.y
    } else {
      // 画框
      tempRect.endX = x - tempInfo.imgX - editorRect.x.value
      tempRect.endY = y - tempInfo.imgY - editorRect.y.value
    }
  }
})

watch(() => state.targetId, (id: number) => {
  if (id && currentImage.value && editorEl.value) {
    const rect = currentImage.value.rectList[id - 1]
    if (!rect) return
    const editorWidth = editorEl.value.offsetWidth
    const editorHeight = editorEl.value.offsetHeight
    currentImage.value.x = (editorWidth - rect.width) / 2 - rect.x
    currentImage.value.y = (editorHeight - rect.height) / 2 - rect.y
  }
})

const handleRectRightMousedown = (e: MouseEvent, item: ToolsOCR.CroppedRect) => {
  console.log(e, item)
}

// 实时生成切图图片
const canvasDom = document.createElement('canvas')
const canvasCtx = canvasDom.getContext("2d")
watch(previewRect, (rect) => {
  canvasDom.width = rect.width
  canvasDom.height = rect.height
  canvasCtx!.drawImage(imgEl.value!, -rect.x, -rect.y)
  tempRect.preview = canvasDom.toDataURL()
})

// 后台消息监听事件
function ocrListener(
  event: Electron.IpcRendererEvent,
  type: string,
  data: Record<string, any>
) {
  if (type === 'result') {
    const rect = allRectList.value.find(item => item.id === data.id)
    if (rect) {
      rect.text = data.data.text
    }
  }
}
ipcOn('ocr-recognize', ocrListener)

onBeforeUnmount(() => {
  ipcOff('ocr-recognize', ocrListener)
})
</script>

<template>
  <div
    ref="editorEl"
    class="ocr-image-editor"
    :class="{
      'is-space': space,
      'is-pressed': pressed
    }"
  >
    <template v-if="currentImage">
      <div
        ref="editorContainerEl"
        class="editor-container"
        :style="{ left: currentImage.x + 'px', top: currentImage.y + 'px' }"
      >
        <img ref="imgEl" :src="currentImage.url" />
        <svg width="100%" height="100%" @mousedown.right.stop>
          <template v-for="(item, i) of currentImage.rectList" :key="`crop-${i + 1}`">
            <rect
              :x="item.x"
              :y="item.y"
              :width="item.width"
              :height="item.height"
              :data-name="`crop-rect-${i + 1}`"
              class="crop-rect"
              :class="{ vertical: item.vertical }"
              @mousedown.right.stop="handleRectRightMousedown($event, item)"
              @mousedown.left.stop
            />
            <text
              :x="item.x + 2"
              :y="item.y + 12"
              :data-name="`crop-text-${i + 1}`"
              class="crop-text"
            >{{ i + 1 }}</text>
          </template>

          <rect
            v-if="previewRect.show"
            :x="previewRect.x"
            :y="previewRect.y"
            :width="previewRect.width"
            :height="previewRect.height"
            class="crop-rect temp"
          />
        </svg>
      </div>

      <div class="image-scale"></div>
    </template>
  </div>
</template>

<style lang="scss">
.ocr-image-editor {
  position: relative;
  flex-grow: 1;
  width: 0;
  overflow: hidden;

  .editor-container {
    position: absolute;
    display: inline-block;
    box-shadow: 1px 2px 12px var(--app-color-common);
    font-size: 0;

    svg {
      position: absolute;
      left: 0;
      top: 0;
      font-size: 14px;
    }
  }

  .crop-rect {
    fill: blue;
    stroke: pink;
    stroke-width: 2;
    fill-opacity: 0.05;
    stroke-opacity: 0.6;

    &.vertical {
      fill: pink;
      stroke: blue;
    }

    &:hover {
      fill-opacity: 0.2;
      stroke-opacity: 1;
    }
  }

  .crop-text {
    fill: red;
  }

  &.is-space {
    cursor: grab;
    &.is-pressed {
      cursor: grabbing;
    }
  }
}
</style>
