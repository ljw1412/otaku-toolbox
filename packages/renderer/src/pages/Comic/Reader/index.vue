<template>
  <div class="comic-reader"
    @click="handleReaderClick">
    <div v-for="(imageItem,i) of list"
      :key="imageItem.url"
      class="comic-image-item"
      :class="{loaded: imageItem.loaded}"
      @click="handleImageItemClick(imageItem,$event)">
      <img v-show="!imageItem.error"
        :key="imageItem.key"
        :src="imageItem.url"
        style="width:100%;"
        class="comic-image"
        loading="lazy"
        @load="handleImageLoad(imageItem)"
        @error="handleImageError(imageItem)" />
      <div v-if="!imageItem.loaded"
        class="helper layout-center">
        <div class="number">{{ i + 1 }}</div>
        <div v-if="!imageItem.error"
          class="loading">
          <a-spin dot />
        </div>
        <div v-else
          class="error">
          <a-typography-text type="danger">
            {{ imageItem.error }}
          </a-typography-text>
          <br>
          <a-typography-text type="secondary">
            (点击重新加载)
          </a-typography-text>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ComicMixin from '/@/mixins/comic'

interface ImageItem {
  url: string
  key: string
  loaded: boolean
  error: string
}

export default defineComponent({
  name: 'ComicReader',

  mixins: [ComicMixin],

  data() {
    return {
      scrollEl: null as HTMLElement | null,
      list: [] as ImageItem[]
    }
  },

  computed: {
    chapterRule() {
      return this.rule.chapter
    }
  },

  watch: {
    rule() {
      this.initData()
    }
  },

  mounted() {
    const scrollEl = document.querySelector('#app-main')
    // @ts-ignore
    this.scrollEl = scrollEl as HTMLElement
  },

  methods: {
    async initData() {
      const { imageOrigin, list } = (await this.runRule(this.chapterRule, 0, {
        replacer: { path: this.$route.query.path as string }
      })) as { imageOrigin?: string; list: string[] }
      this.list = list.map(path => {
        const url = imageOrigin ? `${imageOrigin}${path}` : path
        return {
          url,
          key: `${url}?${+new Date()}`,
          loaded: false,
          error: ''
        }
      })
    },

    handleReaderClick(event: MouseEvent) {
      if (!this.scrollEl) return
      let { x, y } = event
      y -= 40
      const contentHeight = this.scrollEl.clientHeight
      const top =
        (y < contentHeight / 2 ? -1 : 1) * this.scrollEl.offsetHeight * 0.8
      this.scrollEl.scrollBy({ top, behavior: 'smooth' })
    },

    handleImageItemClick(imageItem: ImageItem, event: Event) {
      if (imageItem.error) {
        event.stopPropagation()
        imageItem.error = ''
        imageItem.loaded = false
        imageItem.key = `${imageItem.url}?${+new Date()}`
      }
    },

    handleImageLoad(imageItem: ImageItem) {
      imageItem.loaded = true
      imageItem.error = ''
    },

    handleImageError(imageItem: ImageItem) {
      imageItem.error = '加载失败'
    }
  }
})
</script>

<style lang="scss">
.comic-reader {
  .comic-image-item {
    position: relative;
    &:not(.loaded) {
      height: 400px;
    }
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
