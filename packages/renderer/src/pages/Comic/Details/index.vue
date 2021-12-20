<template>
  <div class="comic-details app-drag">
    <div class="close-btn layout-center app-no-drag"
      @click="close">
      <icon-close />
    </div>
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
          <a-typography-title style="margin-top: 0;padding-top:12px;">
            {{ info.title }}
          </a-typography-title>
        </div>
        <a-space wrap
          size="mini"
          class="chapter-grid app-no-drag">
          <a-button v-for="chapter of chapterList"
            :key="chapter.url"
            style="width: 100px;">{{ chapter.name }}</a-button>
        </a-space>
      </div>
    </div>

    <div class="comic-details-toolbar"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRaw } from 'vue'
import { ipcSend } from '/@/utils/electron'

export default defineComponent({
  name: 'ComicDetails',

  props: { namespace: { type: String, default: 'xxx' } },

  data() {
    return {
      info: {} as Record<string, any>,
      rule: {} as DataCenter.ComicRule
    }
  },

  computed: {
    detailsRule() {
      return this.rule.details
    },

    chapterList(): { name: string; url: string }[] {
      return this.info.list || []
    }
  },

  async created() {
    await this.fetchRule()
    if (this.detailsRule) {
      this.runRule()
    }
  },

  methods: {
    close() {
      ipcSend('window.action', 'close', { mode: 'child' })
    },

    async fetchRule() {
      this.rule = await this.$API.DataCenter.showRule(
        'comic-book',
        this.namespace
      )
    },

    async runRule() {
      const data = await this.$API.DataCenter.runRule(
        toRaw(this.detailsRule),
        0,
        { replacer: { path: this.$route.query.path as string } }
      )
      this.info = data
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
  }

  .comic-details-toolbar {
    position: relative;
    height: calc(100% - 460px);
    background: var(--color-bg-1);
    box-shadow: 0 0 8px var(--color-fill-2);
    z-index: 1;
  }

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

  .chapter-grid {
    max-height: 80%;
    overflow-y: auto;
  }

  .close-btn {
    position: fixed;
    top: 0;
    right: 0;
    width: 48px;
    height: 48px;
    font-size: 36px;
    background-color: var(--color-danger-light-3);
    color: #ffffff;
    cursor: pointer;

    &:hover {
      background-color: var(--color-danger-light-4);
    }
    &:active {
      background-color: #f95a44;
    }
  }
}
</style>
