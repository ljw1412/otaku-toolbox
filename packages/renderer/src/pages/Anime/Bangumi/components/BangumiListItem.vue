<template>
  <a-card class="bangumi-list-item"
    :bordered="false"
    :body-style="{padding:0}">
    <template #cover>
      <div ref="anchor"
        class="anime-anchor"
        :id="'anime-'+anime._id"></div>
    </template>
    <template #title>
      <a-row>
        <a-col class="anime-names"
          :lg="15"
          :xs="24"
          :sm="24">
          <div class="localized-name">
            <router-link target="_blank"
              :to="{name:'AnimeWiki',params:{id:anime._id},query:{app:'otakutools'}}">{{ anime.title }}</router-link>
          </div>
          <div class="original-name">
            {{ anime.titleOriginal }}
          </div>
        </a-col>
        <a-col class="anime-specs"
          :lg="9"
          :xs="24"
          :sm="24">
          <a-space size="mini"
            wrap
            class="anime-tags">
            <a-tag v-for="tag of anime.tags"
              :color="tag.color || 'arcoblue' "
              :key="tag._id">{{ tag.name }}</a-tag>
          </a-space>
          <div class="anime-onair">{{ onairStr }}</div>
          <div class="btn-push"
            @click="handlePushBtnClick"
            :href="'#anime-'+anime._id">
            <a-button>
              <template #icon>
                <icon-pushpin />
              </template>
            </a-button>
          </div>
        </a-col>
      </a-row>
    </template>
    <a-row>
      <a-col class="anime-gallery"
        :xl="7"
        :xs="8"
        :sm="8">
        <acg-gallery :images="anime.cover"
          :default-image="anime.coverMin"></acg-gallery>
      </a-col>
      <a-col :xl="17"
        :xs="16"
        :sm="16">
        <a-row class="anime-info"
          :gutter="{lg:8}">
          <a-col :lg="12">
            <div v-show="animeTitleMore"
              class="anime-name-more info-block">
              <h4>其它名称</h4>
              <p>{{ animeTitleMore }}</p>
            </div>
            <div v-show="anime.desc"
              class="anime-desc info-block">
              <h4>故事简介</h4>
              <p v-html="mDesc"></p>
            </div>
            <div v-show="anime.copyright"
              class="anime-copyright info-block">
              <i>{{ anime.copyright }}</i>
            </div>
            <div v-show="anime.links && anime.links.length"
              class="anime-links info-block">
              <h4>相关链接</h4>
              <p>
                <a-space wrap
                  size="mini">
                  <a-link v-for="link of anime.links"
                    :key="link.name"
                    :href="link.url"
                    :title="link.message || link.name"
                    class="anime-link"
                    target="_blank">{{ link.name }}</a-link>
                </a-space>
              </p>
            </div>
            <div v-show="streamingPlatforms && streamingPlatforms.length"
              class="anime-streaming info-block">
              <h4>网络播放</h4>
              <p>
                <a-space wrap
                  size="mini">
                  <a-link v-for="link of streamingPlatforms"
                    :key="link.url"
                    :href="link.url"
                    :status="link.hide?'warning':'normal'"
                    :title="getTitle(link)"
                    class="anime-link"
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
              </p>
            </div>
          </a-col>
          <a-col :lg="12">
            <div v-show="anime.cast&&anime.cast.length"
              class="anime-cast info-block">
              <h4>Cast</h4>
              <div v-for="person of anime.cast"
                :key="person.name"
                class="person">
                <span class="type">{{ person.name }}</span>
                <span> : </span>
                <span class="entity">{{ person.entity }}</span>
              </div>
            </div>
            <div v-show="anime.staff && anime.staff.length"
              class="anime-staff info-block">
              <h4>Staff</h4>
              <div v-for="person of anime.staff"
                :key="person.name"
                class="person">
                <span class="type">{{ person.name }}</span>
                <span> : </span>
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
import { defineComponent, PropType } from 'vue'
import { getLogoIcon } from '/@/utils/icons'
import { contra } from '/@/utils/contra'
import { onairMessage } from '/@/utils/dataFormat'

export default defineComponent({
  name: 'AnimeBangumiListItem',

  props: {
    anime: {
      type: Object as PropType<BangumiBasicWithTime>,
      default: () => ({})
    }
  },

  computed: {
    animeTitleMore(): string {
      return (this.anime.titleMore || []).join('、')
    },

    streamingPlatforms(): BangumiStreaming[] {
      if (!Array.isArray(this.anime.streamingPlatforms)) return []
      if (contra.flag) return this.anime.streamingPlatforms
      return this.anime.streamingPlatforms.filter(item => !item.hide)
    },

    mDesc(): string {
      return (this.anime.desc || '').replace(/\n/g, '<br />')
    },

    onair(): FormatedAnimeDatetime {
      return this.anime.formatOnair[this.hourSystem]
    },

    onairStr(): string {
      return onairMessage(this.onair, '播出日期：')
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
    handlePushBtnClick() {
      const anchor = this.$refs.anchor as HTMLElement
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }
})
</script>

<style lang="scss">
.bangumi-list-item {
  &.arco-card {
    box-shadow: var(--card-box-shadow);

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
      top: var(--list-item-header-height);

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

    a.anime-link {
      position: relative;
      text-align: center;
      > .link-icon {
        display: block;
        width: var(--list-item-link-icon-size);
        height: var(--list-item-link-icon-size);
        margin: 0 auto;
        object-fit: contain;
      }

      > .link-name {
        display: flex;
        height: var(--list-item-link-icon-size);
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

      > span {
        flex-shrink: 0;
      }

      &.arco-link-status-warning {
        .badge {
          background-color: rgb(var(--warning-6));
        }
      }
    }

    .info-block {
      margin-bottom: 6px;
      font-size: var(--list-item-info-font-size);
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
