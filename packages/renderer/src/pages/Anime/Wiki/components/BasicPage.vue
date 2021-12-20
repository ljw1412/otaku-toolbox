<template>
  <div class="basic-page">
    <acg-gallery :images="data.cover"
      :default-image="data.coverMin"
      @change="handleImageChange"></acg-gallery>
    <div class="bangumi-data">
      <a-typography-text class="title"
        copyable>{{data.title}}</a-typography-text>
      <div class="original-title">{{ data.titleOriginal }}</div>
      <a-space class="data-block tags"
        wrap>
        <a-tag v-for="tag of data.tags"
          :color="tag.color"
          :key="tag._id">{{ tag.name }}</a-tag>
      </a-space>
      <div class="data-block onair">
        <span v-if="onair.time"
          class="block-title">播出时间：</span>
        <span>{{ onairStr }}</span>
      </div>
      <div v-if="data.titleMore && data.titleMore.length"
        class="data-block title-more">
        <span class="block-title">其它名称：</span>
        <span v-for="title of data.titleMore"
          :key="title"
          class="title-item"><span>{{title}}</span></span>
      </div>
      <div class="data-block desc">
        <span class="block-title">故事简介：</span>
        <p v-html="mDesc"></p>
      </div>
      <div v-if="links.length"
        class="data-block links">
        <a-space wrap
          size="mini">
          <span class="block-title">相关链接：</span>
          <a-link v-for="link of links"
            :key="link.name"
            :href="link.url"
            :title="link.message || link.name"
            class="anime-link"
            target="_blank">{{ link.name }}</a-link>
        </a-space>
      </div>
      <div v-if="streamingPlatforms.length"
        class="data-block streamings">
        <span class="block-title">网络播放：</span>
        <a-space wrap
          size="mini">
          <a-link v-for="link of streamingPlatforms"
            :key="link.url"
            :href="link.url"
            :status="link.hide?'warning':'normal'"
            :title="getTitle(link)"
            class="anime-streaming"
            target="_blank">
            <img v-if="getLogoIcon(link.from)"
              :src="getLogoIcon(link.from)"
              class="link-icon">
            <span v-else
              class="link-name">{{ link.name }}</span>
            <div v-if="link.hide || link.region"
              class="badge">{{link.hide ? '隐藏' : link.region.replace(/,/g,'') }}</div>
          </a-link>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { getLogoIcon } from '/@/utils/icons'
import { contra } from '/@/utils/contra'
import { onairMessage } from '/@/utils/dataFormat'

export default defineComponent({
  name: 'AnimeBasicPage',
  props: {
    data: {
      type: Object as PropType<BangumiBasicWithTime>,
      default: () => ({})
    }
  },

  emits: ['image-change'],

  computed: {
    onair(): FormatedAnimeDatetime {
      return this.data.formatOnair && this.data.formatOnair[this.hourSystem]
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
    }
  },

  methods: {
    getLogoIcon(str: string) {
      if (str.startsWith('http') || str.startsWith('//')) {
        return str
      }
      return getLogoIcon(str)
    },

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
  width: var(--basic-page-width);
  margin: 0 auto;
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

  .bangumi-data {
    padding-left: 24px;
    text-shadow: 0 0 0 currentColor;
  }

  .data-block {
    margin-top: 16px;
    font-size: 16px;
  }

  .title {
    font-size: 36px;
    font-weight: bold;
    [class^='arco-typography-operation-'] {
      font-size: 0.6em;
    }
  }

  .original-title {
    font-size: 20px;
    font-style: italic;
  }

  .tags {
    margin-top: 6px;
  }

  .title-more {
    font-size: 14px;
    line-height: 1.2em;
    .title-item {
      > span:hover {
        background-color: var(--color-fill-4);
      }

      &:not(:last-child)::after {
        content: '、';
      }
    }
  }

  .desc p {
    line-height: 1.5em;
  }

  .anime-link {
    font-size: inherit;
    font-weight: bold;
  }

  .streamings .block-title {
    vertical-align: top;
  }

  .anime-streaming {
    position: relative;
    text-align: center;

    > .link-icon {
      display: block;
      width: 4em;
      height: 4em;
      margin: 0 auto;
      object-fit: contain;
    }
    > .link-name {
      display: flex;
      height: 4em;
      justify-items: center;
      align-items: center;
    }

    .badge {
      position: absolute;
      left: 0;
      top: 0;
      font-size: 12px;
      line-height: 16px;
      padding: 0 2px;
      color: #ffffff;
      background-color: rgb(var(--danger-6));
      box-shadow: 0 0 0 1px var(--color-bg-2);
    }

    &.arco-link-status-warning {
      .badge {
        background-color: rgb(var(--warning-6));
      }
    }
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

    .bangumi-data {
      padding: 16px;
    }
  }
}
</style>
