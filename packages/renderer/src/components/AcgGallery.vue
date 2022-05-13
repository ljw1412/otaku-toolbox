<template>
  <div ref="galleryEl" class="acg-gallery">
    <acg-ratio-div class="gallery-image" :disabled="ratioDisabled" :ratio="ratio">
      <a-image
        width="100%"
        height="100%"
        show-loader
        loading="lazy"
        :src="current"
        :preview="false"
        @click="handleImageClick"
      />
    </acg-ratio-div>

    <div v-show="images.length > 1" ref="thumbnailsWrapEl" class="gallery-thumbnails">
      <div ref="thumbnailsEl" class="thumbnails" :style="[thumbnailsStyle]">
        <div
          v-for="(image, i) of compressCovers"
          :key="image.origin + i"
          :class="{ active: image.origin === current }"
          class="thumbnail"
          @click="handleThumbnailClick(image.origin, $event)"
        >
          <img :src="image.compress" loading="lazy" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, reactive, watch } from 'vue'
import AcgRatioDiv from './AcgRatioDiv.vue'
import { compressImage } from '/@/utils/image'
import { useElementHover, useEventListener } from '@vueuse/core'

export default defineComponent({
  name: 'AcgGallery',

  components: {
    AcgRatioDiv
  },

  props: {
    // [宽，长]
    ratio: {
      type: [Array] as PropType<number[]>,
      default: () => [3, 4]
    },
    images: { type: Array as PropType<string[]>, default: () => [] },
    defaultImage: String
  },

  emits: ['change'],

  setup(props, ctx) {
    const galleryEl = ref()
    const thumbnailsWrapEl = ref()
    const thumbnailsEl = ref()
    const isThumbnailsWrapElHover = useElementHover(thumbnailsWrapEl)
    const thumbnailsView = reactive({
      x: 0,
      width: 0,
      scrollWidth: 0
    })

    watch(isThumbnailsWrapElHover, (isHover) => {
      if (isHover) {
        thumbnailsView.width = galleryEl.value.clientWidth
        thumbnailsView.scrollWidth = thumbnailsEl.value.scrollWidth
      }
    })

    return {
      galleryEl,
      thumbnailsWrapEl,
      thumbnailsEl,
      thumbnailsView
    }
  },

  data() {
    return {
      current: ''
    }
  },

  computed: {
    ratioDisabled() {
      return !this.ratio
    },
    compressCovers() {
      return this.images.map((image) => ({
        compress: compressImage(image),
        origin: image
      }))
    },
    maxX() {
      return this.thumbnailsView.scrollWidth - this.thumbnailsView.width
    },
    isScrollable() {
      return this.maxX > 0
    },
    thumbnailsStyle() {
      return { 'margin-left': `-${this.thumbnailsView.x}px` }
    }
  },

  mounted() {
    this.initData()
    useEventListener(this.thumbnailsWrapEl, 'wheel', this.wheelLinstener)
  },

  methods: {
    initData() {
      if (this.defaultImage || this.images.length) {
        this.current = this.defaultImage || this.images[0]
      }
    },

    handleImageClick() {
      this.$imagePreview(this.current, this.images)
    },

    handleThumbnailClick(image: string, e: MouseEvent) {
      this.current = image
      this.$emit('change', image)

      const target = e.target as HTMLElement
      const centerX = (this.thumbnailsView.width - target.offsetWidth) / 2
      this.scrollThumbnails((target.offsetLeft - centerX) * 10)
    },

    // 滚动缩略图组
    scrollThumbnails(deltaX: number) {
      const nextX = this.thumbnailsView.x + deltaX / 10
      this.thumbnailsView.x = Math.min(this.maxX, Math.max(0, nextX))
    },

    // 缩略图组滚轮监听
    wheelLinstener(e: WheelEvent) {
      this.scrollThumbnails(e.deltaX || e.deltaY)
      if (this.isScrollable) {
        e.preventDefault()
      }
    }
  },

  watch: {
    images() {
      this.initData()
    }
  }
})
</script>

<style lang="scss">
.acg-gallery {
  --thumbnail-size: 80px;

  width: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .gallery-thumbnails {
    position: relative;
    height: var(--thumbnail-size);
    white-space: nowrap;
    overflow: hidden;

    .thumbnails {
      height: 100%;
      transition: margin-left 0.1s ease-in;
      text-align: center;
    }

    .thumbnail {
      position: relative;
      display: inline-block;
      height: 100%;
      width: var(--thumbnail-size);
      cursor: pointer;
      opacity: 0.5;

      & + .thumbnail {
        margin-left: -3px;
      }

      &:hover {
        opacity: 0.8;
      }

      &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        border: 3px solid #ffffff;
        box-sizing: border-box;
      }

      &.active {
        opacity: 1;
        &::before {
          border-color: var(--app-color-common);
          z-index: 1;
        }
      }
    }
  }
  .thumbnails-scroll-bar {
    position: relative;
    height: 7px;

    .bar {
      width: 0;
      height: 100%;
      background-color: #fff;
      cursor: grab;
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 1px;
      width: 100%;
      margin: 3px 0;
      background-color: #fff;
      opacity: 0.8;
    }
  }
}
</style>
