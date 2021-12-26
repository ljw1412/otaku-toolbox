<template>
  <div ref="target"
    class="reader-image-loader"
    :data-index="index"
    :data-loaded="isLoaded"
    :data-visible="isVisible"
    @click="handleLoaderClick">
    <img v-show="!error"
      :key="key"
      :src="url"
      class="comic-image"
      loading="lazy"
      @load="handleImageLoad"
      @error="handleImageError" />
    <div v-show="!isLoaded"
      class="helper layout-center">
      <div class="number">{{ index }}</div>
      <a-spin v-if="!error"
        dot></a-spin>
      <div v-else>
        <a-typography-text type="danger">
          {{ error }}
        </a-typography-text>
        <br>
        <a-typography-text type="secondary">
          (点击重新加载)
        </a-typography-text>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ReaderImageLoader',

  props: { index: Number, url: String },

  emits: ['visible'],

  setup(props, ctx) {
    const target = ref(null)
    const isVisible = ref(false)
    const { stop } = useIntersectionObserver(
      target,
      ([{ isIntersecting }], observerElement) => {
        isVisible.value = isIntersecting
        if (isIntersecting) {
          ctx.emit('visible', props.index)
        }
      }
    )
    return { target, isVisible }
  },

  data() {
    return {
      key: +new Date(),
      isLoaded: false,
      error: ''
    }
  },

  methods: {
    handleLoaderClick(e: Event) {
      if (this.error) {
        e.stopPropagation()
        this.error = ''
        this.isLoaded = false
        this.key = +new Date()
      }
    },

    handleImageLoad() {
      this.isLoaded = true
      this.error = ''
    },

    handleImageError(error: Error) {
      this.error = '加载失败'
      console.error(error)
    }
  }
})
</script>

<style lang="scss">
.reader-image-loader {
  position: relative;
  width: 100%;

  &[data-loaded='false'] {
    height: 400px;
  }

  .comic-image {
    width: 100%;
  }

  .helper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    flex-direction: column;
    text-align: center;

    .number {
      font-size: 36px;
    }
  }
}
</style>
