<template>
  <div
    class="app-ocr w-100 h-100 overflow-hidden"
    :class="{ dragging: store.dragging }"
    @dragenter="handleDragenter"
  >
    <DragOpener v-model:visible="store.dragging"></DragOpener>
    <FileOpner></FileOpner>
    <ImagesPanel></ImagesPanel>
    <div class="d-flex h-100">
      <ImageEditor></ImageEditor>
      <OcrSider></OcrSider>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FileOpner from './components/FileOpener.vue'
import ImagesPanel from './components/ImagesPanel.vue'
import ImageEditor from './components/ImageEditor.vue'
import OcrSider from './components/OcrSider.vue'
import DragOpener from './components/DragOpener.vue'
import { store } from './utils'

export default defineComponent({
  name: 'AppOCR',

  components: {
    FileOpner,
    ImagesPanel,
    ImageEditor,
    OcrSider,
    DragOpener
  },

  computed: {
    store() {
      return store
    }
  },

  methods: {
    handleDragenter(e: DragEvent) {
      store.dragging = true
      console.log('Dragenter', e)
    }
  }
})
</script>

<style lang="scss">
</style>

