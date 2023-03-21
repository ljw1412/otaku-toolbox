<template>
  <div
    ref="galleryEl"
    class="acg-gallery"
    :class="{ 'hide-indicator': mini && images.length <= 1 }"
  >
    <acg-ratio-div
      class="gallery-image"
      :disabled="ratioDisabled"
      :ratio="ratio"
    >
      <a-image
        width="100%"
        height="100%"
        show-loader
        loading="lazy"
        :src="current"
        :preview="false"
        referrerpolicy="no-referrer"
        @click="handleImageClick"
      />
    </acg-ratio-div>

    <div
      v-if="mini"
      v-show="images.length > 1"
      class="indicator"
      @click="handleIndicatorClick"
    >
      <div
        class="indicator-item"
        :style="{
          width: 100 / images.length + '%',
          left: (index * 100) / images.length + '%'
        }"
      ></div>
    </div>

    <div
      v-else
      v-show="images.length > 1"
      ref="thumbnailsWrapEl"
      class="gallery-thumbnails"
    >
      <div ref="thumbnailsEl" class="thumbnails" :style="[thumbnailsStyle]">
        <div
          v-for="(image, i) of compressCovers"
          :key="image.origin + i"
          :class="{ active: image.origin === current }"
          class="thumbnail"
          @click="handleThumbnailClick(image.origin, $event)"
        >
          <img
            :src="image.compress"
            loading="lazy"
            referrerpolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, reactive, watch } from 'vue'
import AcgRatioDiv from './AcgRatioDiv.vue'
import {
  useElementHover,
  useEventListener,
  usePointerSwipe
} from '@vueuse/core'

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
    mini: Boolean,
    images: { type: Array as PropType<string[]>, default: () => [] },
    defaultImage: String
  },

  emits: ['image-change'],

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

    watch(isThumbnailsWrapElHover, isHover => {
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
      current: '',
      isSwiping: false
    }
  },

  computed: {
    index() {
      return this.images.findIndex(item => item === this.current)
    },

    ratioDisabled() {
      return !this.ratio
    },
    compressCovers() {
      return this.images.map(image => ({
        compress: this.compressImage(image, 'mini'),
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
    usePointerSwipe(this.galleryEl, {
      threshold: 30,
      onSwipe: (e: PointerEvent) => {
        this.isSwiping = true
      },
      onSwipeEnd: (e, direction) => {
        console.log(e, direction)
        if (this.images.length > 1) {
          const dIndex = direction === 'LEFT' || direction === 'UP' ? 1 : -1
          const i =
            (this.index + dIndex + this.images.length) % this.images.length
          const image = this.images[i]
          this.current = image
          this.$emit('image-change', image)
        }
        setTimeout(() => {
          this.isSwiping = false
        }, 0)
      }
    })
  },

  methods: {
    initData() {
      if (this.defaultImage || this.images.length) {
        this.current = this.defaultImage || this.images[0]
      }
    },

    handleImageClick() {
      if (!this.isSwiping) {
        this.$global.dialog.imagePreview(this.current, this.images)
      }
    },

    handleIndicatorClick(event: MouseEvent) {
      event.preventDefault()
      const x = event.offsetX
      const width = (event.currentTarget as HTMLElement).clientWidth
      if (event.target === event.currentTarget) {
        const index = Math.floor((x / width) * this.images.length)
        this.current = this.images[index]
        this.$emit('image-change', this.images[index])
      }
    },

    handleThumbnailClick(image: string, e: MouseEvent) {
      this.current = image
      this.$emit('image-change', image)

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

  .indicator {
    position: relative;
    width: 50%;
    height: 6px;
    margin-top: 6px;
    margin-left: auto;
    margin-right: auto;
    background-color: rgba(var(--gray-4), 0.5);
    border-radius: 4px;
    cursor: pointer;

    .indicator-item {
      position: absolute;
      height: 100%;
      background-color: rgba(var(--gray-4), 1);
      border-radius: 6px;
      transition: left 0.3s;
    }
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
        content: '';
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
      content: '';
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
