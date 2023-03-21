<template>
  <a-card
    ref="cardRef"
    class="bangumi-list-item"
    :bordered="false"
    :body-style="{ padding: 0 }"
    :class="{ 'filter-gray': anime.markState.isBan }"
    :data-loaded="isLoaded"
  >
    <template #cover>
      <div ref="anchor" class="anime-anchor" :id="'anime-' + anime._id"></div>
    </template>
    <template #title>
      <a-row>
        <a-col class="anime-names" :lg="15" :xs="24" :sm="24">
          <div class="localized-name">
            <router-link
              target="_blank"
              :to="{
                name: 'BangumiDetail',
                params: { id: anime._id },
                query: { app: 'otakutools' }
              }"
            >
              {{ anime.title }}
            </router-link>
          </div>
          <div class="original-name">{{ anime.titleOriginal }}</div>
        </a-col>
        <a-col class="anime-specs" :lg="9" :xs="24" :sm="24">
          <a-space size="mini" class="anime-tags">
            <a-tag
              v-for="tag of anime.tags"
              :color="tag.color || 'arcoblue'"
              :size="isMobileSize ? 'small' : undefined"
              :key="tag._id"
              >{{ tag.name }}</a-tag
            >
          </a-space>
          <div class="anime-onair">
            <span>{{ onairStr }}</span>
            <template
              v-if="anime.isSubTagMatched || anime.markState.isPostpone"
            >
              <a-divider direction="vertical" />
              <a-typography-text
                :type="anime.markState.isPostpone ? 'warning' : 'primary'"
                >{{
                  anime.markState.isPostpone ? '延期放送' : '跨季放送'
                }}</a-typography-text
              >
            </template>
          </div>
          <div
            class="btn-push"
            :href="'#anime-' + anime._id"
            @click="handlePushBtnClick"
          >
            <a-button>
              <template #icon>
                <icon-pushpin />
              </template>
            </a-button>
          </div>
        </a-col>
      </a-row>
    </template>
    <a-row class="bangumi-info">
      <a-col class="anime-gallery" :xl="7" :xs="8" :sm="8">
        <acg-gallery
          :images="anime.cover"
          :default-image="anime.coverMin"
        ></acg-gallery>
      </a-col>
      <a-col :xl="17" :xs="16" :sm="16">
        <a-row class="anime-info" :gutter="{ lg: 8 }">
          <a-col :span="24" style="margin-bottom: 4px">
            <div v-if="anime.markState.isBan" class="info-block anime-alert">
              <a-alert type="warning">该动画存在严重争议问题！</a-alert>
            </div>
            <a-alert v-if="(anime.tips || '').trim()" type="warning">
              <div v-html="mTips"></div>
            </a-alert>
          </a-col>
          <a-col :lg="12">
            <div v-show="animeTitleMore" class="anime-name-more info-block">
              <h4>其它名称</h4>
              <p>{{ animeTitleMore }}</p>
            </div>
            <div v-show="anime.desc" class="anime-desc info-block">
              <h4>故事简介</h4>
              <p v-html="mDesc"></p>
            </div>
            <div v-show="anime.copyright" class="anime-copyright info-block">
              <i>{{ anime.copyright }}</i>
            </div>
            <div
              v-show="anime.links && anime.links.length"
              class="anime-links info-block"
            >
              <h4>相关链接</h4>
              <p>
                <a-space wrap size="mini">
                  <a-link
                    v-for="link of anime.links"
                    :key="link.name"
                    :href="link.url"
                    :title="link.message || link.name"
                    class="anime-link"
                    target="_blank"
                    @click="handleLinkClick($event, link)"
                  >
                    <img
                      v-if="link.type === 'trailer' && getLinkFrom(link)"
                      :src="getLogoIcon(getLinkFrom(link))"
                      style="width: 14px; height: 14px; margin-right: 2px"
                    />
                    {{ link.name }}
                  </a-link>
                </a-space>
              </p>
            </div>
            <div
              v-show="
                isSecretMode ||
                (streamingPlatforms && streamingPlatforms.length)
              "
              class="anime-streaming info-block"
            >
              <h4>网络播放</h4>
              <p>
                <a-space wrap size="mini">
                  <acg-stream-item
                    v-for="link of streamingPlatforms"
                    :key="link.url"
                    mode="icon"
                    v-bind="link"
                  >
                  </acg-stream-item>
                  <acg-stream-item
                    v-if="isSecretMode"
                    mode="icon"
                    from="DMHY"
                    name="动漫花园"
                    region="资源"
                    :url="`https://share.dmhy.org/topics/list?keyword=${anime.title}`"
                  >
                  </acg-stream-item>
                </a-space>
              </p>
            </div>
          </a-col>
          <a-col :lg="12">
            <div
              v-show="anime.cast && anime.cast.length"
              class="anime-cast info-block"
            >
              <h4>Cast</h4>
              <div
                v-for="person of anime.cast"
                :key="person.name"
                class="person"
              >
                <span class="type">{{ person.name }}</span>
                <span>:</span>
                <span class="entity">{{ person.entity }}</span>
              </div>
            </div>
            <div
              v-show="anime.staff && anime.staff.length"
              class="anime-staff info-block"
            >
              <h4>Staff</h4>
              <div
                v-for="person of anime.staff"
                :key="person.name"
                class="person"
              >
                <span class="type">{{ person.name }}</span>
                <span>:</span>
                <span class="entity">{{ person.entity }}</span>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import type { CardInstance } from '@arco-design/web-vue'
import { onairMessage } from '/@/utils/dataFormat'

export default defineComponent({
  name: 'AnimeBangumiListItem',

  props: {
    anime: {
      type: Object as PropType<FormatedBangumiBasic>,
      default: () => ({})
    }
  },

  setup() {
    const isLoaded = ref(false)
    const cardRef = ref<CardInstance>()

    try {
      const { isSupported, stop } = useIntersectionObserver(
        cardRef,
        ([{ isIntersecting }], observerElement) => {
          if (isIntersecting) {
            isLoaded.value = true
            stop()
          }
        }
      )

      if (!isSupported.value) {
        isLoaded.value = true
      }
    } catch (error) {
      isLoaded.value = true
      console.groupCollapsed('[ListItem] 懒加载监听失败，改用正常加载模式！')
      console.error(error)
      console.groupEnd()
    }

    return { isLoaded, cardRef }
  },

  computed: {
    animeTitleMore(): string {
      return (this.anime.titleMore || []).join('、')
    },

    streamingPlatforms(): BangumiStreaming[] {
      if (!Array.isArray(this.anime.streamingPlatforms)) return []
      if (this.isSecretMode) return this.anime.streamingPlatforms
      return this.anime.streamingPlatforms.filter((item) => !item.hide)
    },

    mDesc(): string {
      return (this.anime.desc || '').replace(/\n/g, '<br />')
    },

    mTips() {
      return (this.anime.tips || '').replace(/\n/g, '<br />')
    },

    onair(): FormatedAnimeDatetime {
      return this.anime.formatOnair[this.hourSystem]
    },

    onairStr(): string {
      return onairMessage(this.onair, '播出日期：')
    }
  },

  methods: {
    getLinkFrom(link: BangumiLink) {
      if (link.url.includes('.bilibili.com')) return 'Bilibili'
      if (link.url.includes('.youtube.com')) return 'YouTube'
      return
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

    handlePushBtnClick() {
      const anchor = this.$refs.anchor as HTMLElement
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },

    appendAutoPlay(url: string, autoplay = '0') {
      return (url += (url.includes('?') ? '&' : '?') + 'autoplay=' + autoplay)
    },

    handleLinkClick(ev: MouseEvent, link: BangumiLink) {
      if (link.type === 'trailer') {
        ev.preventDefault()
        let { url } = link
        if (this.$global.config.bangumi.newOpenTrailer) {
          url = this.appendAutoPlay(url, '1')
          if (url.includes('.bilibili.com')) {
            const [, search] = url.split('?')
            url = `https://www.bilibili.com/blackboard/html5player.html?${search}`
          }
          window.open(url, '_blank')
          return
        }
        this.$global.dialog.showIframePlayer(link.url, { name: link.name })
      }
    }
  }
})
</script>

<style lang="scss">
.bangumi-list-item {
  margin-left: var(--list-item-margin-x);
  margin-right: var(--list-item-margin-x);

  &[data-loaded~='false'] .bangumi-info > * {
    display: none;
  }

  .bangumi-info {
    min-height: var(--list-item-content-min-height);
  }

  &.arco-card {
    box-shadow: 0 0 5px rgba(178, 178, 178, 0.2);

    > .arco-card-header {
      position: sticky;
      top: 0;
      height: var(--list-item-header-height);
      background-color: var(--color-bg-2);
      padding: 4px 8px;
      z-index: 100;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background-color: var(--color-fill-2);
      }

      .localized-name {
        font-size: 24px;
        line-height: 28px;
        font-weight: 700;
      }

      .original-name {
        font-size: 18px;
        line-height: 20px;
        font-weight: 400;
      }

      .anime-onair {
        font-size: var(--anime-onair-fs, 15px);
      }
    }

    > .arco-card-cover {
      position: absolute;
      top: 0;
      left: 0;
    }

    > .arco-card-body {
      position: relative;
      color: var(--color-text-1);
    }
  }

  .anime-specs {
    position: relative;
    padding-top: 2px;

    .btn-push {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }

  .anime-gallery {
    position: relative;
    font-size: 0;
    background-color: rgba(0, 0, 0, 0.15);
    align-self: stretch;

    .acg-gallery {
      --thumbnail-size: var(--list-item-gallery-item-size, 64);

      position: sticky;
      top: calc(var(--list-item-header-height) + var(--app-header-height));

      .gallery-image {
        width: 100%;
      }
    }
  }

  .anime-info {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    line-height: 1.4em;

    h4 {
      color: var(--color-text-3);
      font-size: var(--list-item-info-min-font-size);
      border-bottom: 1px solid var(--color-border);
      margin-bottom: 2px;
    }

    p {
      padding: 4px 0;
    }

    .info-block {
      margin-bottom: 6px;
      font-size: var(--list-item-info-font-size);
    }

    .anime-desc {
      > p {
        line-height: 1.5em;
      }
    }

    .anime-name-more,
    .anime-copyright {
      color: var(--color-text-2);
      font-size: var(--list-item-info-min-font-size);
      font-weight: 300;
    }
  }

  & + & {
    margin-top: 12px;
  }
}
</style>
