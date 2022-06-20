<template>
  <div class="comic-details app-drag" :class="{ 'is-skeleton': loading }" data-skeleton-animate>
    <app-close-btn fixed="tr"></app-close-btn>

    <div class="comic-details-content">
      <div class="left">
        <acg-ratio-div :ratio="[3, 4]" class="cover-container skeleton-bg">
          <a-image
            v-if="!loading"
            :src="info.cover"
            :preview="false"
            show-loader
            loading="lazy"
            width="100%"
            height="100%"
          />
        </acg-ratio-div>
      </div>
      <div class="right d-flex flex-column">
        <div class="pt-12 mb-8">
          <a-typography-title
            :heading="3"
            class="skeleton-bg my-0"
            style="margin-right: 60px; min-height: 35px;"
          >
            <span v-show="!loading">{{ info.title }}</span>
          </a-typography-title>

          <div class="mt-4">
            <a-skeleton animation class="w-50" :loading="loading">
              <a-skeleton-line :rows="1" :line-height="24" :line-spacing="4" />
            </a-skeleton>
            <a-space v-show="!loading" size="mini">
              <a-typography-text v-if="author" type="secondary" class="mr-8">{{ author }}</a-typography-text>
              <a-tag
                v-if="info.status"
                :color="info.status.includes('完') ? 'red' : 'green'"
              >{{ info.status }}</a-tag>
              <a-tag v-for="tag of tags" :key="tag" color="arcoblue" size="mini">{{ tag }}</a-tag>
            </a-space>
          </div>
        </div>
        <div class="chapter-grid pb-12 app-no-drag">
          <a-skeleton animation :loading="loading" style="padding-right: 42px;">
            <a-skeleton-line :rows="1" :line-height="24" :line-spacing="8" />
            <a-skeleton-line :rows="3" :line-height="32" :line-spacing="4" />
          </a-skeleton>
          <div v-show="!loading" class="desc pr-32 pb-8">{{ info.desc }}</div>
          <a-space v-show="!loading" wrap size="mini">
            <a-button
              v-for="chapter of chapterList"
              :key="chapter.path"
              :title="chapter.name"
              :type="history.path === chapter.path ? 'primary' : undefined"
              class="btn-chapter"
              @click="handleChapterClick(chapter)"
            >{{ chapter.name }}</a-button>
          </a-space>
        </div>
      </div>
    </div>

    <div class="comic-details-toolbar layout-lr">
      <a-space class="left app-no-drag">
        <a-link v-if="info.url" key="origin" :href="info.url" class="btn-action" target="_blank">
          <icon-desktop class="icon" />
          <div class="name">原网址</div>
        </a-link>
        <a-link
          key="favorite"
          class="btn-action"
          target="_blank"
          :disabled="loading"
          @click="action('favorite')"
        >
          <component :is="isFavorited ? 'icon-star-fill' : 'icon-star'" class="icon"></component>
          <div class="name">收藏</div>
        </a-link>
        <a-link
          key="download"
          class="btn-action"
          target="_blank"
          :disabled="loading"
          @click="action('download')"
        >
          <icon-download class="icon" />
          <div class="name">下载</div>
        </a-link>
      </a-space>
      <div class="right app-no-drag">
        <a-button
          :disabled="loading || !chapterList.length"
          type="primary"
          @click="handleReadClick"
        >{{ history.path ? '继续阅读' : '开始阅读' }}</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRaw } from 'vue'
import { ipcOff, ipcOn, ipcSend } from '/@/utils/electron'
import ComicMixin from '/@/mixins/comic'
import { nin } from '/@/utils/object'

export default defineComponent({
  name: 'ComicDetails',

  mixins: [ComicMixin],

  data() {
    return {
      loading: true,
      isFavorited: false,
      info: {} as Record<string, any>,
      history: {} as ComicHistory
    }
  },

  computed: {
    detailsRule() {
      return this.rule.details
    },

    chapterList(): { name: string; path: string }[] {
      return this.info.list || []
    },

    dbKey() {
      return this.namespace + '||' + this.$route.query.path
    },

    author() {
      return Array.isArray(this.info.author)
        ? this.info.author.join('、')
        : this.info.author || ''
    },

    tags() {
      return Array.isArray(this.info.tags)
        ? this.info.tags
        : [this.info.tags].filter(tag => tag)
    }
  },

  watch: {
    rule() {
      if (this.detailsRule) {
        this.fetchData()
      }
    }
  },

  created() {
    this.checkState()
  },

  mounted() {
    ipcOn('window.message', this.handleWindowMessage)
  },

  unmounted() {
    ipcOff('window.message', this.handleWindowMessage)
  },

  methods: {
    close() {
      this.$API.Electron.win.control('close', 'child')
    },

    handleWindowMessage(
      e: Event,
      type: string,
      data: Record<string, any> = {}
    ) {
      if (type.startsWith('comic-') && this.dbKey === data.key) {
        if (type === 'comic-history') {
          this.history = data as ComicHistory
        } else if (type === 'comic-details-get') {
          ipcSend('window.message', 'comic-details', {
            key: this.dbKey,
            ...toRaw(this.info)
          })
          console.log(e, data)
        }
      }
    },

    async checkState() {
      window.$db.favorites.read(this.dbKey).then(data => {
        this.isFavorited = !!data
      })

      const history = await window.$db.history.read(this.dbKey)
      if (history) {
        this.history = history
      }
    },

    async fetchData() {
      this.loading = true
      const data = await this.runRule(this.detailsRule, 0, {
        replacer: { path: this.$route.query.path as string }
      })
      this.loading = false
      // 提取替换字段相关的参数
      const replacerParams = Object.keys(data).filter(key => key.startsWith('replacer.'))
      if (replacerParams.length) {
        data.replacer = replacerParams.map(key => key.replace('replacer.', '') + '=' + data[key]).join('|')
      }
      this.info = data
      this.$global.setTitle(data.title)
    },

    handleChapterClick(chapter: { name: string; path: string }) {
      const extraQuery: Record<string, any> = {}
      if (this.info.replacer) {
        extraQuery.replacer = this.info.replacer
      }

      this.$API.Electron.win.openVue(
        {
          name: 'ComicReader',
          params: { namespace: this.$route.params.namespace },
          query: {
            path: chapter.path,
            name: chapter.name,
            ppath: this.$route.query.path,
            ...extraQuery
          }
        },
        { width: 600, height: 900, minWidth: 600, minHeight: 900 }
      )
    },

    async action(action: 'favorite' | 'download') {
      if (action === 'favorite') {
        try {
          if (this.isFavorited) {
            await window.$db.favorites.remove(this.dbKey)
          } else {
            await window.$db.favorites.add({
              key: this.dbKey,
              title: this.info.title,
              cover: this.info.cover,
              pageOption: nin(this.$route.query, 'app app-config')
            })
          }
          this.isFavorited = !this.isFavorited
        } catch (error) {
          console.error(error)
          this.$message.error(this.isFavorited ? '取消收藏失败' : '收藏失败')
        }
        return
      }
    },

    handleReadClick() {
      if (this.history) {
        const chapter = this.chapterList.find(
          chapter => this.history.path === chapter.path
        )
        if (chapter) return this.handleChapterClick(chapter)
      }
      this.handleChapterClick(this.chapterList[0])
    }
  }
})
</script>

<style lang="scss">
.comic-details {
  user-select: none;
  height: 100%;
  overflow: hidden;

  .comic-details-content {
    display: flex;
    height: 460px;
    .left {
      width: 36%;
    }

    .right {
      width: 64%;
      padding-left: 40px;
    }

    .left,
    .right {
      box-sizing: border-box;
      flex-shrink: 0;
    }
  }

  .chapter-grid {
    // max-height: 70%;
    overflow-y: auto;

    .btn-chapter {
      overflow: hidden;
      width: 130px;
      text-overflow: ellipsis;
    }
  }

  .comic-details-toolbar {
    position: relative;
    height: calc(100% - 460px);
    background: var(--color-bg-1);
    box-shadow: 0 0 8px var(--color-fill-2);
    z-index: 1;
    padding: 0 8px;

    .btn-action {
      text-align: center;
      width: 44px;
      height: 44px;
      box-sizing: border-box;
      .icon {
        font-size: 20px;
      }
      .name {
        font-size: 12px;
        line-height: 14px;
      }
    }
  }
}
</style>
