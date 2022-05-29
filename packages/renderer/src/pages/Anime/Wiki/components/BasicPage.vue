<template>
  <div class="basic-page">
    <acg-gallery :images="data.cover" :default-image="data.coverMin" @change="handleImageChange"></acg-gallery>
    <div class="anime-data">
      <div class="data-header">
        <div class="core">
          <a-typography-title :heading="3" class="title" copyable>{{ data.title }}</a-typography-title>
          <a-typography-text
            class="original-title"
            :copyable="!hasMoreTitle"
          >{{ data.titleOriginal }}</a-typography-text>
          <a-popover v-if="hasMoreTitle" position="bottom" title="更多名称" mini>
            <a-button size="mini" style="margin-left:4px;margin-bottom:4px;">
              <template #icon>
                <icon-down />
              </template>
            </a-button>
            <template #content>
              <div class="anime-title-more">
                <p>
                  <a-typography-text class="title-item" copyable>
                    <span>{{ data.titleOriginal }}</span>
                  </a-typography-text>
                </p>
                <p v-for="title of data.titleMore" :key="title">
                  <a-typography-text class="title-item" copyable>
                    <span>{{ title }}</span>
                  </a-typography-text>
                </p>
              </div>
            </template>
          </a-popover>
          <a-space class="tags" style="display: flex;" size="mini" wrap>
            <a-tag v-for="tag of data.tags" :color="tag.color" :key="tag._id">{{ tag.name }}</a-tag>
          </a-space>
        </div>
        <anime-rate :rating-site="data.ratingSite"></anime-rate>
      </div>

      <div class="data-main">
        <a-typography-text type="secondary" class="onair">
          <span v-if="onair.time" class="block-title">播出时间：</span>
          <span>{{ onairStr }}</span>
        </a-typography-text>

        <div v-if="data.markState && data.markState.isBan" class="info-block anime-alert">
          <a-alert type="warning">该动画存在严重争议问题！</a-alert>
        </div>

        <p class="data-block desc" v-html="mDesc"></p>

        <div v-if="streamingPlatforms.length" class="data-block streamings">
          <a-space wrap size="mini">
            <acg-stream-item v-for="link of streamingPlatforms" :key="link.url" v-bind="link"></acg-stream-item>
          </a-space>
        </div>

        <div v-if="links.length" class="data-block links">
          <a-space wrap size="mini">
            <a-typography-text type="secondary" class="block-title">相关链接：</a-typography-text>
            <a-link
              v-for="link of links"
              :key="link.name"
              :href="link.url"
              :title="link.message || link.name"
              class="anime-link"
              target="_blank"
            >{{ link.name }}</a-link>
          </a-space>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import AnimeRate from './AnimeRate.vue'
import { contra } from '/@/utils/contra'
import { onairMessage } from '/@/utils/dataFormat'

export default defineComponent({
  name: 'AnimeBasicPage',

  components: { AnimeRate },

  props: {
    data: {
      type: Object as PropType<BangumiBasicWithTime>,
      default: () => ({})
    }
  },

  emits: ['image-change'],

  computed: {
    onair(): FormatedAnimeDatetime {
      if (this.data.formatOnair) {
        return this.data.formatOnair[this.hourSystem]
      }
      return {} as FormatedAnimeDatetime
    },

    onairStr() {
      return onairMessage(this.onair)
    },

    links(): BangumiLink[] {
      return this.data.links || []
    },

    streamingPlatforms(): BangumiStreaming[] {
      if (!Array.isArray(this.data.streamingPlatforms)) return []
      if (contra.flag) return this.data.streamingPlatforms
      return this.data.streamingPlatforms.filter(item => !item.hide)
    },

    mDesc() {
      return (this.data.desc || '').replace(/\n/g, '<br />')
    },

    hasMoreTitle() {
      return this.data.titleMore && this.data.titleMore.length
    }
  },

  methods: {
    getTitle(link: BangumiStreaming) {
      let title = link.name
      if (link.region) {
        title = `[${link.region.replace(/,/g, '')}]` + title
      }
      if (link.message) {
        title += '\n' + link.message
      }
      return title
    },

    handleImageChange(image: string) {
      this.$emit('image-change', image)
    }
  }
})
</script>

<style lang="scss">
.basic-page {
  display: flex;
  width: 100%;
  padding: 80px 0;
  box-sizing: border-box;

  .acg-gallery {
    flex-shrink: 0;
    max-width: var(--basic-page-gallery-width);
    .gallery-image {
      box-shadow: 0 0 5px var(--color-fill-4);
      border-radius: 4px;
      overflow: hidden;
    }
  }

  .data-block {
    margin-bottom: 12px;
  }

  .anime-data {
    box-sizing: border-box;
    width: 100%;
    padding-left: 24px;
    text-shadow: 0 0 0 currentColor;
  }

  .data-header {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .title {
    margin: 0;
  }

  .original-title {
    margin: 0;
    font-size: 16px;
  }

  .desc {
    margin-top: 12px;
    line-height: 1.5em;
    font-size: 14px;
  }
}

@media (max-width: 991.9px) {
  .basic-page {
    .acg-gallery {
      --gallery-width: 360px;
      --gallery-height: 480px;
    }
  }
}
@media (max-width: 767.9px) {
  .basic-page {
    flex-direction: column;
    padding: 0;
    .acg-gallery {
      --gallery-width: 100vw;
      --gallery-height: 133.33vw;
    }

    .anime-data {
      padding: 16px;
    }
  }
}
</style>
