<template>
  <div class="comic-details app-drag"
    :class="{ 'is-skeleton': loading }"
    data-skeleton-animate>
    <app-close-btn fixed="tr"></app-close-btn>

    <div class="comic-details-content">
      <div class="left">
        <acg-ratio-div :ratio="[3,4]"
          class="skeleton-bg">
          <a-image v-if="!loading"
            :src="info.cover"
            :preview="false"
            show-loader
            loading="lazy"
            width="100%"
            height="100%" />
        </acg-ratio-div>
      </div>
      <div class="right">
        <div class="pt-12"
          style="height:20%">
          <a-typography-title :heading="3"
            class="skeleton-bg mt-0"
            style="margin-right: 60px; min-height: 35px;">
            <span v-show="!loading">{{ info.title }}</span>
          </a-typography-title>
        </div>
        <div class="chapter-grid">
          <a-skeleton animation
            :loading="loading"
            style="padding-right: 42px;">
            <a-skeleton-line :rows="3"
              :line-height="32"
              :line-spacing="4" />
          </a-skeleton>
          <a-space v-show="!loading"
            wrap
            size="mini"
            class="app-no-drag">
            <a-button v-for="chapter of chapterList"
              :key="chapter.path"
              :title="chapter.name"
              class="btn-chapter"
              @click="handleChapterClick(chapter)">{{ chapter.name }}</a-button>
          </a-space>
        </div>

      </div>
    </div>

    <div class="comic-details-toolbar layout-lr">
      <a-space class="left app-no-drag">
        <a-link v-if="info.url"
          key="origin"
          :href="info.url"
          class="btn-action"
          target="_blank">
          <icon-desktop class="icon" />
          <div class="name">原网址</div>
        </a-link>
        <a-link key="favorite"
          class="btn-action"
          target="_blank"
          :disabled="loading"
          @click="action('favorite')">
          <component :is="isFavorited ? 'icon-star-fill' : 'icon-star'"
            class="icon"></component>
          <div class="name">收藏</div>
        </a-link>
        <a-link key="download"
          class="btn-action"
          target="_blank"
          :disabled="loading"
          @click="action('download')">
          <icon-download class="icon" />
          <div class="name">下载</div>
        </a-link>
      </a-space>
      <div class="right app-no-drag">
        <a-button :disabled="loading">开始阅读</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ipcSend, openVueView } from '/@/utils/electron'
import ComicMixin from '/@/mixins/comic'
import { nin } from '/@/utils/object'

export default defineComponent({
  name: 'ComicDetails',

  mixins: [ComicMixin],

  data() {
    return {
      loading: true,
      isFavorited: false,
      info: {} as Record<string, any>
    }
  },

  computed: {
    detailsRule() {
      return this.rule.details
    },

    chapterList(): { name: string; path: string }[] {
      return this.info.list || []
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

  methods: {
    close() {
      ipcSend('window.action', 'close', { mode: 'child' })
    },

    checkState() {
      window.$db.favorites
        .readIndex('key', this.$route.query.path as string)
        .then(data => {
          this.isFavorited = !!data
        })
    },

    async fetchData() {
      this.loading = true
      const data = await this.runRule(this.detailsRule, 0, {
        replacer: { path: this.$route.query.path as string }
      })
      this.loading = false
      this.info = data
      this.$global.setTitle(data.title)
    },

    handleChapterClick(chapter: { name: string; path: string }) {
      openVueView(
        {
          name: 'ComicReader',
          params: { namespace: this.$route.params.namespace },
          query: { path: chapter.path }
        },
        { width: 600, height: 900, minWidth: 600, minHeight: 900 }
      )
    },

    async action(action: 'favorite' | 'download') {
      if (action === 'favorite') {
        try {
          if (this.isFavorited) {
            await window.$db.favorites.remove(
              'key',
              this.$route.query.path as string
            )
          } else {
            await window.$db.favorites.add({
              key: this.$route.query.path,
              title: this.info.title,
              cover: this.info.cover,
              origin: this.namespace,
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
    max-height: 80%;
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
