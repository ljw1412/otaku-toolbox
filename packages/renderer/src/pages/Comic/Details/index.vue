<template>
  <div class="comic-details app-drag">
    <app-close-btn fixed="tr"></app-close-btn>

    <div class="comic-details-content">
      <div class="left">
        <acg-ratio-div :ratio="[3,4]">
          <a-image :src="info.cover"
            :preview="false"
            show-loader
            loading="lazy"
            width="100%"
            height="100%" />
        </acg-ratio-div>
      </div>
      <div class="right">
        <div style="height:20%">
          <a-typography-title :heading="3"
            style="margin-top: 0;padding-top:12px;">
            {{ info.title }}
          </a-typography-title>
        </div>
        <a-space wrap
          size="mini"
          class="chapter-grid app-no-drag">
          <a-button v-for="chapter of chapterList"
            :key="chapter.path"
            :title="chapter.name"
            class="btn-chapter"
            @click="handleChapterClick(chapter)">{{ chapter.name }}</a-button>
        </a-space>
      </div>
    </div>

    <div class="comic-details-toolbar layout-lr">
      <a-space class="left app-no-drag">
        <a-link v-if="info.url"
          :href="info.url"
          class="btn-action"
          target="_blank">
          <icon-desktop class="icon" />
          <div class="name">原网址</div>
        </a-link>
        <a-link class="btn-action"
          target="_blank">
          <icon-star class="icon" />
          <div class="name">收藏</div>
        </a-link>
        <a-link class="btn-action"
          target="_blank">
          <icon-download class="icon" />
          <div class="name">下载</div>
        </a-link>
      </a-space>
      <div class="right app-no-drag">
        <a-button>开始阅读</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ipcSend, openVueView } from '/@/utils/electron'
import ComicMixin from '/@/mixins/comic'

export default defineComponent({
  name: 'ComicDetails',

  mixins: [ComicMixin],

  data() {
    return {
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

  methods: {
    close() {
      ipcSend('window.action', 'close', { mode: 'child' })
    },

    async fetchData() {
      const data = await this.runRule(this.detailsRule, 0, {
        replacer: { path: this.$route.query.path as string }
      })
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
