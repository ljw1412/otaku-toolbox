<template>
  <div class="comic-reader"
    @click="handleReaderClick">
    <a-result v-show="error"
      status="error"
      title="规则错误"
      :subtitle="error"></a-result>
    <image-loader v-for="(url,i) of list"
      :key="i + url"
      :index="i+1"
      :url="url"
      @visible="handleImageVisible"></image-loader>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ComicMixin from '/@/mixins/comic'
import ImageLoader from './components/ImageLoader.vue'

export default defineComponent({
  name: 'ComicReader',

  components: { ImageLoader },

  mixins: [ComicMixin],

  data() {
    return {
      error: '',
      scrollEl: null as HTMLElement | null,
      list: [] as string[],
      currentIndex: 0
    }
  },

  computed: {
    chapterRule() {
      return this.rule.chapter
    },

    dbKey() {
      return [this.namespace, this.$route.query.ppath].join('||')
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

    window.onunload = () => {
      window.$db.history.addOrUpdate({
        key: this.dbKey,
        index: this.currentIndex,
        path: this.$route.query.path
      })
    }
  },

  methods: {
    async initData() {
      if (!this.chapterRule) {
        this.error = '此源中章节阅读页规则未配置'
      }

      const history = await window.$db.history.read(this.dbKey)

      const { imageOrigin, list } = (await this.runRule(this.chapterRule, 0, {
        replacer: { path: this.$route.query.path as string }
      })) as { imageOrigin?: string; list: string[] }
      this.list = list.map(path =>
        imageOrigin ? `${imageOrigin}${path}` : path
      )
      if (history && history.path === this.$route.query.path) {
        this.$nextTick(() => {
          const el = document.querySelector(
            `.reader-image-loader[data-index='${history.index}']`
          )
          if (el) el.scrollIntoView()
        })
      }
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

    handleImageVisible(index: number) {
      this.currentIndex = index
      this.$global.setTitle(`漫画阅读器(${index}/${this.list.length})`)
      // window.$db.history.addOrUpdate({
      //   key: this.dbKey,
      //   index: this.currentIndex
      // })
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
